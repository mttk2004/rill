import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import Button from '../components/Button';
import AppLayout from '@/layouts/app-layout';
import { useToast } from '../context/ToastContext';

interface VerifyEmailProps {
  status?: string;
}

const VerifyEmail = ({ status }: VerifyEmailProps) => {
  const { showToast } = useToast();
  const [resending, setResending] = useState(false);

  const handleResendEmail = () => {
    setResending(true);
    router.post(
      '/email/verification-notification',
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          showToast('Email xác nhận đã được gửi lại!', 'success');
          setResending(false);
        },
        onError: () => {
          showToast('Có lỗi xảy ra. Vui lòng thử lại sau.', 'error');
          setResending(false);
        },
      }
    );
  };

  return (
    <AppLayout>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header với icon */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
                <Mail size={40} className="text-primary" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                Xác nhận email của bạn
              </h1>
              <p className="text-gray-600 text-sm">
                Chúng tôi đã gửi một email xác nhận đến địa chỉ email bạn đã đăng ký
              </p>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              {status === 'verification-link-sent' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800 text-center">
                    ✓ Email xác nhận mới đã được gửi đến địa chỉ email của bạn!
                  </p>
                </div>
              )}

              <div className="space-y-4 text-sm text-gray-600">
                <p className="leading-relaxed">
                  Vui lòng kiểm tra hộp thư đến (hoặc thư mục spam) và nhấp vào liên kết xác nhận
                  để kích hoạt tài khoản của bạn.
                </p>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="font-medium text-gray-700 mb-2">Lưu ý:</p>
                  <ul className="space-y-1 list-disc list-inside text-gray-600">
                    <li>Link xác nhận có hiệu lực trong 60 phút</li>
                    <li>Nếu không thấy email, hãy kiểm tra thư mục spam</li>
                    <li>Bạn có thể gửi lại email xác nhận bên dưới</li>
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <Button
                  fullWidth
                  onClick={handleResendEmail}
                  disabled={resending}
                  className="bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  {resending ? 'Đang gửi...' : 'Gửi lại email xác nhận'}
                </Button>

                <Link href="/" className="block">
                  <Button
                    fullWidth
                    variant="outline"
                    className="text-gray-600 hover:text-gray-900 border-gray-300 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={18} />
                    Quay lại trang chủ
                  </Button>
                </Link>
              </div>

              {/* Support info */}
              <div className="pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Cần hỗ trợ? Liên hệ{' '}
                  <a href="mailto:support@rill.com" className="text-primary hover:underline font-medium">
                    support@rill.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Additional info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Đã xác nhận email?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default VerifyEmail;
