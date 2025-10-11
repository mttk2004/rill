import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { Search, Star, Grid, List, Disc3, Heart, Music, Filter, ShoppingCart } from "lucide-react";
import { type ProductsPageData, Product } from '@/types';
import { Head, router, usePage, Link } from '@inertiajs/react';
import { useState, FormEvent, MouseEvent, useMemo } from 'react';
import { type SharedData } from '@/types';
import { useCart } from '@/hooks/use-cart';
import { toast } from 'sonner';

interface ProductsProps extends ProductsPageData {
    search?: string;
    genre?: string;
    label?: string;
    artist?: string;
    sort?: string;
    page?: number;
}

export default function Products({ products: productsData, pagination, filters, ...props }: ProductsProps) {
    const { auth, cart } = usePage<SharedData>().props;
    const { addToCart } = useCart();

    const cartItemProductIds = useMemo(() => new Set(cart.items.map(item => item.product.id)), [cart.items]);

    const [searchTerm, setSearchTerm] = useState(props.search || '');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const handleAddToCart = (e: MouseEvent<HTMLButtonElement>, productId: string) => {
        e.preventDefault();
        e.stopPropagation();

        toast.promise(addToCart(productId, 1), {
            loading: 'Đang thêm vào giỏ hàng...',
            success: 'Đã thêm sản phẩm vào giỏ hàng!',
            error: (err) => err.message || 'Đã xảy ra lỗi.',
        });
    };

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        updateFilters({
            search: searchTerm || undefined,
            page: 1, // Reset to first page when searching
        });
    };

    const handleFilterChange = (key: string, value: string) => {
        const newValue = value === 'all' || value === '' ? undefined : value;

        const updatedFilters = {
            search: props.search,
            genre: props.genre,
            label: props.label,
            artist: props.artist,
            sort: props.sort,
            [key]: newValue,
            page: 1, // Reset to first page when filtering
        };

        Object.keys(updatedFilters).forEach(filterKey => {
            if (!updatedFilters[filterKey as keyof typeof updatedFilters]) {
                delete updatedFilters[filterKey as keyof typeof updatedFilters];
            }
        });

        router.get('/products', updatedFilters, {
            preserveState: true,
            preserveScroll: true,
            only: ['products', 'pagination', 'filters'],
        });
    };

    const updateFilters = (newFilters: Record<string, string | number | undefined>) => {
        const currentFilters = {
            search: props.search,
            genre: props.genre,
            label: props.label,
            artist: props.artist,
            sort: props.sort,
            page: props.page,
            ...newFilters,
        };

        Object.keys(currentFilters).forEach(key => {
            if (!currentFilters[key as keyof typeof currentFilters]) {
                delete currentFilters[key as keyof typeof currentFilters];
            }
        });

        router.get('/products', currentFilters, {
            preserveState: true,
            preserveScroll: true,
            only: ['products', 'pagination', 'filters'],
        });
    };

    const currentFilters = {
        search: props.search,
        genre: props.genre,
        label: props.label,
        artist: props.artist,
        sort: props.sort,
    };

    const genres = filters?.genres ? ["Tất cả", ...filters.genres] : ["Tất cả"];
    const labels = filters?.labels ? ["Tất cả", ...filters.labels] : ["Tất cả"];
    const sortOptions = filters?.sort_options || [
        { value: 'featured', label: 'Nổi bật' },
        { value: 'newest', label: 'Mới nhất' },
        { value: 'price_asc', label: 'Giá: Thấp đến cao' },
        { value: 'price_desc', label: 'Giá: Cao đến thấp' },
    ];
    return (
        <>
            <Head title="Sản phẩm - Rill" />
            <div className="min-h-screen bg-background">
                <Navigation user={auth.user} />

                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,119,6,0.15),transparent_60%)]" />

                    <div className="absolute top-10 left-10 opacity-30">
                        <Disc3 className="w-32 h-32 animate-spin-slow text-accent/40" />
                    </div>
                    <div className="absolute bottom-10 right-10 opacity-30">
                        <Music className="w-40 h-40 text-accent/30" />
                    </div>

                    <div className="container mx-auto px-4 text-center relative z-10 py-20 lg:py-28">
                        <Badge variant="secondary" className="mb-6 px-6 py-3 text-sm font-semibold bg-accent/90 text-white border-0 shadow-lg">
                            🎵 Bộ sưu tập vinyl
                        </Badge>
                        <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                            Khám phá
                            <span className="block bg-gradient-to-r from-accent via-yellow-400 to-accent bg-clip-text text-transparent drop-shadow-sm">
                                đĩa than chính hãng
                            </span>
                        </h1>
                        <p className="text-xl lg:text-2xl text-slate-200 max-w-4xl mx-auto leading-relaxed mb-8 drop-shadow-sm">
                            Hơn {pagination.total ? pagination.total.toLocaleString('vi-VN') : '1,000'}+ album từ những nghệ sĩ huyền thoại thế giới
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <div className="flex items-center gap-4 text-white bg-accent/20 px-6 py-3 rounded-full backdrop-blur-sm border border-accent/30">
                                <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                                <span className="text-lg font-semibold">Chính hãng 100%</span>
                            </div>
                            <div className="flex items-center gap-4 text-white bg-accent/20 px-6 py-3 rounded-full backdrop-blur-sm border border-accent/30">
                                <div className="w-3 h-3 bg-accent rounded-full animate-pulse animation-delay-300" />
                                <span className="text-lg font-semibold">Âm thanh hoàn hảo</span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="container mx-auto px-4 py-8 lg:py-12">
                    <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/90 via-white/80 to-accent/5 dark:from-slate-800/90 dark:via-slate-800/80 dark:to-slate-700/50 rounded-3xl shadow-2xl border border-accent/20 dark:border-slate-600/20 mb-8 lg:mb-12 overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(217,119,6,0.08),transparent_60%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(217,119,6,0.15),transparent_60%)]" />
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDIxNywgMTE5LCA2LCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />

                        <div className="relative z-10 p-6 lg:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-accent to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        <Filter className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                                            Bộ lọc & tìm kiếm
                                        </h2>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                            Tìm kiếm trong {pagination.total ? pagination.total.toLocaleString('vi-VN') : '1,000'}+ album vinyl chính hãng
                                        </p>
                                    </div>
                                </div>

                                {(props.genre || props.label || props.search || (props.sort && props.sort !== 'featured')) && (
                                    <div className="flex items-center gap-3">
                                        <div className="px-4 py-2 bg-accent/10 dark:bg-accent/20 rounded-full border border-accent/20">
                                            <span className="text-sm font-semibold text-accent">
                                                {[props.genre, props.label, props.search, (props.sort && props.sort !== 'featured' ? props.sort : null)].filter(Boolean).length} bộ lọc đang hoạt động
                                            </span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setSearchTerm('');
                                                router.get('/products', {}, {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                    only: ['products', 'pagination', 'filters'],
                                                });
                                            }}
                                            className="h-10 px-4 border-accent/30 text-accent hover:bg-gradient-to-r hover:from-accent hover:to-amber-600 hover:text-white hover:border-transparent transition-all duration-300 shadow-sm"
                                        >
                                            <span className="hidden sm:inline">Xóa tất cả</span>
                                            <span className="sm:hidden">Xóa</span>
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6 lg:space-y-0">
                                <div className="w-full lg:mb-6">
                                    <form onSubmit={handleSearch} className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-amber-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="relative">
                                            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-accent transition-colors duration-300" />
                                            <Input
                                                placeholder="🎵 Tìm kiếm album, nghệ sĩ, bài hát..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-14 pr-6 h-14 lg:h-16 text-base lg:text-lg bg-white/90 dark:bg-slate-700/90 border-2 border-accent/20 focus:border-accent focus:ring-4 focus:ring-accent/10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium placeholder:text-slate-500 dark:placeholder:text-slate-400"
                                            />
                                            {searchTerm && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSearchTerm('')}
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 hover:bg-accent/10 rounded-full"
                                                >
                                                    ×
                                                </Button>
                                            )}
                                        </div>
                                    </form>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6">
                                    <div className="lg:col-span-1 xl:col-span-1">
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Thể loại</label>
                                        <Select
                                            value={props.genre || "all"}
                                            onValueChange={(value) => handleFilterChange('genre', value)}
                                        >
                                            <SelectTrigger className="h-12 bg-white/90 dark:bg-slate-700/90 border-2 border-slate-200/50 dark:border-slate-600/50 hover:border-accent/30 focus:border-accent focus:ring-2 focus:ring-accent/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                                <SelectValue placeholder="Chọn thể loại" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-2 border-accent/20">
                                                {genres.map((genre) => (
                                                    <SelectItem
                                                        key={genre}
                                                        value={genre === "Tất cả" ? "all" : genre}
                                                        className="hover:bg-accent/10 focus:bg-accent/10 rounded-lg"
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-accent rounded-full" />
                                                            {genre}
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="lg:col-span-1 xl:col-span-1">
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Hãng đĩa</label>
                                        <Select
                                            value={props.label || "all"}
                                            onValueChange={(value) => handleFilterChange('label', value)}
                                        >
                                            <SelectTrigger className="h-12 bg-white/90 dark:bg-slate-700/90 border-2 border-slate-200/50 dark:border-slate-600/50 hover:border-accent/30 focus:border-accent focus:ring-2 focus:ring-accent/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                                <SelectValue placeholder="Chọn hãng đĩa" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-2 border-accent/20">
                                                {labels.map((label) => (
                                                    <SelectItem
                                                        key={label}
                                                        value={label === "Tất cả" ? "all" : label}
                                                        className="hover:bg-accent/10 focus:bg-accent/10 rounded-lg"
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-accent rounded-full" />
                                                            {label}
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="lg:col-span-1 xl:col-span-1">
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Sắp xếp</label>
                                        <Select
                                            value={props.sort || "featured"}
                                            onValueChange={(value) => handleFilterChange('sort', value)}
                                        >
                                            <SelectTrigger className="h-12 bg-white/90 dark:bg-slate-700/90 border-2 border-slate-200/50 dark:border-slate-600/50 hover:border-accent/30 focus:border-accent focus:ring-2 focus:ring-accent/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                                <SelectValue placeholder="Sắp xếp theo" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-2 border-accent/20">
                                                {sortOptions.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                        className="hover:bg-accent/10 focus:bg-accent/10 rounded-lg"
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="lg:col-span-1 xl:col-span-1">
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Hiển thị</label>
                                        <div className="flex h-12 border-2 border-slate-200/50 dark:border-slate-600/50 rounded-xl overflow-hidden bg-white/90 dark:bg-slate-700/90 shadow-sm hover:shadow-md transition-all duration-300">
                                            <Button
                                                variant={viewMode === "grid" ? "default" : "ghost"}
                                                size="sm"
                                                onClick={() => setViewMode("grid")}
                                                className={`flex-1 rounded-none h-full border-0 transition-all duration-300 ${
                                                    viewMode === "grid"
                                                        ? "bg-gradient-to-r from-accent to-amber-600 text-white shadow-md"
                                                        : "text-slate-600 dark:text-slate-300 hover:bg-accent/10 hover:text-accent"
                                                }`}
                                            >
                                                <Grid className="h-4 w-4 mr-2" />
                                                <span className="hidden sm:inline">Lưới</span>
                                            </Button>
                                            <div className="w-px bg-slate-200/50 dark:bg-slate-600/50" />
                                            <Button
                                                variant={viewMode === "list" ? "default" : "ghost"}
                                                size="sm"
                                                onClick={() => setViewMode("list")}
                                                className={`flex-1 rounded-none h-full border-0 transition-all duration-300 ${
                                                    viewMode === "list"
                                                        ? "bg-gradient-to-r from-accent to-amber-600 text-white shadow-md"
                                                        : "text-slate-600 dark:text-slate-300 hover:bg-accent/10 hover:text-accent"
                                                }`}
                                            >
                                                <List className="h-4 w-4 mr-2" />
                                                <span className="hidden sm:inline">Danh sách</span>
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2 lg:col-span-2 xl:col-span-2 flex flex-col justify-end">
                                        <div className="flex gap-3 h-12">
                                            <Button
                                                variant="outline"
                                                className="flex-1 h-full border-2 border-accent/30 text-accent hover:bg-gradient-to-r hover:from-accent hover:to-amber-600 hover:text-white hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-md rounded-xl font-semibold"
                                                onClick={handleSearch}
                                            >
                                                <Search className="w-4 h-4 mr-2" />
                                                Tìm kiếm
                                            </Button>
                                            <Button
                                                variant="default"
                                                className="flex-1 h-full bg-gradient-to-r from-accent to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl font-semibold"
                                                onClick={() => {
                                                    console.log('Advanced search or save filters');
                                                }}
                                            >
                                                <Heart className="w-4 h-4 mr-2" />
                                                <span className="hidden sm:inline">Lưu bộ lọc</span>
                                                <span className="sm:hidden">Lưu</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-accent/10 to-amber-500/10 rounded-full blur-xl" />
                        <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-accent/5 to-amber-500/5 rounded-full blur-lg" />
                    </div>

                    {pagination.total > 0 && (
                        <div className="mb-8">
                            <div className="bg-gradient-to-r from-slate-50 to-accent/5 dark:from-slate-800/50 dark:to-slate-700/30 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-r from-accent to-amber-600 rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold text-sm">{pagination.total}</span>
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-slate-900 dark:text-white">
                                                    {pagination.total.toLocaleString('vi-VN')} sản phẩm
                                                </p>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    Trang {pagination.current_page} / {pagination.last_page}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2">
                                            {currentFilters.search && (
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-accent/10 to-amber-500/10 border border-accent/20 rounded-full shadow-sm">
                                                    <Search className="w-3 h-3 text-accent" />
                                                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Tìm:</span>
                                                    <span className="text-xs font-bold text-accent">"{currentFilters.search}"</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSearchTerm('');
                                                            handleFilterChange('search', '');
                                                        }}
                                                        className="w-4 h-4 p-0 hover:bg-accent/20 rounded-full ml-1"
                                                    >
                                                        <span className="text-xs">×</span>
                                                    </Button>
                                                </div>
                                            )}
                                            {currentFilters.genre && currentFilters.genre !== 'all' && (
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-full shadow-sm">
                                                    <Music className="w-3 h-3 text-blue-600" />
                                                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Thể loại:</span>
                                                    <span className="text-xs font-bold text-blue-600">{currentFilters.genre}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleFilterChange('genre', 'all')}
                                                        className="w-4 h-4 p-0 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full ml-1"
                                                    >
                                                        <span className="text-xs">×</span>
                                                    </Button>
                                                </div>
                                            )}
                                            {currentFilters.label && currentFilters.label !== 'all' && (
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700 rounded-full shadow-sm">
                                                    <Disc3 className="w-3 h-3 text-purple-600" />
                                                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Hãng:</span>
                                                    <span className="text-xs font-bold text-purple-600">{currentFilters.label}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleFilterChange('label', 'all')}
                                                        className="w-4 h-4 p-0 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full ml-1"
                                                    >
                                                        <span className="text-xs">×</span>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                            <span>Hiển thị {pagination.from || 0}-{pagination.to || 0}</span>
                                        </div>
                                        <div className="hidden sm:flex items-center gap-2">
                                            <div className="w-2 h-2 bg-accent rounded-full" />
                                            <span>Chế độ {viewMode === 'grid' ? 'lưới' : 'danh sách'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {productsData.data.length > 0 ? (
                        <div className={`grid gap-8 ${
                            viewMode === "grid"
                                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                                : "grid-cols-1"
                        }`}>
                            {productsData.data.map((product: Product, index: number) => (
                                <Card
                                    key={product.id}
                                    className={`group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 animate-fade-in bg-gradient-to-br from-white to-accent/5 ${
                                        viewMode === "list" ? "flex-row" : ""
                                    }`}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-accent/5 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <CardContent className={`p-0 relative z-10 ${viewMode === "list" ? "flex" : ""}`}>
                                        <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                                            <Link href={`/products/${product.slug}`}>
                                                <div className={`relative w-full bg-gradient-to-br from-slate-100 to-accent/10 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500 ${
                                                    viewMode === "list" ? "h-32" : "h-72"
                                                } ${
                                                    viewMode === "list" ? "rounded-l-xl" : "rounded-t-xl"
                                                }`}>
                                                    <Disc3 className="h-20 w-20 text-accent/40 animate-spin-slow group-hover:scale-110 transition-transform duration-500" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                </div>
                                            </Link>
                                            {product.is_featured && (
                                                <Badge
                                                    variant="secondary"
                                                    className="absolute top-4 left-4 bg-accent text-white shadow-lg"
                                                >
                                                    Nổi bật
                                                </Badge>
                                            )}
                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="w-10 h-10 p-0 bg-white/90 hover:bg-accent hover:text-white rounded-full shadow-lg"
                                                >
                                                    <Heart className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                                            <Link href={`/products/${product.slug}`}>
                                                <div className={viewMode === "list" ? "flex justify-between items-start" : ""}>
                                                    <div className={viewMode === "list" ? "flex-1" : ""}>
                                                        <h3 className="font-bold text-xl mb-2 line-clamp-1 hover:text-accent transition-colors group-hover:text-accent">
                                                            {product.name}
                                                        </h3>
                                        <p className="text-slate-600 mb-3 font-medium">
                                            {product.artists?.find(artist => artist.role === 'main')?.name || product.artists?.[0]?.name || 'Unknown Artist'}
                                        </p>                                                        {viewMode === "list" && (
                                                            <div className="text-sm text-slate-500 mb-4 space-y-1">
                                                                <p className="flex items-center gap-2">
                                                                    <span className="w-2 h-2 bg-accent rounded-full" />
                                                                    Thể loại: {product.genre}
                                                                </p>
                                                                <p className="flex items-center gap-2">
                                                                    <span className="w-2 h-2 bg-accent rounded-full" />
                                                                    Hãng đĩa: {product.label}
                                                                </p>
                                                            </div>
                                                        )}

                                                        <div className="flex items-center gap-2 mb-4">
                                                            <div className="flex">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                                                                ))}
                                                            </div>
                                                            <span className="text-sm font-semibold text-slate-700">4.8</span>
                                                            <span className="text-xs text-slate-500">(125)</span>
                                                        </div>
                                                    </div>

                                                    <div className={`flex ${viewMode === "list" ? "flex-col items-end" : "items-center justify-between"}`}>
                                                        <div className={`flex items-center gap-2 ${viewMode === "list" ? "mb-4" : "mb-4"}`}>
                                                            {product.compare_price && product.compare_price > product.price && (
                                                                <span className="text-sm line-through text-slate-400">
                                                                    {product.compare_price.toLocaleString('vi-VN')}đ
                                                                </span>
                                                            )}
                                                            <span className="text-2xl font-bold bg-gradient-to-r from-accent to-orange-600 bg-clip-text text-transparent">
                                                                {product.price?.toLocaleString('vi-VN')}đ
                                                            </span>
                                                            {product.compare_price && product.compare_price > product.price && (
                                                                <Badge className="bg-red-500 text-white text-xs">
                                                                    -{Math.round((1 - product.price / product.compare_price) * 100)}%
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>

                                            <div className="flex gap-3">
                                                {product.status === 'out_of_stock' ? (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        disabled
                                                        className="flex-1 border-red-300 text-red-500 opacity-50"
                                                    >
                                                        Hết hàng
                                                    </Button>
                                                ) : (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="default"
                                                            className="flex-1 bg-accent hover:bg-accent/90 shadow-sm"
                                                            onClick={(e) => handleAddToCart(e, product.id)}
                                                            disabled={cartItemProductIds.has(product.id)}
                                                        >
                                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                                            Thêm vào giỏ
                                                        </Button>
                                                        {product.stock_quantity <= product.min_stock_level && (
                                                            <Badge className="bg-orange-500 text-white text-xs absolute top-2 left-2">
                                                                Sắp hết
                                                            </Badge>
                                                        )}
                                                    </>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-accent/30 text-accent hover:bg-accent hover:text-white transition-all duration-300 shadow-sm"
                                                    asChild
                                                >
                                                    <Link href={`/products/${product.slug}`}>
                                                        Xem chi tiết
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="absolute bottom-4 right-4 w-3 h-3 bg-accent rounded-full opacity-60 group-hover:animate-pulse" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="relative inline-block mb-8">
                                <Disc3 className="h-32 w-32 text-accent/30 mx-auto animate-spin-slow" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Music className="h-16 w-16 text-accent/20" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-800 mb-4">Không tìm thấy sản phẩm</h3>
                            <p className="text-slate-600 text-lg max-w-md mx-auto mb-8">
                                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để khám phá thêm những album tuyệt vời.
                            </p>
                            <Button
                                variant="default"
                                size="lg"
                                onClick={() => {
                                    setSearchTerm('');
                                    router.get('/products', {}, {
                                        preserveState: true,
                                        preserveScroll: true,
                                        only: ['products', 'pagination', 'filters'],
                                    });
                                }}
                                className="bg-gradient-to-r from-accent to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0"
                            >
                                Xem tất cả sản phẩm
                            </Button>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.total > 0 && (
                        <div className="mt-12">
                            <Pagination
                                currentPage={pagination.current_page}
                                lastPage={pagination.last_page}
                                total={pagination.total}
                                from={pagination.from || 0}
                                to={pagination.to || 0}
                                filters={currentFilters}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
