
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
  const [progress, setProgress] = useState<Record<string, number>>({});

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setProgress((prev) => ({ ...prev, [id]: 100 }));

    // Auto remove: 4s for success, 5s for error, 4s for info
    const duration = type === 'error' ? 5000 : 4000;

    // Animate progress bar
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress((prev) => ({ ...prev, [id]: remaining }));

      if (remaining === 0) {
        clearInterval(progressInterval);
      }
    }, 50);

    setTimeout(() => {
      removeToast(id);
      clearInterval(progressInterval);
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
      setProgress((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, 400); // Match animation duration
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container - Bottom Left */}
      <div className="fixed bottom-6 left-6 z-[200] flex flex-col-reverse gap-3 pointer-events-none max-w-md">
        {toasts.map((toast, index) => {
          const isRemoving = removingToasts.has(toast.id);
          const currentProgress = progress[toast.id] || 0;

          return (
            <div
              key={toast.id}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
              className={`
                relative overflow-hidden pointer-events-auto flex flex-col min-w-[320px] rounded-xl shadow-2xl backdrop-blur-md transform
                ${!isRemoving
                  ? 'animate-[slideInBounce_0.5s_cubic-bezier(0.68,-0.55,0.265,1.55)_forwards]'
                  : 'animate-[slideOutFade_0.4s_ease-in-out_forwards]'
                }
                ${toast.type === 'success' ? 'bg-gradient-to-br from-green-50/95 to-emerald-50/95 border-2 border-green-200/60 text-gray-900' : ''}
                ${toast.type === 'error' ? 'bg-gradient-to-br from-red-50/95 to-rose-50/95 border-2 border-red-200/60 text-gray-900' : ''}
                ${toast.type === 'info' ? 'bg-gradient-to-br from-blue-50/95 to-indigo-50/95 border-2 border-blue-200/60 text-gray-900' : ''}
                hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200
              `}
            >
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-black/5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-100 ease-linear ${toast.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                      toast.type === 'error' ? 'bg-gradient-to-r from-red-500 to-rose-500' :
                        'bg-gradient-to-r from-blue-500 to-indigo-500'
                    }`}
                  style={{ width: `${currentProgress}%` }}
                />
              </div>

              {/* Content */}
              <div className="flex items-start gap-3 p-4 pt-5">
                <div className="flex-shrink-0 mt-0.5">
                  {toast.type === 'success' && (
                    <div className="bg-green-500 rounded-full p-1.5 shadow-lg animate-[bounceIn_0.6s_cubic-bezier(0.68,-0.55,0.265,1.55)]">
                      <CheckCircle size={18} className="text-white" strokeWidth={2.5} />
                    </div>
                  )}
                  {toast.type === 'error' && (
                    <div className="bg-red-500 rounded-full p-1.5 shadow-lg animate-[bounceIn_0.6s_cubic-bezier(0.68,-0.55,0.265,1.55)]">
                      <AlertCircle size={18} className="text-white" strokeWidth={2.5} />
                    </div>
                  )}
                  {toast.type === 'info' && (
                    <div className="bg-blue-500 rounded-full p-1.5 shadow-lg animate-[bounceIn_0.6s_cubic-bezier(0.68,-0.55,0.265,1.55)]">
                      <Info size={18} className="text-white" strokeWidth={2.5} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-relaxed break-words">{toast.message}</p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-700 transition-all duration-200 p-1.5 hover:bg-white/60 rounded-lg hover:rotate-90 hover:scale-110 active:scale-95"
                  aria-label="Đóng thông báo"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes slideInBounce {
          0% {
            transform: translateX(-100%) scale(0.8);
            opacity: 0;
          }
          50% {
            transform: translateX(10px) scale(1.05);
          }
          100% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes slideOutFade {
          0% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateX(-120%) scale(0.8);
            opacity: 0;
          }
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};
