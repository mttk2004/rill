import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';

interface ToastMessages {
  pending?: string;
  success: string;
  error?: string | ((error: unknown) => string);
}

interface RouterOptions {
  preserveScroll?: boolean;
  preserveState?: boolean;
  only?: string[];
  onBefore?: () => boolean | void;
  onSuccess?: (response: unknown) => void;
  onError?: (errors: Record<string, unknown>) => void;
  onFinish?: () => void;
}

/**
 * Custom hook to wrap Inertia router with toast notifications
 * Provides consistent toast patterns across the application
 *
 * @example
 * const { post, put, delete: destroy } = useToastRouter();
 *
 * // Simple usage
 * post('/orders', data, {
 *   success: 'Order created successfully!'
 * });
 *
 * // With all options
 * post('/orders', data, {
 *   pending: 'Creating order...',
 *   success: 'Order created!',
 *   error: (err) => err.message || 'Failed to create order'
 * }, { preserveScroll: true });
 */
export function useToastRouter() {
  /**
   * Wrapper for router methods with toast notifications
   */
  const makeRequest = (
    method: 'post' | 'put' | 'patch' | 'delete',
    url: string,
    data: Record<string, unknown> | undefined,
    messages: ToastMessages,
    options: RouterOptions = {}
  ) => {
    let isRedirecting = false;
    let hasCompleted = false;
    let pendingToastId: ReturnType<typeof toast.loading> | null = null;
    const startPath = window.location.pathname;

    const promise = new Promise((resolve, reject) => {
      const requestData = method === 'delete' ? undefined : data;

      // Add timeout to prevent hanging forever
      const timeout = setTimeout(() => {
        if (!isRedirecting && !hasCompleted) {
          reject(new Error('Request timeout - no response from server'));
        }
      }, 30000); // 30 second timeout

      router[method](url, requestData as never, {
        ...options,
        onBefore: () => {
          if (options.onBefore) {
            return (options.onBefore as () => boolean | void)();
          }
        },
        onStart: () => {
          // Show pending toast
          if (messages.pending) {
            pendingToastId = toast.loading(messages.pending);
          }
        },
        onSuccess: (response: unknown) => {
          clearTimeout(timeout);

          // Check if path changed to login/register (auth redirect)
          const currentPath = window.location.pathname;
          if (currentPath === '/login' || currentPath === '/register') {
            if (currentPath !== startPath) {
              // We were redirected to login/register - dismiss pending toast and show info
              isRedirecting = true;
              if (pendingToastId) {
                toast.update(pendingToastId, {
                  render: 'Vui lòng đăng nhập để tiếp tục',
                  type: 'info',
                  isLoading: false,
                  autoClose: 4000,
                });
              } else {
                toast.info('Vui lòng đăng nhập để tiếp tục');
              }
              reject(new Error('REDIRECT'));
              return;
            }
          }

          hasCompleted = true;

          // Update pending toast to success
          if (pendingToastId) {
            toast.update(pendingToastId, {
              render: messages.success,
              type: 'success',
              isLoading: false,
              autoClose: 3000,
            });
          } else {
            toast.success(messages.success);
          }

          resolve(response);
          if (options.onSuccess) {
            options.onSuccess(response);
          }
        },
        onError: (errors: Record<string, unknown>) => {
          clearTimeout(timeout);
          hasCompleted = true;

          // Extract first error message
          const errorMessage = errors.message || Object.values(errors)[0];
          const errorText = typeof errorMessage === 'string' ? errorMessage : 'An error occurred';

          // Update pending toast to error
          if (pendingToastId) {
            const errorMsg = typeof messages.error === 'function'
              ? messages.error(new Error(errorText))
              : messages.error || errorText;

            toast.update(pendingToastId, {
              render: errorMsg,
              type: 'error',
              isLoading: false,
              autoClose: 5000,
            });
          } else if (messages.error) {
            const errorMsg = typeof messages.error === 'function'
              ? messages.error(new Error(errorText))
              : messages.error;
            toast.error(errorMsg);
          }

          reject(new Error(errorText));
          if (options.onError) {
            options.onError(errors);
          }
        },
        onFinish: () => {
          clearTimeout(timeout);

          // Double-check for redirect in onFinish as well
          const currentPath = window.location.pathname;
          if (!hasCompleted && currentPath !== startPath && (currentPath === '/login' || currentPath === '/register')) {
            isRedirecting = true;
            if (pendingToastId) {
              toast.update(pendingToastId, {
                render: 'Vui lòng đăng nhập để tiếp tục',
                type: 'info',
                isLoading: false,
                autoClose: 4000,
              });
            } else {
              toast.info('Vui lòng đăng nhập để tiếp tục');
            }
            reject(new Error('REDIRECT'));
          }

          if (options.onFinish) {
            options.onFinish();
          }
        },
      } as never);
    });

    return promise.catch((error) => {
      // Suppress redirect errors silently
      if (isRedirecting || (error as Error)?.message === 'REDIRECT') {
        return;
      }
      // Re-throw other errors
      throw error;
    });
  };

  return {
    /**
     * POST request with toast notifications
     */
    post: (
      url: string,
      data: Record<string, unknown>,
      messages: ToastMessages,
      options?: RouterOptions
    ) => makeRequest('post', url, data, messages, options),

    /**
     * PUT request with toast notifications
     */
    put: (
      url: string,
      data: Record<string, unknown>,
      messages: ToastMessages,
      options?: RouterOptions
    ) => makeRequest('put', url, data, messages, options),

    /**
     * PATCH request with toast notifications
     */
    patch: (
      url: string,
      data: Record<string, unknown>,
      messages: ToastMessages,
      options?: RouterOptions
    ) => makeRequest('patch', url, data, messages, options),

    /**
     * DELETE request with toast notifications
     */
    delete: (
      url: string,
      messages: ToastMessages,
      options?: RouterOptions
    ) => makeRequest('delete', url, undefined, messages, options),
  };
}
