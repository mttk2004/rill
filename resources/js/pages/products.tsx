import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Pagination } from "@/components/ui/pagination";
import { Search, Grid, List, Disc3, Music, ShoppingCart, SlidersHorizontal } from "lucide-react";
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

                <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1ल्यूLCAyNTUsLCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
                    <div className="absolute top-10 left-10 animate-spin-slow"><Disc3 className="h-20 w-20 text-amber-500/10" /></div>
                    <div className="absolute top-20 right-10 animate-spin-reverse"><Disc3 className="h-16 w-16 text-amber-500/5" /></div>

                    <div className="relative container mx-auto px-4 py-12">
                        <h1 className="text-4xl font-bold text-white drop-shadow-lg flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg"><Music className="h-8 w-8" /></div>
                            Sản phẩm
                        </h1>
                        <p className="text-slate-200 drop-shadow">Khám phá bộ sưu tập đĩa than chính hãng của chúng tôi.</p>
                    </div>
                </div>

                <main className="container mx-auto px-4 py-8">
                    <div className="max-w-7xl mx-auto">
                        <Card className="mb-8 border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                            <CardContent className="p-4">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="w-full md:w-auto md:flex-1">
                                        <form onSubmit={handleSearch} className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                                            <Input
                                                placeholder="Tìm kiếm theo tên sản phẩm..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-9"
                                            />
                                        </form>
                                    </div>
                                    <div className="hidden md:flex items-center gap-4">
                                        <Select value={props.genre || "all"} onValueChange={(value) => handleFilterChange('genre', value)}>
                                            <SelectTrigger className="w-[180px]">
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

                                        <Select value={props.label || "all"} onValueChange={(value) => handleFilterChange('label', value)}>
                                            <SelectTrigger className="w-[180px]">
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

                                        <Select value={props.sort || "featured"} onValueChange={(value) => handleFilterChange('sort', value)}>
                                            <SelectTrigger className="w-[180px]">
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
                                    </div>
                                    <div className="hidden md:flex items-center gap-2">
                                        <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')}>
                                            <Grid className="h-4 w-4" />
                                        </Button>
                                        <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')}>
                                            <List className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="md:hidden flex items-center justify-between w-full">
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <Button variant="outline" className="w-full">
                                                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                                                    Lọc & Sắp xếp
                                                </Button>
                                            </SheetTrigger>
                                            <SheetContent>
                                                <SheetHeader>
                                                    <SheetTitle>Bộ lọc</SheetTitle>
                                                </SheetHeader>
                                                <div className="py-4 space-y-4">
                                                    <Select value={props.genre || "all"} onValueChange={(value) => handleFilterChange('genre', value)}>
                                                        <SelectTrigger><SelectValue placeholder="Thể loại" /></SelectTrigger>
                                                        <SelectContent>
                                                            {genres.map((genre) => <SelectItem key={genre} value={genre === "Tất cả" ? "all" : genre}>{genre}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                    <Select value={props.label || "all"} onValueChange={(value) => handleFilterChange('label', value)}>
                                                        <SelectTrigger><SelectValue placeholder="Hãng đĩa" /></SelectTrigger>
                                                        <SelectContent>
                                                            {labels.map((label) => <SelectItem key={label} value={label === "Tất cả" ? "all" : label}>{label}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                    <Select value={props.sort || "featured"} onValueChange={(value) => handleFilterChange('sort', value)}>
                                                        <SelectTrigger><SelectValue placeholder="Sắp xếp" /></SelectTrigger>
                                                        <SelectContent>
                                                            {sortOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </SheetContent>
                                        </Sheet>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {pagination.total > 0 && (
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Hiển thị {pagination.from}-{pagination.to} trong số {pagination.total} sản phẩm.
                                    {Object.values(currentFilters).filter(Boolean).length > 0 &&
                                        ` (${Object.values(currentFilters).filter(Boolean).length} bộ lọc đang áp dụng)`
                                    }
                                </p>
                                <div className="flex items-center gap-2 md:hidden">
                                    <Button variant={viewMode === 'grid' ? 'secondary' : 'outline'} size="icon" onClick={() => setViewMode('grid')}>
                                        <Grid className="h-4 w-4" />
                                    </Button>
                                    <Button variant={viewMode === 'list' ? 'secondary' : 'outline'} size="icon" onClick={() => setViewMode('list')}>
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {productsData.data.length > 0 ? (
                        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                            {productsData.data.map((product: Product) => (
                                <Card key={product.id} className={`transition-all duration-300 hover:shadow-lg ${viewMode === 'list' ? 'flex flex-row' : ''}`}>
                                    <Link href={`/products/${product.slug}`} className={`${viewMode === 'list' ? 'w-1/3' : ''}`}>
                                        <CardContent className="p-0">
                                            <div className={`aspect-square bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden ${viewMode === 'grid' ? 'rounded-t-lg' : 'rounded-l-lg'}`}>
                                                <Disc3 className="h-24 w-24 text-slate-300 dark:text-slate-600 animate-spin-slow" />
                                            </div>
                                        </CardContent>
                                    </Link>
                                    <div className={`p-4 flex flex-col justify-between ${viewMode === 'list' ? 'w-2/3' : ''}`}>
                                        <div>
                                                <Link href={`/products/${product.slug}`}>
                                                <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                                                    {product.artists?.find(artist => artist.role === 'main')?.name || product.artists?.[0]?.name || 'Unknown Artist'}
                                                </p>
                                                </Link>
                                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 mb-4">
                                                <Badge variant="outline">{product.genre}</Badge>
                                                <Badge variant="outline">{product.label}</Badge>
                                                </div>
                                            </div>
                                        <div className="flex items-center justify-between">
                                            <p className="font-bold text-xl text-amber-600">
                                                {product.price?.toLocaleString('vi-VN')}₫
                                            </p>
                                            {product.status === 'out_of_stock' ? (
                                                <Button size="sm" variant="outline" disabled>Hết hàng</Button>
                                            ) : (
                                                <Button size="sm" onClick={(e) => handleAddToCart(e, product.id)} disabled={cartItemProductIds.has(product.id)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                                    {cartItemProductIds.has(product.id) ? 'Đã thêm' : 'Thêm vào giỏ'}
                                                    </Button>
                                            )}
                                            </div>
                                    </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                        <Card className="text-center py-16 border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                            <CardContent>
                                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center">
                                    <Music className="h-10 w-10 text-slate-500" />
                                    </div>
                                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Không tìm thấy sản phẩm</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">Không có sản phẩm nào khớp với bộ lọc hiện tại.</p>
                                <Button onClick={() => router.get('/products')}>Xem tất cả sản phẩm</Button>
                            </CardContent>
                        </Card>
                        )}

                    {pagination.total > pagination.per_page && (
                        <div className="mt-8">
                            <Pagination links={pagination.links} />
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
