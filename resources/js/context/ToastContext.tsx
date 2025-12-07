
import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext(undefined as unknown as ToastContextType);

export const ToastProvider = ({ children }: { children?: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [removingToasts, setRemovingToasts] = useState<Set<string>>(new Set());

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove: 4s for success, 5s for error, 4s for info
    const duration = type === 'error' ? 5000 : 4000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = (id: string) => {
    // Add exit animation
    setRemovingToasts((prev) => new Set(prev).add(id));

    // Remove from DOM after animation completes
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      setRemovingToasts((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 300); // Match animation duration
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container - Bottom Left */}
      <div className="fixed bottom-6 left-6 z-[200] flex flex-col-reverse gap-3 pointer-events-none max-w-md">
        {toasts.map((toast) => {
          const isRemoving = removingToasts.has(toast.id);

          return (
            <div
              key={toast.id}
              className={`
                pointer-events-auto flex items-start gap-3 min-w-[320px] p-4 rounded-xl shadow-2xl backdrop-blur-sm transform transition-all duration-300 ease-out
                ${!isRemoving ? 'animate-in slide-in-from-left fade-in' : 'animate-out slide-out-to-left fade-out'}
                ${toast.type === 'success' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 text-gray-900' : ''}
                ${toast.type === 'error' ? 'bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/50 text-gray-900' : ''}
                ${toast.type === 'info' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 text-gray-900' : ''}
                hover:shadow-3xl hover:scale-[1.02] active:scale-[0.98]
              `}
            >
              <div className="flex-shrink-0 mt-0.5">
                {toast.type === 'success' && (
                  <div className="bg-green-500 rounded-full p-1 animate-in zoom-in duration-200">
                    <CheckCircle size={18} className="text-white" strokeWidth={2.5} />
                  </div>
                )}
                {toast.type === 'error' && (
                  <div className="bg-red-500 rounded-full p-1 animate-in zoom-in duration-200">
                    <AlertCircle size={18} className="text-white" strokeWidth={2.5} />
                  </div>
                )}
                {toast.type === 'info' && (
                  <div className="bg-blue-500 rounded-full p-1 animate-in zoom-in duration-200">
                    <Info size={18} className="text-white" strokeWidth={2.5} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-relaxed break-words">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-700 transition-all duration-200 p-1 hover:bg-white/50 rounded-md hover:rotate-90"
                aria-label="Đóng thông báo"
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};
