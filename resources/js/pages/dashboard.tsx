import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Rill" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Welcome Message */}
                <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Chào mừng bạn đến với Rill Dashboard
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Quản lý cửa hàng đĩa than của bạn một cách hiệu quả
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500 text-white">
                                🎵
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sản phẩm</h3>
                                <p className="text-2xl font-bold text-blue-600">0</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500 text-white">
                                📦
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Đơn hàng</h3>
                                <p className="text-2xl font-bold text-green-600">0</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500 text-white">
                                👥
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Khách hàng</h3>
                                <p className="text-2xl font-bold text-purple-600">0</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Hành động nhanh</h2>
                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                        <button className="flex items-center rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
                            <span className="text-xl">➕</span>
                            <span className="ml-3 text-sm font-medium">Thêm sản phẩm</span>
                        </button>
                        <button className="flex items-center rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
                            <span className="text-xl">📋</span>
                            <span className="ml-3 text-sm font-medium">Xem đơn hàng</span>
                        </button>
                        <button className="flex items-center rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
                            <span className="text-xl">🎤</span>
                            <span className="ml-3 text-sm font-medium">Quản lý nghệ sĩ</span>
                        </button>
                        <button className="flex items-center rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
                            <span className="text-xl">📊</span>
                            <span className="ml-3 text-sm font-medium">Thống kê</span>
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
