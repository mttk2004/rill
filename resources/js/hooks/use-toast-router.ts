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
          // Store the start path to compare later
        },
        onSuccess: (response: unknown) => {
          clearTimeout(timeout);

          // Check if path changed to login/register (auth redirect)
          const currentPath = window.location.pathname;
          if (currentPath === '/login' || currentPath === '/register') {
            if (currentPath !== startPath) {
              // We were redirected to login/register
              isRedirecting = true;
              reject(new Error('REDIRECT'));
              return;
            }
          }

          hasCompleted = true;
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
          reject(new Error(typeof errorMessage === 'string' ? errorMessage : 'An error occurred'));
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
            reject(new Error('REDIRECT'));
          }

          if (options.onFinish) {
            options.onFinish();
          }
        },
      } as never);
    }).catch((error) => {
      // Don't throw if we're redirecting
      if (isRedirecting || (error as Error).message === 'REDIRECT') {
        return Promise.reject(new Error('REDIRECT'));
      }
      throw error;
    });

    // Only show toast if we have a pending message
    if (messages.pending) {
      toast.promise(promise, {
        pending: messages.pending,
        success: messages.success,
        error: {
          render({ data }: { data: Error | unknown }) {
            const error = data as Error;
            // Don't show error toast for redirects
            if (error?.message === 'REDIRECT') {
              return null;
            }
            if (typeof messages.error === 'function') {
              return messages.error(data);
            }
            if (typeof messages.error === 'string') {
              return messages.error;
            }
            return error?.message || 'An error occurred';
          },
        },
      });
    }

    return promise.catch(() => {
      // Suppress redirect errors
      if (isRedirecting) {
        return;
      }
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
