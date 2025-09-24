import AppLayout from '@/layouts/app-layout';
import { products } from '@/routes';
import { type BreadcrumbItem, ProductsPageData, Product } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Music, Search, Filter, Grid, List } from 'lucide-react';
import ProductCard from '@/components/products/product-card';
import ProductFilters from '@/components/products/product-filters';
import ProductPagination from '@/components/products/product-pagination';
import { useState, FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sản phẩm',
        href: products().url,
    },
];

export default function Products({ products: productsData, filters, pagination, ...props }: ProductsPageData & { [key: string]: any }) {
    const [searchTerm, setSearchTerm] = useState(props.search || '');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        const currentFilters = {
            search: searchTerm || undefined,
            genre: props.genre,
            label: props.label,
            artist: props.artist,
            sort: props.sort,
        };

        // Remove empty values
        Object.keys(currentFilters).forEach(key => {
            if (!currentFilters[key as keyof typeof currentFilters]) {
                delete currentFilters[key as keyof typeof currentFilters];
            }
        });

        router.get('/products', currentFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const currentFilters = {
        search: props.search,
        genre: props.genre,
        label: props.label,
        artist: props.artist,
        sort: props.sort,
    };
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

                {/* Search and View Controls */}
                <div className="flex flex-col lg:flex-row gap-4">
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm album, nghệ sĩ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                    </form>
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center space-x-2 px-4 py-3 border rounded-lg transition-colors lg:hidden ${
                                showFilters 
                                    ? 'bg-accent text-white border-accent' 
                                    : 'border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800'
                            }`}
                        >
                            <Filter className="h-5 w-5" />
                            <span>Bộ lọc</span>
                        </button>
                        <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 ${viewMode === 'grid' ? 'bg-accent text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            >
                                <Grid className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 border-l border-gray-300 dark:border-gray-600 ${viewMode === 'list' ? 'bg-accent text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            >
                                <List className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex gap-6">
                    {/* Sidebar Filters - Desktop */}
                    <aside className={`w-80 flex-shrink-0 ${
                        showFilters ? 'block' : 'hidden lg:block'
                    }`}>
                        <ProductFilters 
                            filters={filters} 
                            currentFilters={currentFilters}
                        />
                    </aside>

                    {/* Products Content */}
                    <main className="flex-1 min-w-0">
                        {/* Results Summary */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {pagination.total > 0 ? (
                                    <>Tìm thấy {pagination.total.toLocaleString('vi-VN')} sản phẩm</>
                                ) : (
                                    'Không tìm thấy sản phẩm nào'
                                )}
                                {currentFilters.search && (
                                    <> cho "{currentFilters.search}"</>
                                )}
                            </div>
                        </div>

                        {/* Products Grid/List */}
                        {productsData.data.length > 0 ? (
                            <div className={viewMode === 'grid' 
                                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                                : 'space-y-4'
                            }>
                                {productsData.data.map((product: Product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-lg bg-white dark:bg-gray-800 p-12 shadow-sm text-center">
                                <Music className="h-24 w-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
                                <h3 
                                    className="text-2xl font-bold text-vintage-primary dark:text-white mb-4"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                    Không tìm thấy sản phẩm
                                </h3>
                                <p 
                                    className="text-vintage-tertiary dark:text-vintage-tertiary max-w-md mx-auto mb-8"
                                    style={{ fontFamily: "'Crimson Text', serif" }}
                                >
                                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem thêm sản phẩm.
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        <ProductPagination 
                            pagination={pagination} 
                            currentFilters={currentFilters}
                        />
                    </main>
                </div>
            </div>
        </AppLayout>
    );
}
