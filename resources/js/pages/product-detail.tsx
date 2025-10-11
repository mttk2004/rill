import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/navigation";
import { Heart, ShoppingCart, Star, Disc3, Calendar, Music, ArrowLeft } from "lucide-react";
import { Link, Head, usePage } from '@inertiajs/react';
import { useState } from "react";
import { Product, SharedData } from '@/types';

interface ProductDetailProps {
    product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
    const { auth } = usePage<SharedData>().props;
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const handleAddToCart = () => {
        // Logic thêm vào giỏ hàng sẽ được implement sau
        console.log(`Added ${quantity} of ${product.name} to cart`);
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
                                            {product.in_stock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
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
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="description">Mô tả chi tiết</TabsTrigger>
                                <TabsTrigger value="reviews">Đánh giá ({mockReviewCount})</TabsTrigger>
                            </TabsList>

                            <TabsContent value="description" className="mt-6">
                                <div className="prose prose-lg max-w-none">
                                    <p>{product.detailed_description || product.description}</p>
                                </div>
                            </TabsContent>

                            <TabsContent value="reviews" className="mt-6">
                                <p>Đánh giá sẽ được hiển thị ở đây.</p>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
            </div>
        </>
    );
}
