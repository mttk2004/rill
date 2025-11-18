// Components
import EmailVerificationNotificationController from '@/actions/App/Http/Controllers/Auth/EmailVerificationNotificationController';
import { logout } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
  return (
    <AuthLayout title="Đăng ký thành công! 🎉" description="Cảm ơn bạn đã đăng ký tài khoản tại Rill. Hãy kiểm tra email để xác nhận tài khoản và nhận món quà bất ngờ từ chúng tôi!">
      <Head title="Xác nhận email" />

      <div className="mb-6 space-y-4 text-center">
        <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm border-2 border-blue-100">
          <div className="mb-3 text-4xl">✉️</div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Kiểm tra email của bạn
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Chúng tôi đã gửi một email chào mừng đến hộp thư của bạn.
          </p>
          <p className="text-sm text-gray-700">
            Email này chứa link xác nhận tài khoản và{' '}
            <span className="font-bold text-orange-600">một món quà bí mật đặc biệt</span> dành riêng cho bạn! 🎁
          </p>
        </div>

        {status === 'verification-link-sent' && (
          <div className="text-sm font-medium text-green-600">
            Email xác nhận mới đã được gửi đến địa chỉ email của bạn.
          </div>
        )}
      </div>

      <Form {...EmailVerificationNotificationController.store.form()} className="space-y-6 text-center">
        {({ processing }) => (
          <>
            <Button disabled={processing} variant="secondary" className="w-full">
              {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Gửi lại email xác nhận
            </Button>

            <TextLink href={logout()} className="mx-auto block text-sm">
              Đăng xuất
            </TextLink>
          </>
        )}
      </Form>
    </AuthLayout>
  );
}
