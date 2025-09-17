import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    return (
        <AuthLayout title="Tạo tài khoản" description="Nhập thông tin của bạn để tạo tài khoản mới">
            <Head title="Đăng ký" />
            <Form
                {...RegisteredUserController.store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Họ và tên</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Nguyễn Văn A"
                                    className="border-input focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/20"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Địa chỉ email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="example@email.com"
                                    className="border-input focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/20"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">Số điện thoại</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    tabIndex={3}
                                    autoComplete="tel"
                                    name="phone"
                                    placeholder="0901234567"
                                    maxLength={10}
                                    className="border-input focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/20"
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Mật khẩu</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Tối thiểu 8 ký tự"
                                    className="border-input focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/20"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Xác nhận mật khẩu</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Nhập lại mật khẩu"
                                    className="border-input focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/20"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button type="submit" className="mt-2 w-full bg-[#d97706] hover:bg-[#b45309] text-white transition-colors" tabIndex={6} data-test="register-user-button">
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Tạo tài khoản
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Đã có tài khoản?{' '}
                            <TextLink href={login()} tabIndex={7} className="text-[#d97706] hover:text-[#b45309]">
                                Đăng nhập
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
