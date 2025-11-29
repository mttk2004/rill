
import React from 'react';
import Button from './Button';
import { AlertTriangle, Info } from 'lucide-react';

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  type?: 'danger' | 'info';
  confirmText?: string;
  cancelText?: string;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  type = 'danger',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy bỏ'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl animate-in zoom-in-95 duration-200"
        role="alertdialog"
        aria-modal="true"
      >
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${type === 'danger' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
              {type === 'danger' ? <AlertTriangle size={24} /> : <Info size={24} />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">
                {title}
              </h3>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            {description}
          </p>

          <div className="flex justify-end gap-3">
            <Button 
              variant="secondary" 
              onClick={onClose}
              className="text-sm px-4 py-2 h-auto"
            >
              {cancelText}
            </Button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`inline-flex items-center justify-center rounded-lg border border-transparent px-4 py-2 text-sm font-bold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                type === 'danger' 
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                  : 'bg-primary hover:bg-primaryHover focus:ring-primary'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;
