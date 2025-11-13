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
  onSuccess?: (response: unknown) => void;
  onError?: (errors: Record<string, unknown>) => void;
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
    const promise = new Promise((resolve, reject) => {
      const routerMethod = router[method];
      const requestData = method === 'delete' ? undefined : data;

      routerMethod(url, requestData as never, {
        ...options,
        onSuccess: (response: unknown) => {
          resolve(response);
          if (options.onSuccess) {
            options.onSuccess(response);
          }
        },
        onError: (errors: Record<string, unknown>) => {
          // Extract first error message
          const errorMessage = errors.message || Object.values(errors)[0];
          reject(new Error(typeof errorMessage === 'string' ? errorMessage : 'An error occurred'));
          if (options.onError) {
            options.onError(errors);
          }
        },
      } as never);
    });

    toast.promise(promise, {
      pending: messages.pending || 'Processing...',
      success: messages.success,
      error: {
        render({ data }: { data: Error | unknown }) {
          if (typeof messages.error === 'function') {
            return messages.error(data);
          }
          if (typeof messages.error === 'string') {
            return messages.error;
          }
          const error = data as Error;
          return error?.message || 'An error occurred';
        },
      },
    });

    return promise;
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
