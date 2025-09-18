import AppLayout from '@/layouts/app-layout';
import { cart } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Giỏ hàng',
        href: cart().url,
    },
];

export default function Cart() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Giỏ hàng - Rill">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800;900&family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet" />
                <meta name="description" content="Xem và quản lý giỏ hàng của bạn tại Rill." />
            </Head>
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Page Header */}
                <div className="text-center">
                    <h1
                        className="text-4xl sm:text-5xl font-black text-vintage-primary dark:text-white mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Giỏ Hàng
                    </h1>
                    <p
                        className="text-xl text-vintage-tertiary dark:text-vintage-tertiary max-w-2xl mx-auto"
                        style={{ fontFamily: "'Crimson Text', serif" }}
                    >
                        Xem và quản lý các sản phẩm trong giỏ hàng của bạn
                    </p>
                </div>

                {/* Cart Content - Placeholder */}
                <div className="rounded-lg bg-white p-12 shadow-sm dark:bg-gray-800">
                    <div className="text-center">
                        <ShoppingCart className="h-24 w-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
                        <h3
                            className="text-2xl font-bold text-vintage-primary dark:text-white mb-4"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Giỏ hàng trống
                        </h3>
                        <p
                            className="text-vintage-tertiary dark:text-vintage-tertiary max-w-md mx-auto mb-8"
                            style={{ fontFamily: "'Crimson Text', serif" }}
                        >
                            Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá bộ sưu tập đĩa than tuyệt vời của chúng tôi.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
