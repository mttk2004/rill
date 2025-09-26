import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { ProductCard } from "@/components/product-card";
import { Heart, ShoppingCart, Trash2, Share2, Disc3, Music2 } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <Navigation user={auth.user} />

        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

          {/* Floating Vinyl Records */}
          <div className="absolute top-10 left-10 animate-spin-slow">
            <Disc3 className="h-20 w-20 text-amber-500/10" />
          </div>
          <div className="absolute top-20 right-10 animate-spin-reverse">
            <Disc3 className="h-16 w-16 text-amber-500/5" />
          </div>

          <div className="relative container mx-auto px-4 py-12">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-white drop-shadow-lg flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg animate-pulse">
                    <Heart className="h-8 w-8" />
                  </div>
                  Danh sách yêu thích
                </h1>
                <p className="text-slate-200 drop-shadow">
                  {wishlistItems.length} sản phẩm • {inStockItems} còn hàng
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Chia sẻ
                </Button>
                <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Thêm tất cả vào giỏ
                </Button>
              </div>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {wishlistItems.length === 0 ? (
              <Card className="text-center py-16 border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardContent>
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 rounded-full flex items-center justify-center">
                    <Heart className="h-10 w-10 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">
                    Danh sách yêu thích trống
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
                    Thêm những sản phẩm bạn yêu thích để dễ dàng theo dõi và mua sắm
                  </p>
                  <Link href="/products">
                    <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300" size="lg">
                      Khám phá sản phẩm
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="relative group">
                    {/* Custom Wishlist Card */}
                    <Card className="group overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                      <CardContent className="p-0">
                        <div className="relative">
                          {/* Vinyl Record Display */}
                          <div className="w-full h-56 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center group-hover:from-slate-700 group-hover:to-slate-800 transition-all duration-300">
                            <div className="relative">
                              <Disc3 className="h-20 w-20 text-amber-500 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                              {/* Vinyl Label */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-lg"></div>
                              </div>
                            </div>
                          </div>

                          {/* Status Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {item.onSale && (
                              <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg">
                                Giảm giá
                              </Badge>
                            )}
                            {!item.inStock && (
                              <Badge variant="secondary" className="bg-slate-500 text-white shadow-lg">
                                Hết hàng
                              </Badge>
                            )}
                          </div>

                          {/* Remove from Wishlist */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-lg backdrop-blur-sm"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>

                          {/* Out of Stock Overlay */}
                          {!item.inStock && (
                            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-sm">
                              <div className="text-center">
                                <Badge variant="secondary" className="bg-white text-slate-900 mb-2">
                                  Hết hàng
                                </Badge>
                                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                                  Thông báo có hàng
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="p-5 space-y-4">
                          <div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-600 transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 font-medium">{item.artist}</p>
                          </div>

                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
                              {item.condition}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                              {item.format}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-amber-600">
                              {item.price.toLocaleString('vi-VN')}₫
                            </span>
                            {item.originalPrice && (
                              <span className="text-sm text-slate-500 dark:text-slate-400 line-through">
                                {item.originalPrice.toLocaleString('vi-VN')}₫
                              </span>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className={`flex-1 transition-all duration-300 ${
                                item.inStock
                                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 shadow-lg hover:shadow-xl'
                                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                              }`}
                              disabled={!item.inStock}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {item.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
                            </Button>
                          </div>

                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Đã thêm: {new Date(item.addedDate).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
