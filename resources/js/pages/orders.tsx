import AppLayout from '@/layouts/app-layout';
import { orders } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Đơn hàng của tôi',
        href: orders().url,
    },
];

export default function Orders() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Đơn hàng của tôi - Rill">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800;900&family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet" />
                <meta name="description" content="Xem lịch sử đơn hàng và theo dõi trạng thái giao hàng tại Rill." />
            </Head>
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Page Header */}
                <div className="text-center">
                    <h1
                        className="text-4xl sm:text-5xl font-black text-vintage-primary dark:text-white mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Đơn Hàng Của Tôi
                    </h1>
                    <p
                        className="text-xl text-vintage-tertiary dark:text-vintage-tertiary max-w-2xl mx-auto"
                        style={{ fontFamily: "'Crimson Text', serif" }}
                    >
                        Theo dõi và quản lý các đơn hàng của bạn
                    </p>
                </div>

                {/* Orders Content - Placeholder */}
                <div className="rounded-lg bg-white p-12 shadow-sm dark:bg-gray-800">
                    <div className="text-center">
                        <Package className="h-24 w-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
                        <h3
                            className="text-2xl font-bold text-vintage-primary dark:text-white mb-4"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Chưa có đơn hàng nào
                        </h3>
                        <p
                            className="text-vintage-tertiary dark:text-vintage-tertiary max-w-md mx-auto mb-8"
                            style={{ fontFamily: "'Crimson Text', serif" }}
                        >
                            Bạn chưa có đơn hàng nào. Hãy khám phá và mua sắm các sản phẩm yêu thích của bạn.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
