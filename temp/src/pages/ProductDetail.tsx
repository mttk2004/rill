import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";
import { Heart, ShoppingCart, Star, ArrowLeft, Disc, Calendar, Music } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import vinylProduct from "@/assets/vinyl-product.jpg";

// Mock data - trong thực tế sẽ fetch từ API
const productData = {
  "FL-RUM-001": {
    id: 1,
    title: "Rumours",
    artist: "Fleetwood Mac",
    price: 490000,
    originalPrice: 590000,
    image: vinylProduct,
    sku: "FL-RUM-001",
    stock: 5,
    genre: "Rock",
    label: "Warner Bros Records",
    releaseYear: "1977",
    format: "12\" LP, 33 RPM",
    condition: "New & Sealed",
    description: "Rumours là album phòng thu thứ mười một của ban nhạc rock Anh-Mỹ Fleetwood Mac, phát hành vào ngày 4 tháng 2 năm 1977 bởi Warner Bros. Records.",
    detailedDescription: `
      <p>Rumours được ghi âm trong bối cảnh những biến động cá nhân và các mối quan hệ căng thẳng trong ban nhạc. Mặc dù vậy, album đã trở thành một trong những album bán chạy nhất mọi thời đại.</p>
      
      <h3>Đặc điểm nổi bật:</h3>
      <ul>
        <li>Album bán chạy thứ 8 mọi thời đại với hơn 40 triệu bản trên toàn thế giới</li>
        <li>Giành giải Grammy Award for Album of the Year năm 1978</li>
        <li>Được xếp hạng #25 trong danh sách "500 Greatest Albums of All Time" của Rolling Stone</li>
        <li>Chứa các hit như "Go Your Own Way", "Don't Stop", "Dreams"</li>
      </ul>
      
      <h3>Tracklist:</h3>
      <ol>
        <li>Second Hand News</li>
        <li>Dreams</li>
        <li>Never Going Back Again</li>
        <li>Don't Stop</li>
        <li>Go Your Own Way</li>
        <li>Songbird</li>
        <li>The Chain</li>
        <li>You Make Loving Fun</li>
        <li>I Don't Want to Know</li>
        <li>Oh Daddy</li>
        <li>Gold Dust Woman</li>
      </ol>
    `,
    rating: 4.8,
    reviewCount: 156,
    reviews: [
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
        comment: "Album kinh điển, nhưng giá hơi cao so với thị trường. Tuy nhiên chất lượng đĩa rất tốt."
      }
    ],
    relatedProducts: [
      {
        id: 2,
        title: "Hotel California",
        artist: "Eagles",
        price: 420000,
        image: vinylProduct,
        sku: "EG-HOT-001"
      },
      {
        id: 3,
        title: "The Wall",
        artist: "Pink Floyd",
        price: 680000,
        image: vinylProduct,
        sku: "PF-WAL-001"
      }
    ]
  }
};

const ProductDetail = () => {
  const { slug } = useParams();
  const product = productData[slug as keyof typeof productData];
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
            <Link to="/products">
              <Button>Quay lại danh sách sản phẩm</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Logic thêm vào giỏ hàng
    console.log(`Added ${quantity} of ${product.title} to cart`);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              Trang chủ
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/products" className="text-muted-foreground hover:text-foreground">
              Sản phẩm
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{product.title}</span>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 mb-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg border">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Thumbnail images would go here in a real implementation */}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{product.genre}</Badge>
                  <Badge variant="outline">{product.condition}</Badge>
                </div>
                
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {product.title}
                </h1>
                
                <Link to={`/artists/${product.artist.toLowerCase().replace(' ', '-')}`}>
                  <p className="text-xl text-accent hover:underline mb-4">
                    {product.artist}
                  </p>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) 
                            ? 'fill-accent text-accent' 
                            : 'text-muted-foreground'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviewCount} đánh giá)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-accent">
                    {product.price.toLocaleString('vi-VN')}₫
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      {product.originalPrice.toLocaleString('vi-VN')}₫
                    </span>
                  )}
                </div>
                {product.originalPrice && (
                  <p className="text-sm text-green-600">
                    Tiết kiệm {(product.originalPrice - product.price).toLocaleString('vi-VN')}₫
                  </p>
                )}
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Disc className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Format:</span> {product.format}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Năm:</span> {product.releaseYear}
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
                    <span className="text-muted-foreground">SKU:</span> {product.sku}
                  </span>
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm">
                  {product.stock > 0 
                    ? `Còn ${product.stock} sản phẩm` 
                    : 'Hết hàng'
                  }
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
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    className="flex-1" 
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Thêm vào giỏ hàng
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
              <div>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description" className="mb-12">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Mô tả chi tiết</TabsTrigger>
              <TabsTrigger value="reviews">Đánh giá ({product.reviewCount})</TabsTrigger>
              <TabsTrigger value="shipping">Vận chuyển</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.detailedDescription }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Đánh giá từ khách hàng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{product.rating}</div>
                        <div className="flex justify-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating) 
                                  ? 'fill-accent text-accent' 
                                  : 'text-muted-foreground'
                              }`} 
                            />
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {product.reviewCount} đánh giá
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {product.reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{review.user}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-3 w-3 ${
                                    i < review.rating 
                                      ? 'fill-accent text-accent' 
                                      : 'text-muted-foreground'
                                  }`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.date).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Miễn phí vận chuyển</h3>
                      <p className="text-muted-foreground">
                        Miễn phí giao hàng cho tất cả đơn hàng tại TP.HCM và các tỉnh thành lân cận.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Thời gian giao hàng</h3>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• TP.HCM: 1-2 ngày làm việc</li>
                        <li>• Các tỉnh thành khác: 3-5 ngày làm việc</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Đóng gói</h3>
                      <p className="text-muted-foreground">
                        Tất cả đĩa than được đóng gói cẩn thận với vật liệu chống sốc để đảm bảo chất lượng.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Related Products */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {product.relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="group hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <Link to={`/products/${relatedProduct.sku}`}>
                      <div className="aspect-square overflow-hidden rounded-md mb-3">
                        <img 
                          src={relatedProduct.image} 
                          alt={relatedProduct.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="font-semibold mb-1 group-hover:text-accent transition-colors">
                        {relatedProduct.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {relatedProduct.artist}
                      </p>
                      <p className="font-bold text-accent">
                        {relatedProduct.price.toLocaleString('vi-VN')}₫
                      </p>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;