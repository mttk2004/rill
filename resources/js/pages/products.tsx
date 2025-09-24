import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, Grid, List, Disc3 } from "lucide-react";
import { type ProductsPageData, Product } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, FormEvent } from 'react';
import { type SharedData } from '@/types';

interface ProductsProps extends ProductsPageData {
    search?: string;
    genre?: string;
    label?: string;
    artist?: string;
    sort?: string;
}

export default function Products({ products: productsData, pagination, ...props }: ProductsProps) {
    const { auth } = usePage<SharedData>().props;
    const [searchTerm, setSearchTerm] = useState(props.search || '');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

    // Mock data for genres and labels - in real app, this would come from backend
    const genres = ["Tất cả", "Rock", "Pop", "Jazz", "Classical", "Progressive Rock"];
    const labels = ["Tất cả", "Apple Records", "Harvest Records", "Epic Records", "Warner Bros", "Asylum Records"];
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

                            <Select defaultValue={props.genre || "all-genres"}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Thể loại" />
                                </SelectTrigger>
                                <SelectContent>
                                    {genres.map((genre) => (
                                        <SelectItem key={genre} value={genre.toLowerCase().replace(/\s+/g, '-')}>
                                            {genre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select defaultValue={props.label || "all-labels"}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Hãng đĩa" />
                                </SelectTrigger>
                                <SelectContent>
                                    {labels.map((label) => (
                                        <SelectItem key={label} value={label.toLowerCase().replace(/\s+/g, '-')}>
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

                            <Select defaultValue={props.sort || "popular"}>
                                <SelectTrigger className="w-48">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="popular">Phổ biến</SelectItem>
                                    <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                                    <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                                    <SelectItem value="newest">Mới nhất</SelectItem>
                                    <SelectItem value="rating">Đánh giá cao</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Results Info */}
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-muted-foreground">
                            {pagination.total > 0 ? (
                                <>Hiển thị <span className="font-medium">{pagination.from}-{pagination.to}</span> trong <span className="font-medium">{pagination.total}</span> sản phẩm</>
                            ) : (
                                'Không tìm thấy sản phẩm nào'
                            )}
                            {currentFilters.search && (
                                <> cho "{currentFilters.search}"</>
                            )}
                        </p>
                    </div>

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
                                            <div className={`w-full bg-muted flex items-center justify-center ${
                                                viewMode === "list" ? "h-32" : "h-64"
                                            } ${
                                                viewMode === "list" ? "rounded-l-lg" : "rounded-t-lg"
                                            }`}>
                                                <Disc3 className="h-16 w-16 text-muted-foreground/30" />
                                            </div>
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
                                            <div className={viewMode === "list" ? "flex justify-between items-start" : ""}>
                                                <div className={viewMode === "list" ? "flex-1" : ""}>
                                                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
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
                                                    <div className={`flex items-center gap-2 ${viewMode === "list" ? "mb-3" : ""}`}>
                                                        <span className="text-xl font-bold text-accent">{product.price?.toLocaleString('vi-VN')}đ</span>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="hover:bg-accent hover:text-accent-foreground"
                                                    >
                                                        Thêm vào giỏ
                                                    </Button>
                                                </div>
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
                    {pagination.last_page > 1 && (
                        <div className="flex justify-center mt-12">
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={pagination.current_page <= 1}
                                >
                                    Trước
                                </Button>
                                {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                                    const page = i + 1;
                                    return (
                                        <Button
                                            key={page}
                                            variant={pagination.current_page === page ? "default" : "outline"}
                                            size="sm"
                                        >
                                            {page}
                                        </Button>
                                    );
                                })}
                                {pagination.last_page > 5 && (
                                    <>
                                        <span className="px-2 text-muted-foreground">...</span>
                                        <Button variant="outline" size="sm">{pagination.last_page}</Button>
                                    </>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={pagination.current_page >= pagination.last_page}
                                >
                                    Sau
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
