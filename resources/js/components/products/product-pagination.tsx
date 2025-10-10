import { router } from '@inertiajs/react';
import { Pagination } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductPaginationProps {
    pagination: Pagination;
    currentFilters: Record<string, string | number | undefined>;
}

export default function ProductPagination({ pagination, currentFilters }: ProductPaginationProps) {
    const { current_page, last_page, total, from, to } = pagination;

    const changePage = (page: number) => {
        if (page < 1 || page > last_page) return;
        
        router.get('/products', { ...currentFilters, page }, {
            preserveState: true,
            preserveScroll: false,
        });
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        
        let start = Math.max(1, current_page - Math.floor(maxVisible / 2));
        const end = Math.min(last_page, start + maxVisible - 1);
        
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }
        
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        
        return pages;
    };

    if (last_page <= 1) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            {/* Results Info */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
                Hiển thị {from} đến {to} trong tổng số {total.toLocaleString('vi-VN')} sản phẩm
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                    onClick={() => changePage(current_page - 1)}
                    disabled={current_page === 1}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-800"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Trước
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                    {current_page > 3 && (
                        <>
                            <button
                                onClick={() => changePage(1)}
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            >
                                1
                            </button>
                            {current_page > 4 && (
                                <span className="px-2 py-2 text-sm text-gray-500">...</span>
                            )}
                        </>
                    )}

                    {getPageNumbers().map((page) => (
                        <button
                            key={page}
                            onClick={() => changePage(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                page === current_page
                                    ? 'text-white bg-accent border border-accent'
                                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    {current_page < last_page - 2 && (
                        <>
                            {current_page < last_page - 3 && (
                                <span className="px-2 py-2 text-sm text-gray-500">...</span>
                            )}
                            <button
                                onClick={() => changePage(last_page)}
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            >
                                {last_page}
                            </button>
                        </>
                    )}
                </div>

                {/* Next Button */}
                <button
                    onClick={() => changePage(current_page + 1)}
                    disabled={current_page === last_page}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-800"
                >
                    Sau
                    <ChevronRight className="w-4 h-4 ml-1" />
                </button>
            </div>
        </div>
    );
}
