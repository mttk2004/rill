import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SettingsLayout from '@/layouts/settings-layout';
import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { Lock, Shield, Key, AlertTriangle, CheckCircle } from 'lucide-react';
import { useRef } from 'react';

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <SettingsLayout
            title="Cài đặt mật khẩu"
            description="Đảm bảo tài khoản của bạn được bảo vệ bằng mật khẩu mạnh"
        >
            <Head title="Cài đặt mật khẩu - Rill" />

            <div className="space-y-8">
                {/* Security Header */}
                <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/10 rounded-xl border border-red-200 dark:border-red-800">
                    <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-full">
                        <Shield className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-red-900 dark:text-red-100">
                            Bảo mật tài khoản
                        </h3>
                        <p className="text-red-700 dark:text-red-300 mt-1">
                            Mật khẩu mạnh giúp bảo vệ tài khoản của bạn khỏi những truy cập trái phép
                        </p>
                    </div>
                </div>

                <Form
                    {...PasswordController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    resetOnError={['password', 'password_confirmation', 'current_password']}
                    resetOnSuccess
                    onError={(errors) => {
                        if (errors.password) {
                            passwordInput.current?.focus();
                        }

                        if (errors.current_password) {
                            currentPasswordInput.current?.focus();
                        }
                    }}
                    className="space-y-8"
                >
                    {({ errors, processing, recentlySuccessful }) => (
                        <>
                            {/* Password Form Section */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                                        <Lock className="h-5 w-5 text-white" />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                                        Thay đổi mật khẩu
                                    </h4>
                                </div>

                                {/* Current Password Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="current_password" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <Key className="h-4 w-4" />
                                        Mật khẩu hiện tại
                                    </Label>
                                    <Input
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        name="current_password"
                                        type="password"
                                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-white transition-all duration-300 hover:border-amber-400"
                                        autoComplete="current-password"
                                        placeholder="Nhập mật khẩu hiện tại"
                                    />
                                    <InputError className="text-red-500 text-sm" message={errors.current_password} />
                                </div>

                                {/* New Password Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <Lock className="h-4 w-4" />
                                        Mật khẩu mới
                                    </Label>
                                    <Input
                                        id="password"
                                        ref={passwordInput}
                                        name="password"
                                        type="password"
                                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-white transition-all duration-300 hover:border-amber-400"
                                        autoComplete="new-password"
                                        placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                                    />
                                    <InputError className="text-red-500 text-sm" message={errors.password} />
                                </div>

                                {/* Confirm Password Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <Shield className="h-4 w-4" />
                                        Xác nhận mật khẩu
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-white transition-all duration-300 hover:border-amber-400"
                                        autoComplete="new-password"
                                        placeholder="Nhập lại mật khẩu mới"
                                    />
                                    <InputError className="text-red-500 text-sm" message={errors.password_confirmation} />
                                </div>
                            </div>

                            {/* Security Tips */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                                        <CheckCircle className="h-5 w-5 text-white" />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                                        Mẹo tạo mật khẩu mạnh
                                    </h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                        <div className="flex items-center gap-2 text-green-700 dark:text-green-300 text-sm font-medium mb-2">
                                            <CheckCircle className="h-4 w-4" />
                                            Nên sử dụng
                                        </div>
                                        <ul className="text-green-600 dark:text-green-400 text-sm space-y-1">
                                            <li>• Tối thiểu 8 ký tự</li>
                                            <li>• Kết hợp chữ hoa và chữ thường</li>
                                            <li>• Bao gồm số và ký tự đặc biệt</li>
                                            <li>• Tránh thông tin cá nhân</li>
                                        </ul>
                                    </div>

                                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                        <div className="flex items-center gap-2 text-red-700 dark:text-red-300 text-sm font-medium mb-2">
                                            <AlertTriangle className="h-4 w-4" />
                                            Tránh sử dụng
                                        </div>
                                        <ul className="text-red-600 dark:text-red-400 text-sm space-y-1">
                                            <li>• Mật khẩu quá đơn giản</li>
                                            <li>• Ngày sinh, tên thật</li>
                                            <li>• Chuỗi liên tiếp như 123456</li>
                                            <li>• Mật khẩu đã sử dụng ở nơi khác</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-600">
                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out duration-300"
                                    enterFrom="opacity-0 transform translate-x-2"
                                    leave="transition ease-in-out duration-300"
                                    leaveTo="opacity-0 transform -translate-x-2"
                                >
                                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <p className="text-sm font-medium">Mật khẩu đã được cập nhật thành công</p>
                                    </div>
                                </Transition>

                                <Button
                                    disabled={processing}
                                    data-test="update-password-button"
                                    className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Đang lưu...' : 'Cập nhật mật khẩu'}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </SettingsLayout>
    );
}
