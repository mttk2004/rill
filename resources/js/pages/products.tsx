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
import { useState, FormEvent } from 'react';
import { type SharedData } from '@/types';

interface ProductsProps extends ProductsPageData {
    search?: string;
    genre?: string;
    label?: string;
    artist?: string;
    sort?: string;
    page?: number;
}

export default function Products({ products: productsData, pagination, filters, ...props }: ProductsProps) {
    const { auth } = usePage<SharedData>().props;
    const [searchTerm, setSearchTerm] = useState(props.search || '');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        updateFilters({
            search: searchTerm || undefined,
            page: 1, // Reset to first page when searching
        });
    };

    const handleFilterChange = (key: string, value: string) => {
        const newValue = value === 'all' || value === '' ? undefined : value;

        // Preserve existing filters and only update the changed one
        const updatedFilters = {
            search: props.search,
            genre: props.genre,
            label: props.label,
            artist: props.artist,
            sort: props.sort,
            [key]: newValue,
            page: 1, // Reset to first page when filtering
        };

        // Remove empty values
        Object.keys(updatedFilters).forEach(filterKey => {
            if (!updatedFilters[filterKey as keyof typeof updatedFilters]) {
                delete updatedFilters[filterKey as keyof typeof updatedFilters];
            }
        });

        router.get('/products', updatedFilters, {
            preserveState: true,
            preserveScroll: false,
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

        // Remove empty values
        Object.keys(currentFilters).forEach(key => {
            if (!currentFilters[key as keyof typeof currentFilters]) {
                delete currentFilters[key as keyof typeof currentFilters];
            }
        });

        router.get('/products', currentFilters, {
            preserveState: true,
            preserveScroll: false,
        });
    };

    const currentFilters = {
        search: props.search,
        genre: props.genre,
        label: props.label,
        artist: props.artist,
        sort: props.sort,
    };

    // Use real data from backend
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

                {/* Header */}
                <section className="relative bg-gradient-to-br from-slate-900 via-accent/20 to-slate-800 text-white py-16 lg:py-24 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,119,6,0.1),transparent_50%)]" />
                    <div className="absolute top-10 left-10 opacity-20">
                        <Disc3 className="w-32 h-32 animate-spin-slow text-accent/30" />
                    </div>
                    <div className="absolute bottom-10 right-10 opacity-20">
                        <Music className="w-40 h-40 text-accent/20" />
                    </div>
                    
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-accent/20 text-accent-foreground border-accent/30">
                            🎵 Bộ sưu tập vinyl
                        </Badge>
                        <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                            Khám phá
                            <span className="block bg-gradient-to-r from-accent via-yellow-500 to-accent bg-clip-text text-transparent">
                                đĩa than chính hãng
                            </span>
                        </h1>
                        <p className="text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-8">
                            Hơn {pagination.total ? pagination.total.toLocaleString('vi-VN') : '1,000'}+ album từ những nghệ sĩ huyền thoại thế giới
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <div className="flex items-center gap-4 text-accent">
                                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                                <span className="text-lg font-medium">Chính hãng 100%</span>
                            </div>
                            <div className="hidden sm:block w-px h-6 bg-accent/30" />
                            <div className="flex items-center gap-4 text-accent">
                                <div className="w-2 h-2 bg-accent rounded-full animate-pulse animation-delay-300" />
                                <span className="text-lg font-medium">Âm thanh hoàn hảo</span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="container mx-auto px-4 py-12">
                    {/* Filters */}
                    <div className="backdrop-blur-sm bg-white/80 rounded-2xl p-8 shadow-xl border border-accent/10 mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                                <Filter className="w-5 h-5 text-accent" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Bộ lọc & tìm kiếm</h2>
                        </div>
                        
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Search & Filters */}
                            <div className="flex-1 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-4">
                                <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-accent" />
                                    <Input
                                        placeholder="Tìm kiếm album, nghệ sĩ..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-12 h-12 bg-white/80 border-accent/20 focus:border-accent shadow-sm"
                                    />
                                </form>

                                <Select
                                    value={props.genre || "all"}
                                    onValueChange={(value) => handleFilterChange('genre', value)}
                                >
                                    <SelectTrigger className="w-56 h-12 bg-white/80 border-accent/20 focus:border-accent shadow-sm">
                                        <SelectValue placeholder="Thể loại" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {genres.map((genre) => (
                                            <SelectItem key={genre} value={genre === "Tất cả" ? "all" : genre}>
                                                {genre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={props.label || "all"}
                                    onValueChange={(value) => handleFilterChange('label', value)}
                                >
                                    <SelectTrigger className="w-56 h-12 bg-white/80 border-accent/20 focus:border-accent shadow-sm">
                                        <SelectValue placeholder="Hãng đĩa" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {labels.map((label) => (
                                            <SelectItem key={label} value={label === "Tất cả" ? "all" : label}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* View Mode & Sort */}
                            <div className="flex items-center gap-4">
                                <div className="flex border border-accent/20 rounded-xl overflow-hidden bg-white/60">
                                    <Button
                                        variant={viewMode === "grid" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setViewMode("grid")}
                                        className={`rounded-r-none h-10 ${viewMode === "grid" ? "bg-accent text-white" : ""}`}
                                    >
                                        <Grid className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === "list" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setViewMode("list")}
                                        className={`rounded-l-none h-10 ${viewMode === "list" ? "bg-accent text-white" : ""}`}
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>

                                <Select
                                    value={props.sort || "featured"}
                                    onValueChange={(value) => handleFilterChange('sort', value)}
                                >
                                    <SelectTrigger className="w-56 h-12 bg-white/80 border-accent/20 focus:border-accent shadow-sm">
                                        <SelectValue placeholder="Sắp xếp" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sortOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Clear Filters Button */}
                                {(props.genre || props.label || props.search || (props.sort && props.sort !== 'featured')) && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSearchTerm('');
                                            router.get('/products', {}, {
                                                preserveState: true,
                                                preserveScroll: false,
                                            });
                                        }}
                                        className="h-10 border-accent/20 text-accent hover:bg-accent hover:text-white"
                                    >
                                        Xóa bộ lọc
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Results Info */}
                    {pagination.total > 0 && (
                        <div className="flex items-center justify-between mb-8 px-4">
                            <div className="flex flex-wrap items-center gap-4">
                                {currentFilters.search && (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full">
                                        <span className="text-sm text-slate-600">Tìm kiếm:</span>
                                        <span className="font-semibold text-accent">"{currentFilters.search}"</span>
                                    </div>
                                )}
                                {currentFilters.genre && currentFilters.genre !== 'all' && (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full">
                                        <span className="text-sm text-slate-600">Thể loại:</span>
                                        <span className="font-semibold text-accent">{currentFilters.genre}</span>
                                    </div>
                                )}
                                {currentFilters.label && currentFilters.label !== 'all' && (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full">
                                        <span className="text-sm text-slate-600">Hãng đĩa:</span>
                                        <span className="font-semibold text-accent">{currentFilters.label}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Products Grid */}
                    {productsData.data.length > 0 ? (
                        <div className={`grid gap-8 ${
                            viewMode === "grid"
                                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
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
                                                            {product.artists?.map(artist => artist.name).join(', ') || 'Unknown Artist'}
                                                        </p>

                                                        {viewMode === "list" && (
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
                                                            <span className="text-2xl font-bold bg-gradient-to-r from-accent to-orange-600 bg-clip-text text-transparent">
                                                                {product.price?.toLocaleString('vi-VN')}đ
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>

                                            <div className="flex gap-3">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1 border-accent/30 text-accent hover:bg-accent hover:text-white transition-all duration-300 shadow-sm"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        console.log('Add to cart:', product.id);
                                                    }}
                                                >
                                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                                    Thêm vào giỏ
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="default"
                                                    className="bg-accent hover:bg-accent/90 shadow-sm"
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
                                        preserveScroll: false,
                                    });
                                }}
                                className="bg-accent hover:bg-accent/90"
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
