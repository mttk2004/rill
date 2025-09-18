import AppLayout from '@/layouts/app-layout';
import { products } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Music, Search, Filter } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sản phẩm',
        href: products().url,
    },
];

export default function Products() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sản phẩm - Rill">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800;900&family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet" />
                <meta name="description" content="Khám phá bộ sưu tập đĩa than chất lượng cao tại Rill. Tìm kiếm các album yêu thích từ các nghệ sĩ nổi tiếng thế giới." />
            </Head>
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Page Header */}
                <div className="text-center">
                    <h1 
                        className="text-4xl sm:text-5xl font-black text-vintage-primary dark:text-white mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Bộ Sưu Tập Vinyl
                    </h1>
                    <p 
                        className="text-xl text-vintage-tertiary dark:text-vintage-tertiary max-w-2xl mx-auto"
                        style={{ fontFamily: "'Crimson Text', serif" }}
                    >
                        Khám phá hàng ngàn đĩa than chất lượng cao từ các nghệ sĩ nổi tiếng thế giới
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm album, nghệ sĩ..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800">
                        <Filter className="h-5 w-5" />
                        <span>Bộ lọc</span>
                    </button>
                </div>

                {/* Products Grid - Placeholder */}
                <div className="rounded-lg bg-white p-12 shadow-sm dark:bg-gray-800">
                    <div className="text-center">
                        <Music className="h-24 w-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
                        <h3 
                            className="text-2xl font-bold text-vintage-primary dark:text-white mb-4"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Sản phẩm đang được cập nhật
                        </h3>
                        <p 
                            className="text-vintage-tertiary dark:text-vintage-tertiary max-w-md mx-auto mb-8"
                            style={{ fontFamily: "'Crimson Text', serif" }}
                        >
                            Chúng tôi đang hoàn thiện kho dữ liệu sản phẩm. Vui lòng quay lại sau để khám phá bộ sưu tập đĩa than tuyệt vời của chúng tôi.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
