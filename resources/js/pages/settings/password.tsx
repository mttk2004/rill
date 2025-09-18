import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/password';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cài đặt mật khẩu',
        href: edit().url,
    },
];

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cài đặt mật khẩu - Rill">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800;900&family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet" />
            </Head>

            <SettingsLayout>
                <div className="space-y-6">
                    <div>
                        <h2 
                            className="text-2xl font-bold text-vintage-primary dark:text-white mb-2"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Cập nhật mật khẩu
                        </h2>
                        <p 
                            className="text-vintage-tertiary dark:text-vintage-tertiary"
                            style={{ fontFamily: "'Crimson Text', serif" }}
                        >
                            Đảm bảo tài khoản của bạn được bảo vệ bằng mật khẩu mạnh
                        </p>
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
                        className="space-y-6"
                    >
                        {({ errors, processing, recentlySuccessful }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="current_password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Mật khẩu hiện tại
                                    </Label>
                                    <Input
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        name="current_password"
                                        type="password"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        autoComplete="current-password"
                                        placeholder="Nhập mật khẩu hiện tại"
                                    />
                                    <InputError message={errors.current_password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Mật khẩu mới
                                    </Label>
                                    <Input
                                        id="password"
                                        ref={passwordInput}
                                        name="password"
                                        type="password"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        autoComplete="new-password"
                                        placeholder="Nhập mật khẩu mới"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Xác nhận mật khẩu
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        autoComplete="new-password"
                                        placeholder="Xác nhận mật khẩu mới"
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-green-600 dark:text-green-400">Đã lưu</p>
                                    </Transition>
                                    
                                    <Button 
                                        disabled={processing} 
                                        data-test="update-password-button"
                                        className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium transition-colors hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Đang lưu...' : 'Lưu mật khẩu'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
