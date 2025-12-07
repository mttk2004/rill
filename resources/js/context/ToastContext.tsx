
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

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove: 4s for success, 5s for error, 4s for info
    const duration = type === 'error' ? 5000 : 4000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container - Bottom Left */}
      <div className="fixed bottom-6 left-6 z-[200] flex flex-col-reverse gap-3 pointer-events-none max-w-md">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex items-start gap-3 min-w-[320px] p-4 rounded-xl shadow-2xl backdrop-blur-sm transform transition-all duration-300 ease-out animate-in slide-in-from-left
              ${toast.type === 'success' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 text-gray-900' : ''}
              ${toast.type === 'error' ? 'bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/50 text-gray-900' : ''}
              ${toast.type === 'info' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 text-gray-900' : ''}
            `}
          >
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === 'success' && (
                <div className="bg-green-500 rounded-full p-1">
                  <CheckCircle size={18} className="text-white" strokeWidth={2.5} />
                </div>
              )}
              {toast.type === 'error' && (
                <div className="bg-red-500 rounded-full p-1">
                  <AlertCircle size={18} className="text-white" strokeWidth={2.5} />
                </div>
              )}
              {toast.type === 'info' && (
                <div className="bg-blue-500 rounded-full p-1">
                  <Info size={18} className="text-white" strokeWidth={2.5} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-relaxed break-words">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-700 transition-colors p-1 hover:bg-white/50 rounded-md"
              aria-label="Đóng thông báo"
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};
