import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { router } from "@inertiajs/react";

interface PaginationProps {
    currentPage: number;
    lastPage: number;
    total: number;
    from: number;
    to: number;
    filters?: Record<string, string | number | undefined>;
}

export function Pagination({
    currentPage,
    lastPage,
    total,
    from,
    to,
    filters = {}
}: PaginationProps) {
    if (lastPage <= 1) {
        return null;
    }

    const handlePageChange = (page: number) => {
        if (page < 1 || page > lastPage || page === currentPage) {
            return;
        }

        const newFilters: Record<string, string | number> = { ...filters, page };

        // Remove empty values
        Object.keys(newFilters).forEach(key => {
            if (!newFilters[key] || newFilters[key] === '') {
                delete newFilters[key];
            }
        });

        router.get('/products', newFilters, {
            preserveState: true,
            preserveScroll: true,
            only: ['products', 'pagination', 'filters'],
        });
    };

    const getVisiblePages = () => {
        const delta = 2; // Number of pages to show on each side of current page
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta);
             i <= Math.min(lastPage - 1, currentPage + delta);
             i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < lastPage - 1) {
            rangeWithDots.push('...', lastPage);
        } else if (lastPage > 1) {
            rangeWithDots.push(lastPage);
        }

        return rangeWithDots;
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            {/* Results info */}
            <p className="text-sm text-muted-foreground">
                Hiển thị <span className="font-medium">{from}-{to}</span> trong{' '}
                <span className="font-medium">{total.toLocaleString('vi-VN')}</span> sản phẩm
            </p>

            {/* Pagination controls */}
            <div className="flex items-center space-x-1">
                {/* Previous button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="flex items-center gap-1"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Trước
                </Button>

                {/* Page numbers */}
                {getVisiblePages().map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`dots-${index}`} className="px-2 text-muted-foreground">
                                ...
                            </span>
                        );
                    }

                    const pageNumber = page as number;
                    return (
                        <Button
                            key={pageNumber}
                            variant={currentPage === pageNumber ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNumber)}
                            className="min-w-[40px]"
                        >
                            {pageNumber}
                        </Button>
                    );
                })}

                {/* Next button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= lastPage}
                    className="flex items-center gap-1"
                >
                    Sau
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Page info */}
            <p className="text-xs text-muted-foreground">
                Trang {currentPage} / {lastPage}
            </p>
        </div>
    );
}
