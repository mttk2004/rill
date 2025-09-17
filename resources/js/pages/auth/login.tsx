import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return (
        <AuthLayout title="Đăng nhập vào tài khoản" description="Nhập email và mật khẩu để đăng nhập">
            <Head title="Đăng nhập" />

            <Form {...AuthenticatedSessionController.store.form()} resetOnSuccess={['password']} className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Địa chỉ email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="example@email.com"
                                    className="border-input focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/20"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Mật khẩu</Label>
                                    {canResetPassword && (
                                        <TextLink href={request()} className="ml-auto text-sm text-[#d97706] hover:text-[#b45309]" tabIndex={5}>
                                            Quên mật khẩu?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Nhập mật khẩu"
                                    className="border-input focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/20"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox id="remember" name="remember" tabIndex={3} className="data-[state=checked]:bg-[#d97706] data-[state=checked]:border-[#d97706]" />
                                <Label htmlFor="remember">Ghi nhớ tôi</Label>
                            </div>

                            <Button type="submit" className="mt-4 w-full bg-[#d97706] hover:bg-[#b45309] text-white transition-colors" tabIndex={4} disabled={processing} data-test="login-button">
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Đăng nhập
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Chưa có tài khoản?{' '}
                            <TextLink href={register()} tabIndex={5} className="text-[#d97706] hover:text-[#b45309]">
                                Đăng ký ngay
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
