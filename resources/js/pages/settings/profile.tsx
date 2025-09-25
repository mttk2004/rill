import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { User, Calendar, Upload } from 'lucide-react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cài đặt hồ sơ',
        href: edit().url,
    },
];

interface ProfilePageProps extends SharedData {
    user: any;
    mustVerifyEmail: boolean;
    status?: string;
}

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth, user } = usePage<ProfilePageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cài đặt hồ sơ - Rill">
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
                            Thông tin cá nhân
                        </h2>
                        <p
                            className="text-vintage-tertiary dark:text-vintage-tertiary"
                            style={{ fontFamily: "'Crimson Text', serif" }}
                        >
                            Quản lý và cập nhật thông tin cá nhân của bạn
                        </p>
                    </div>

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name Field */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Họ và tên
                                        </Label>
                                        <Input
                                            id="name"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            defaultValue={user?.name || auth.user?.name}
                                            name="name"
                                            required
                                            autoComplete="name"
                                            placeholder="Nhập họ và tên"
                                        />
                                        <InputError className="mt-2" message={errors.name} />
                                    </div>

                                    {/* Email Field */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Địa chỉ email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            defaultValue={user?.email || auth.user?.email}
                                            name="email"
                                            required
                                            autoComplete="username"
                                            placeholder="Nhập địa chỉ email"
                                        />
                                        <InputError className="mt-2" message={errors.email} />
                                    </div>

                                    {/* Phone Field */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Số điện thoại
                                        </Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            defaultValue={user?.phone || ''}
                                            name="phone"
                                            placeholder="Nhập số điện thoại"
                                        />
                                        <InputError className="mt-2" message={errors.phone} />
                                    </div>

                                    {/* Gender Field */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="gender" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Giới tính
                                        </Label>
                                        <select
                                            id="gender"
                                            name="gender"
                                            defaultValue={user?.gender || ''}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="">Chọn giới tính</option>
                                            <option value="male">Nam</option>
                                            <option value="female">Nữ</option>
                                            <option value="other">Khác</option>
                                        </select>
                                        <InputError className="mt-2" message={errors.gender} />
                                    </div>

                                    {/* Date of Birth Field */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="date_of_birth" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Ngày sinh
                                        </Label>
                                        <Input
                                            id="date_of_birth"
                                            type="date"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            defaultValue={user?.date_of_birth || ''}
                                            name="date_of_birth"
                                        />
                                        <InputError className="mt-2" message={errors.date_of_birth} />
                                    </div>
                                </div>

                                {/* Avatar Upload Field */}
                                <div className="grid gap-2">
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Ảnh đại diện
                                    </Label>
                                    <div className="flex items-center space-x-4">
                                        {(user?.avatar_url || auth.user?.avatar_url) && (
                                            <div className="relative">
                                                <img
                                                    src={user?.avatar_url || auth.user?.avatar_url}
                                                    alt="Avatar hiện tại"
                                                    className="h-16 w-16 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                                                />
                                                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block text-center">Hiện tại</span>
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                name="avatar"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent dark:border-gray-600 dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-accent file:text-accent-foreground hover:file:bg-accent/90"
                                            />
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                Chọn ảnh định dạng JPG, PNG hoặc GIF. Kích thước tối đa 2MB.
                                            </p>
                                        </div>
                                    </div>
                                    <InputError className="mt-2" message={errors.avatar} />
                                </div>

                                {/* Email verification notice */}
                                {mustVerifyEmail && auth.user.email_verified_at === null && (
                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/50 dark:border-yellow-800">
                                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                            Địa chỉ email của bạn chưa được xác thực.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-yellow-900 dark:text-yellow-100 underline decoration-yellow-500 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current font-medium"
                                            >
                                                Bấm vào đây để gửi lại email xác thực.
                                            </Link>
                                        </p>

                                        {status === 'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                                Một liên kết xác thực mới đã được gửi đến địa chỉ email của bạn.
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Save Button */}
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
                                        data-test="update-profile-button"
                                        className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium transition-colors hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Đang lưu...' : 'Lưu thay đổi'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
