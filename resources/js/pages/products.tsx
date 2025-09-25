import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { Search, Star, Grid, List, Disc3 } from "lucide-react";
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
                <section className="bg-gradient-to-r from-primary to-primary/90 text-white py-12">
                    <div className="container mx-auto px-4">
                        <h1 className="text-3xl lg:text-4xl font-bold mb-4">Bộ sưu tập đĩa than</h1>
                        <p className="text-white/90 text-lg">
                            Khám phá hơn {pagination.total ? pagination.total.toLocaleString('vi-VN') : '1,000'}+ đĩa than chính hãng từ những nghệ sĩ huyền thoại
                        </p>
                    </div>
                </section>

                <div className="container mx-auto px-4 py-8">
                    {/* Filters */}
                    <div className="flex flex-col lg:flex-row gap-6 mb-8">
                        {/* Search & Filters */}
                        <div className="flex-1 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-4">
                            <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm kiếm album, nghệ sĩ..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </form>

                            <Select
                                value={props.genre || "all"}
                                onValueChange={(value) => handleFilterChange('genre', value)}
                            >
                                <SelectTrigger className="w-48">
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
                                <SelectTrigger className="w-48">
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
                        <div className="flex items-center gap-2">
                            <div className="flex border rounded-md">
                                <Button
                                    variant={viewMode === "grid" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setViewMode("grid")}
                                    className="rounded-r-none"
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === "list" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setViewMode("list")}
                                    className="rounded-l-none"
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>

                            <Select
                                value={props.sort || "featured"}
                                onValueChange={(value) => handleFilterChange('sort', value)}
                            >
                                <SelectTrigger className="w-48">
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
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    Xóa bộ lọc
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Results Info */}
                    {pagination.total > 0 && (
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex flex-wrap items-center gap-2">
                                {currentFilters.search && (
                                    <span className="text-sm text-muted-foreground">
                                        Tìm kiếm: <span className="font-medium text-foreground">"{currentFilters.search}"</span>
                                    </span>
                                )}
                                {currentFilters.genre && currentFilters.genre !== 'all' && (
                                    <span className="text-sm text-muted-foreground">
                                        Thể loại: <span className="font-medium text-foreground">{currentFilters.genre}</span>
                                    </span>
                                )}
                                {currentFilters.label && currentFilters.label !== 'all' && (
                                    <span className="text-sm text-muted-foreground">
                                        Hãng đĩa: <span className="font-medium text-foreground">{currentFilters.label}</span>
                                    </span>
                                )}
                                {currentFilters.sort && currentFilters.sort !== 'featured' && (
                                    <span className="text-sm text-muted-foreground">
                                        Sắp xếp: <span className="font-medium text-foreground">
                                            {sortOptions.find(option => option.value === currentFilters.sort)?.label}
                                        </span>
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Products Grid */}
                    {productsData.data.length > 0 ? (
                        <div className={`grid gap-6 ${
                            viewMode === "grid"
                                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                : "grid-cols-1"
                        }`}>
                            {productsData.data.map((product: Product, index: number) => (
                                <Card
                                    key={product.id}
                                    className={`product-hover cursor-pointer animate-fade-in border-0 shadow-vinyl ${
                                        viewMode === "list" ? "flex-row" : ""
                                    }`}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <CardContent className={`p-0 ${viewMode === "list" ? "flex" : ""}`}>
                                        <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                                            <Link href={`/products/${product.slug}`}>
                                                <div className={`w-full bg-muted flex items-center justify-center ${
                                                    viewMode === "list" ? "h-32" : "h-64"
                                                } ${
                                                    viewMode === "list" ? "rounded-l-lg" : "rounded-t-lg"
                                                }`}>
                                                    <Disc3 className="h-16 w-16 text-muted-foreground/30" />
                                                </div>
                                            </Link>
                                            {product.is_featured && (
                                                <Badge
                                                    variant="secondary"
                                                    className="absolute top-3 left-3 bg-accent text-accent-foreground"
                                                >
                                                    Nổi bật
                                                </Badge>
                                            )}
                                        </div>

                                        <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                                            <Link href={`/products/${product.slug}`}>
                                                <div className={viewMode === "list" ? "flex justify-between items-start" : ""}>
                                                    <div className={viewMode === "list" ? "flex-1" : ""}>
                                                        <h3 className="font-semibold text-lg mb-1 line-clamp-1 hover:text-accent transition-colors">{product.name}</h3>
                                                        <p className="text-muted-foreground mb-2">
                                                            {product.artists?.map(artist => artist.name).join(', ') || 'Unknown Artist'}
                                                        </p>

                                                        {viewMode === "list" && (
                                                            <div className="text-sm text-muted-foreground mb-3">
                                                                <p>Thể loại: {product.genre}</p>
                                                                <p>Hãng đĩa: {product.label}</p>
                                                            </div>
                                                        )}

                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Star className="h-4 w-4 fill-accent text-accent" />
                                                            <span className="text-sm font-medium">4.8</span>
                                                            <span className="text-xs text-muted-foreground">(125 đánh giá)</span>
                                                        </div>
                                                    </div>

                                                    <div className={`flex ${viewMode === "list" ? "flex-col items-end" : "items-center justify-between"}`}>
                                                        <div className={`flex items-center gap-2 ${viewMode === "list" ? "mb-3" : "mb-3"}`}>
                                                            <span className="text-xl font-bold text-accent">{product.price?.toLocaleString('vi-VN')}đ</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>

                                            <div className="mt-3">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="hover:bg-accent hover:text-accent-foreground"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        // Logic thêm vào giỏ hàng sẽ được implement sau
                                                        console.log('Add to cart:', product.id);
                                                    }}
                                                >
                                                    Thêm vào giỏ
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Disc3 className="h-24 w-24 text-muted-foreground/30 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem thêm sản phẩm.
                            </p>
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
