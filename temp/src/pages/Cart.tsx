import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { Minus, Plus, Trash2, ShoppingCart, Heart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import vinylProduct from "@/assets/vinyl-product.jpg";

const cartItems = [
  {
    id: 1,
    title: "The Dark Side of the Moon",
    artist: "Pink Floyd",
    price: 450000,
    quantity: 1,
    image: vinylProduct,
    condition: "Mint",
    format: "LP"
  },
  {
    id: 2,
    title: "Abbey Road",
    artist: "The Beatles", 
    price: 520000,
    quantity: 2,
    image: vinylProduct,
    condition: "Near Mint",
    format: "LP"
  },
  {
    id: 3,
    title: "Thriller",
    artist: "Michael Jackson",
    price: 380000,
    quantity: 1,
    image: vinylProduct,
    condition: "Very Good+",
    format: "LP"
  }
];

const Cart = () => {
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 50000;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/products">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Tiếp tục mua sắm
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <ShoppingCart className="h-8 w-8" />
                Giỏ hàng
              </h1>
              <p className="text-muted-foreground">{cartItems.length} sản phẩm</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-foreground truncate">
                              {item.title}
                            </h3>
                            <p className="text-muted-foreground">{item.artist}</p>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline">{item.condition}</Badge>
                              <Badge variant="outline">{item.format}</Badge>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <Button variant="outline" size="sm">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-lg font-semibold text-foreground">
                              {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-sm text-muted-foreground">
                                {item.price.toLocaleString('vi-VN')}₫ / cái
                              </p>
                            )}
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-muted-foreground hover:text-destructive ml-4"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tóm tắt đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Tạm tính ({cartItems.length} sản phẩm)</span>
                    <span>{subtotal.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển</span>
                    <span>{shipping.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Tổng cộng</span>
                    <span>{total.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <Button className="w-full" size="lg">
                    Tiến hành thanh toán
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mã giảm giá</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input placeholder="Nhập mã giảm giá" />
                    <Button variant="outline">Áp dụng</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thông tin vận chuyển</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    🚚 Miễn phí vận chuyển cho đơn hàng trên 1.000.000₫
                  </p>
                  <p className="text-sm text-muted-foreground">
                    📦 Giao hàng trong 3-5 ngày làm việc
                  </p>
                  <p className="text-sm text-muted-foreground">
                    🔄 Đổi trả miễn phí trong 30 ngày
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;