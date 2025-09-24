import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { Heart, ShoppingCart, Trash2, Share2, Disc3 } from "lucide-react";
import { Link, Head, usePage } from "@inertiajs/react";
import { type SharedData } from '@/types';

const wishlistItems = [
  {
    id: 1,
    title: "Rumours",
    artist: "Fleetwood Mac",
    price: 490000,
    image: "/placeholder-vinyl.jpg",
    condition: "Near Mint",
    format: "LP",
    inStock: true,
    addedDate: "2024-01-15"
  },
  {
    id: 2,
    title: "Hotel California",
    artist: "Eagles",
    price: 420000,
    originalPrice: 480000,
    image: "/placeholder-vinyl.jpg",
    condition: "Mint",
    format: "LP",
    inStock: true,
    addedDate: "2024-01-10",
    onSale: true
  },
  {
    id: 3,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    price: 550000,
    image: "/placeholder-vinyl.jpg",
    condition: "Very Good+",
    format: "LP",
    inStock: false,
    addedDate: "2024-01-08"
  },
  {
    id: 4,
    title: "Back in Black",
    artist: "AC/DC",
    price: 400000,
    image: "/placeholder-vinyl.jpg",
    condition: "Near Mint",
    format: "LP",
    inStock: true,
    addedDate: "2024-01-05"
  },
  {
    id: 5,
    title: "The Wall",
    artist: "Pink Floyd",
    price: 680000,
    image: "/placeholder-vinyl.jpg",
    condition: "Mint",
    format: "2LP",
    inStock: true,
    addedDate: "2024-01-02"
  },
  {
    id: 6,
    title: "Led Zeppelin IV",
    artist: "Led Zeppelin",
    price: 460000,
    image: "/placeholder-vinyl.jpg",
    condition: "Very Good+",
    format: "LP",
    inStock: true,
    addedDate: "2023-12-28"
  }
];

export default function Wishlist() {
  const { auth } = usePage<SharedData>().props;
  const inStockItems = wishlistItems.filter(item => item.inStock).length;

  return (
    <>
      <Head title="Danh sách yêu thích - Rill" />
      <div className="min-h-screen bg-background">
        <Navigation user={auth.user} />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                  <Heart className="h-8 w-8 text-primary" />
                  Danh sách yêu thích
                </h1>
                <p className="text-muted-foreground">
                  {wishlistItems.length} sản phẩm • {inStockItems} còn hàng
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Chia sẻ
                </Button>
                <Button>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Thêm tất cả vào giỏ
                </Button>
              </div>
            </div>

            {wishlistItems.length === 0 ? (
              <Card className="text-center py-12 border-0 shadow-vinyl">
                <CardContent>
                  <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Danh sách yêu thích trống
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Thêm những sản phẩm bạn yêu thích để dễ dàng theo dõi và mua sắm
                  </p>
                  <Link href="/products">
                    <Button>
                      Khám phá sản phẩm
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((item) => (
                  <Card key={item.id} className="group overflow-hidden border-0 shadow-vinyl">
                    <CardContent className="p-0">
                      <div className="relative">
                        <div className="w-full h-48 bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors duration-300">
                          <Disc3 className="h-16 w-16 text-muted-foreground/30 group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        {item.onSale && (
                          <Badge className="absolute top-2 left-2 bg-destructive">
                            Giảm giá
                          </Badge>
                        )}
                        {!item.inStock && (
                          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                            <Badge variant="secondary">Hết hàng</Badge>
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 text-primary hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-semibold text-foreground line-clamp-1">
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{item.artist}</p>
                        </div>

                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {item.condition}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.format}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-foreground">
                            {item.price.toLocaleString('vi-VN')}₫
                          </span>
                          {item.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {item.originalPrice.toLocaleString('vi-VN')}₫
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1"
                            disabled={!item.inStock}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {item.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
                          </Button>
                          {!item.inStock && (
                            <Button variant="outline" size="sm">
                              Thông báo có hàng
                            </Button>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground">
                          Đã thêm: {new Date(item.addedDate).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
