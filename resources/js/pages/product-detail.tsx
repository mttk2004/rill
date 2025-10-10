import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/navigation";
import { Heart, ShoppingCart, Star, Disc3, Calendar, Music, ArrowLeft } from "lucide-react";
import { Link, Head, usePage } from '@inertiajs/react';
import { useState, MouseEvent } from "react";
import { Product, SharedData } from '@/types';
import { useCart } from "@/hooks/use-cart";
import { toast } from 'sonner';

interface ProductDetailProps {
    product: Product;
    cartItemProductIds: string[];
}

export default function ProductDetail({ product, cartItemProductIds }: ProductDetailProps) {
    const { auth } = usePage<SharedData>().props;
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const isInCart = cartItemProductIds.includes(product.id);

    const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        toast.promise(addToCart(product.id, quantity), {
            loading: 'Đang thêm vào giỏ hàng...',
            success: `Đã thêm ${quantity} sản phẩm vào giỏ!`,
            error: (err) => err.message || 'Đã xảy ra lỗi.',
        });
    };

    const handleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        // Logic thêm vào wishlist sẽ được implement sau
    };

    // Tính toán discount percentage nếu có compare_price
    const discountPercentage = product.compare_price
        ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
        : null;

    // Mock reviews data - sẽ được thay thế bằng real data từ backend
    const mockReviews = [
        {
            id: 1,
            user: "Minh Hoàng",
            rating: 5,
            date: "2024-01-15",
            comment: "Chất lượng âm thanh tuyệt vời! Đóng gói cẩn thận. Rất hài lòng với sản phẩm."
        },
        {
            id: 2,
            user: "Thu Hà",
            rating: 4,
            date: "2024-01-10",
            comment: "Album kinh điển, chất lượng đĩa rất tốt. Giao hàng nhanh."
        }
    ];

    const mockRating = 4.8;
    const mockReviewCount = 156;

    return (
        <>
            <Head title={`${product.name} - Rill`} />
            <Toaster richColors />
            <div className="min-h-screen bg-background">
                <Navigation user={auth.user} />

                <main className="container mx-auto px-4 py-8">
                    <div className="max-w-6xl mx-auto">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 mb-6 text-sm">
                            <Link href="/" className="text-muted-foreground hover:text-foreground">
                                Trang chủ
                            </Link>
                            <span className="text-muted-foreground">/</span>
                            <Link href="/products" className="text-muted-foreground hover:text-foreground">
                                Sản phẩm
                            </Link>
                            <span className="text-muted-foreground">/</span>
                            <span className="text-foreground">{product.name}</span>
                        </div>

                        {/* Back button */}
                        <Link href="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
                            <ArrowLeft className="h-4 w-4" />
                            Quay lại danh sách sản phẩm
                        </Link>

                        <div className="grid gap-8 lg:grid-cols-2 mb-12">
                            {/* Product Image */}
                            <div className="space-y-4">
                                <div className="aspect-square overflow-hidden rounded-lg border bg-muted flex items-center justify-center">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <Disc3 className="h-24 w-24 mb-4" />
                                            <p className="text-sm">Chưa có hình ảnh</p>
                                        </div>
                                    )}
                                </div>

                                {/* Additional images placeholder */}
                                <div className="grid grid-cols-4 gap-2">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="aspect-square rounded-md border bg-muted/50 flex items-center justify-center">
                                            <Disc3 className="h-6 w-6 text-muted-foreground/50" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="secondary">{product.genre}</Badge>
                                        <Badge variant="outline">New & Sealed</Badge>
                                        {product.is_featured && (
                                            <Badge variant="default" className="bg-accent text-accent-foreground">
                                                Nổi bật
                                            </Badge>
                                        )}
                                    </div>

                                    <h1 className="text-3xl font-bold text-foreground mb-2">
                                        {product.name}
                                    </h1>

                                    <div className="flex items-center gap-2 mb-4">
                                        {product.artists?.map((artist, index) => (
                                            <span key={artist.id}>
                                                <span className="text-xl text-accent hover:underline cursor-pointer">
                                                    {artist.name}
                                                </span>
                                                {index < product.artists.length - 1 && (
                                                    <span className="text-muted-foreground">, </span>
                                                )}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${
                                                        i < Math.floor(mockRating)
                                                            ? 'fill-accent text-accent'
                                                            : 'text-muted-foreground'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {mockRating} ({mockReviewCount} đánh giá)
                                        </span>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl font-bold text-accent">
                                            {product.price.toLocaleString('vi-VN')}₫
                                        </span>
                                        {product.compare_price && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg text-muted-foreground line-through">
                                                    {product.compare_price.toLocaleString('vi-VN')}₫
                                                </span>
                                                <Badge variant="destructive" className="text-xs">
                                                    -{discountPercentage}%
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                    {product.compare_price && (
                                        <p className="text-sm text-green-600">
                                            Tiết kiệm {(product.compare_price - product.price).toLocaleString('vi-VN')}₫
                                        </p>
                                    )}
                                </div>

                                {/* Product Details */}
                                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Disc3 className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            <span className="text-muted-foreground">Format:</span> 12" LP, 33 RPM
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            <span className="text-muted-foreground">Năm:</span> 2024
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Music className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            <span className="text-muted-foreground">Label:</span> {product.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">
                                            <span className="text-muted-foreground">Trạng thái:</span> {
                                                product.in_stock ? 'Còn hàng' : 'Hết hàng'
                                            }
                                        </span>
                                    </div>
                                </div>

                                {/* Stock Status */}
                                <div className="flex items-center gap-2">
                                    <div className={`h-2 w-2 rounded-full ${
                                        product.in_stock ? 'bg-green-500' : 'bg-red-500'
                                    }`} />
                                    <span className="text-sm">
                                        {product.in_stock
                                            ? `Còn ${product.stock_quantity} sản phẩm`
                                            : 'Hết hàng'
                                        }
                                        {product.low_stock && product.in_stock && (
                                            <span className="text-amber-600 ml-2">(Sắp hết hàng)</span>
                                        )}
                                    </span>
                                </div>

                                {/* Quantity & Actions */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <label className="text-sm font-medium">Số lượng:</label>
                                        <div className="flex items-center border rounded-md">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                disabled={quantity <= 1}
                                            >
                                                -
                                            </Button>
                                            <span className="px-4 py-2 text-center min-w-[60px]">{quantity}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                                                disabled={quantity >= product.stock_quantity}
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button
                                            className="flex-1"
                                            onClick={handleAddToCart}
                                            disabled={!product.in_stock || isInCart}
                                        >
                                            <ShoppingCart className="h-4 w-4 mr-2" />
                                            {isInCart ? 'Đã có trong giỏ' : (product.in_stock ? 'Thêm vào giỏ hàng' : 'Hết hàng')}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handleWishlist}
                                        >
                                            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                                        </Button>
                                    </div>
                                </div>

                                {/* Description */}
                                {product.description && (
                                    <div>
                                        <p className="text-muted-foreground">{product.description}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tabs */}
                        <Tabs defaultValue="description" className="mb-12">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="description">Mô tả chi tiết</TabsTrigger>
                                <TabsTrigger value="reviews">Đánh giá ({mockReviewCount})</TabsTrigger>
                                <TabsTrigger value="shipping">Vận chuyển</TabsTrigger>
                            </TabsList>

                            <TabsContent value="description" className="mt-6">
                                <div className="space-y-6">
                                    {/* Hero Description Card */}
                                    <Card className="border-2 border-accent/20 bg-gradient-to-br from-background via-background to-accent/5 shadow-lg">
                                        <CardContent className="p-8">
                                            {product.detailed_description ? (
                                                <div className="prose prose-lg prose-stone max-w-none [&>h3]:text-accent [&>h3]:font-bold [&>h3]:text-xl [&>h3]:mb-3 [&>p]:text-foreground/90 [&>p]:leading-relaxed [&>ul]:space-y-2 [&>li]:text-foreground/80">
                                                    <div dangerouslySetInnerHTML={{ __html: product.detailed_description }} />
                                                </div>
                                            ) : (
                                                <div className="space-y-8">
                                                    {/* Main Description */}
                                                    <div className="text-center py-4">
                                                        <div className="inline-block p-4 rounded-full bg-accent/10 mb-4">
                                                            <Disc3 className="h-8 w-8 text-accent" />
                                                        </div>
                                                        <h3 className="text-2xl font-bold text-accent mb-4">Về album này</h3>
                                                        <p className="text-lg text-foreground/90 leading-relaxed max-w-2xl mx-auto">
                                                            {product.description || 'Một tác phẩm âm nhạc đặc biệt được chọn lọc kỹ càng cho bộ sưu tập đĩa than của bạn.'}
                                                        </p>
                                                    </div>

                                                    {/* Features Grid */}
                                                    <div className="grid md:grid-cols-2 gap-6">
                                                        {/* Technical Specs */}
                                                        <Card className="border-accent/30 bg-accent/5">
                                                            <CardContent className="p-6">
                                                                <div className="flex items-center gap-3 mb-4">
                                                                    <div className="p-2 rounded-lg bg-accent/20">
                                                                        <Music className="h-5 w-5 text-accent" />
                                                                    </div>
                                                                    <h4 className="text-lg font-semibold text-accent">Thông số kỹ thuật</h4>
                                                                </div>
                                                                <div className="space-y-3 text-sm">
                                                                    <div className="flex justify-between items-center py-2 border-b border-accent/10">
                                                                        <span className="text-muted-foreground">Format:</span>
                                                                        <span className="font-medium">12" LP, 33⅓ RPM</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center py-2 border-b border-accent/10">
                                                                        <span className="text-muted-foreground">Chất lượng:</span>
                                                                        <span className="font-medium">Audiophile Grade</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center py-2 border-b border-accent/10">
                                                                        <span className="text-muted-foreground">Tình trạng:</span>
                                                                        <span className="font-medium text-green-600">Mint, Sealed</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center py-2">
                                                                        <span className="text-muted-foreground">Tương thích:</span>
                                                                        <span className="font-medium">Tất cả máy đĩa than</span>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>

                                                        {/* Genre & Label Info */}
                                                        <Card className="border-accent/30 bg-accent/5">
                                                            <CardContent className="p-6">
                                                                <div className="flex items-center gap-3 mb-4">
                                                                    <div className="p-2 rounded-lg bg-accent/20">
                                                                        <Star className="h-5 w-5 text-accent" />
                                                                    </div>
                                                                    <h4 className="text-lg font-semibold text-accent">Thông tin phát hành</h4>
                                                                </div>
                                                                <div className="space-y-3 text-sm">
                                                                    <div className="flex justify-between items-center py-2 border-b border-accent/10">
                                                                        <span className="text-muted-foreground">Thể loại:</span>
                                                                        <span className="font-medium">{product.genre}</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center py-2 border-b border-accent/10">
                                                                        <span className="text-muted-foreground">Hãng phát hành:</span>
                                                                        <span className="font-medium">{product.label}</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center py-2 border-b border-accent/10">
                                                                        <span className="text-muted-foreground">Nghệ sĩ:</span>
                                                                        <span className="font-medium">
                                                                            {product.artists?.map(artist => artist.name).join(', ') || 'Various Artists'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center py-2">
                                                                        <span className="text-muted-foreground">Collector's Item:</span>
                                                                        <span className="font-medium text-accent">✓ Có</span>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </div>

                                                    {/* Vintage Quote */}
                                                    <div className="relative">
                                                        <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 rounded-lg"></div>
                                                        <blockquote className="relative p-6 text-center">
                                                            <div className="text-6xl text-accent/20 mb-2">"</div>
                                                            <p className="text-lg italic text-foreground/80 mb-4">
                                                                Âm nhạc trên đĩa than mang lại trải nghiệm nghe nhạc chân thực và ấm áp nhất,
                                                                như cách các nghệ sĩ đã từng mong muốn.
                                                            </p>
                                                            <footer className="text-sm text-muted-foreground font-medium">
                                                                — Triết lý Rill Vinyl Store
                                                            </footer>
                                                        </blockquote>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent value="reviews" className="mt-6">
                                <div className="space-y-6">
                                    {/* Reviews Overview Card */}
                                    <Card className="border-2 border-accent/20 bg-gradient-to-br from-background via-background to-accent/5 shadow-lg">
                                        <CardHeader className="text-center pb-4">
                                            <div className="inline-block p-4 rounded-full bg-accent/10 mb-4">
                                                <Star className="h-8 w-8 text-accent fill-accent" />
                                            </div>
                                            <CardTitle className="text-2xl text-accent mb-2">Đánh giá từ cộng đồng</CardTitle>
                                            <p className="text-muted-foreground">Trải nghiệm thực từ những người yêu nhạc đĩa than</p>
                                        </CardHeader>
                                        <CardContent className="px-8 pb-8">
                                            {/* Rating Summary */}
                                            <div className="flex items-center justify-center gap-8 mb-8 p-6 bg-accent/5 rounded-xl border border-accent/10">
                                                <div className="text-center">
                                                    <div className="text-5xl font-bold text-accent mb-2">{mockRating}</div>
                                                    <div className="flex justify-center mb-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-5 w-5 ${
                                                                    i < Math.floor(mockRating)
                                                                        ? 'fill-accent text-accent'
                                                                        : 'text-muted-foreground'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground font-medium">
                                                        {mockReviewCount} đánh giá
                                                    </div>
                                                </div>

                                                <div className="flex-1 space-y-2 max-w-xs">
                                                    {[5, 4, 3, 2, 1].map((stars) => (
                                                        <div key={stars} className="flex items-center gap-2 text-sm">
                                                            <span className="w-3 text-muted-foreground">{stars}</span>
                                                            <Star className="h-3 w-3 fill-accent text-accent" />
                                                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-accent rounded-full transition-all duration-500"
                                                                    style={{
                                                                        width: stars === 5 ? '70%' : stars === 4 ? '20%' : stars === 3 ? '7%' : stars === 2 ? '2%' : '1%'
                                                                    }}
                                                                />
                                                            </div>
                                                            <span className="text-muted-foreground text-xs w-8">
                                                                {stars === 5 ? '70%' : stars === 4 ? '20%' : stars === 3 ? '7%' : stars === 2 ? '2%' : '1%'}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Individual Reviews */}
                                            <div className="space-y-6">
                                                <h3 className="text-xl font-semibold text-accent flex items-center gap-2 mb-4">
                                                    <Heart className="h-5 w-5" />
                                                    Câu chuyện từ những collector
                                                </h3>

                                                {mockReviews.map((review, index) => (
                                                    <Card key={review.id} className="border border-accent/20 bg-gradient-to-r from-background to-accent/5 hover:shadow-md transition-all duration-300">
                                                        <CardContent className="p-6">
                                                            {/* Review Header */}
                                                            <div className="flex items-start justify-between mb-4">
                                                                <div className="flex items-center gap-3">
                                                                    {/* User Avatar */}
                                                                    <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">
                                                                        {review.user.charAt(0)}
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-medium text-foreground">{review.user}</div>
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="flex">
                                                                                {[...Array(5)].map((_, i) => (
                                                                                    <Star
                                                                                        key={i}
                                                                                        className={`h-4 w-4 ${
                                                                                            i < review.rating
                                                                                                ? 'fill-accent text-accent'
                                                                                                : 'text-muted-foreground'
                                                                                        }`}
                                                                                    />
                                                                                ))}
                                                                            </div>
                                                                            <span className="text-sm text-muted-foreground">•</span>
                                                                            <span className="text-sm text-muted-foreground">
                                                                                {new Date(review.date).toLocaleDateString('vi-VN')}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Verified Badge */}
                                                                <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                                                                    <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                                                                    Đã mua hàng
                                                                </Badge>
                                                            </div>

                                                            {/* Review Content */}
                                                            <div className="relative">
                                                                <div className="absolute -left-2 top-0 w-1 h-full bg-gradient-to-b from-accent/50 to-accent/10 rounded-full"></div>
                                                                <blockquote className="pl-4 text-foreground/90 leading-relaxed italic">
                                                                    "{review.comment}"
                                                                </blockquote>
                                                            </div>

                                                            {/* Review Footer */}
                                                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-accent/10">
                                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                                    <span className="flex items-center gap-1">
                                                                        <Heart className="h-4 w-4" />
                                                                        Hữu ích ({index === 0 ? '12' : index === 1 ? '8' : '5'})
                                                                    </span>
                                                                </div>
                                                                <Badge variant="outline" className="text-xs">
                                                                    Collector #{index + 1}
                                                                </Badge>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}

                                                {/* Write Review CTA */}
                                                <Card className="border-2 border-dashed border-accent/30 bg-accent/5 hover:bg-accent/10 transition-colors">
                                                    <CardContent className="p-8 text-center">
                                                        <div className="inline-block p-3 rounded-full bg-accent/20 mb-4">
                                                            <Star className="h-6 w-6 text-accent" />
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-accent mb-2">Chia sẻ trải nghiệm của bạn</h3>
                                                        <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                                                            Hãy để lại đánh giá để giúp cộng đồng vinyl lover có những lựa chọn tốt nhất.
                                                        </p>
                                                        <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                                                            Viết đánh giá
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent value="shipping" className="mt-6">
                                <div className="space-y-6">
                                    {/* Shipping Hero Card */}
                                    <Card className="border-2 border-accent/20 bg-gradient-to-br from-background via-background to-accent/5 shadow-lg">
                                        <CardHeader className="text-center pb-4">
                                            <div className="inline-block p-4 rounded-full bg-accent/10 mb-4">
                                                <div className="relative">
                                                    <Disc3 className="h-8 w-8 text-accent" />
                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <CardTitle className="text-2xl text-accent mb-2">Giao hàng toàn quốc</CardTitle>
                                            <p className="text-muted-foreground">Đóng gói chuyên nghiệp, bảo vệ tối đa cho từng đĩa than</p>
                                        </CardHeader>
                                        <CardContent className="px-8 pb-8">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                {/* Shipping Info */}
                                                <Card className="border-accent/30 bg-accent/5">
                                                    <CardContent className="p-6">
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <div className="p-2 rounded-lg bg-green-100">
                                                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                                </div>
                                                            </div>
                                                            <h4 className="text-lg font-semibold text-accent">Miễn phí vận chuyển</h4>
                                                        </div>
                                                        <div className="space-y-3 text-sm">
                                                            <div className="flex items-center justify-between py-2 border-b border-accent/10">
                                                                <span className="text-muted-foreground">Toàn quốc:</span>
                                                                <span className="font-medium text-green-600">100% Miễn phí</span>
                                                            </div>
                                                            <div className="flex items-center justify-between py-2 border-b border-accent/10">
                                                                <span className="text-muted-foreground">Điều kiện:</span>
                                                                <span className="font-medium">Không yêu cầu</span>
                                                            </div>
                                                            <div className="flex items-center justify-between py-2">
                                                                <span className="text-muted-foreground">Phí COD:</span>
                                                                <span className="font-medium text-green-600">Miễn phí</span>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                {/* Delivery Time */}
                                                <Card className="border-accent/30 bg-accent/5">
                                                    <CardContent className="p-6">
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <div className="p-2 rounded-lg bg-accent/20">
                                                                <Calendar className="h-5 w-5 text-accent" />
                                                            </div>
                                                            <h4 className="text-lg font-semibold text-accent">Thời gian giao hàng</h4>
                                                        </div>
                                                        <div className="space-y-3 text-sm">
                                                            <div className="flex items-center justify-between py-2 border-b border-accent/10">
                                                                <span className="text-muted-foreground">TP.HCM:</span>
                                                                <span className="font-medium">1-2 ngày</span>
                                                            </div>
                                                            <div className="flex items-center justify-between py-2 border-b border-accent/10">
                                                                <span className="text-muted-foreground">Hà Nội:</span>
                                                                <span className="font-medium">2-3 ngày</span>
                                                            </div>
                                                            <div className="flex items-center justify-between py-2">
                                                                <span className="text-muted-foreground">Tỉnh thành khác:</span>
                                                                <span className="font-medium">3-5 ngày</span>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            {/* Special Care Section */}
                                            <Card className="mt-6 border-dashed border-2 border-accent/30 bg-accent/5">
                                                <CardContent className="p-6">
                                                    <div className="text-center">
                                                        <div className="inline-block p-3 rounded-full bg-accent/20 mb-4">
                                                            <Heart className="h-6 w-6 text-accent" />
                                                        </div>
                                                        <h4 className="text-lg font-semibold text-accent mb-3">Chăm sóc đặc biệt</h4>
                                                        <div className="grid md:grid-cols-2 gap-4 text-left">
                                                            <div className="space-y-2">
                                                                <div className="flex items-start gap-2">
                                                                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                                                    <span className="text-sm text-foreground/80">Đóng gói với vật liệu chống sốc chuyên dụng</span>
                                                                </div>
                                                                <div className="flex items-start gap-2">
                                                                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                                                    <span className="text-sm text-foreground/80">Hộp carton cứng bảo vệ góc cạnh</span>
                                                                </div>
                                                                <div className="flex items-start gap-2">
                                                                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                                                    <span className="text-sm text-foreground/80">Nhãn "FRAGILE - Handle with Care"</span>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <div className="flex items-start gap-2">
                                                                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                                                    <span className="text-sm text-foreground/80">Đổi trả miễn phí nếu hỏng do vận chuyển</span>
                                                                </div>
                                                                <div className="flex items-start gap-2">
                                                                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                                                    <span className="text-sm text-foreground/80">Bảo hành chất lượng đĩa than</span>
                                                                </div>
                                                                <div className="flex items-start gap-2">
                                                                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                                                    <span className="text-sm text-foreground/80">Hỗ trợ 24/7 qua hotline</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Vintage Quote */}
                                            <div className="relative mt-6">
                                                <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 rounded-lg"></div>
                                                <blockquote className="relative p-6 text-center">
                                                    <div className="text-4xl text-accent/20 mb-2">♪</div>
                                                    <p className="text-sm italic text-foreground/80 mb-2">
                                                        "Mỗi đĩa than là một báu vật âm nhạc cần được bảo vệ cẩn thận từ kho đến tay người yêu nhạc."
                                                    </p>
                                                    <footer className="text-xs text-muted-foreground font-medium">
                                                        — Triết lý Rill Vinyl Store
                                                    </footer>
                                                </blockquote>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
            </div>
        </>
    );
}
