import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navigation } from "@/components/Navigation";
import { Palette, Monitor, Moon, Sun, Globe, Volume2 } from "lucide-react";

const Appearance = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Giao diện & Hiển thị</h1>
            <p className="text-muted-foreground mt-2">
              Tùy chỉnh giao diện và trải nghiệm người dùng
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Chế độ màu sắc
              </CardTitle>
              <CardDescription>
                Chọn chế độ hiển thị phù hợp với sở thích của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="cursor-pointer rounded-lg border-2 border-primary p-4 text-center">
                  <Sun className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">Sáng</p>
                </div>
                <div className="cursor-pointer rounded-lg border-2 border-muted p-4 text-center">
                  <Moon className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">Tối</p>
                </div>
                <div className="cursor-pointer rounded-lg border-2 border-muted p-4 text-center">
                  <Monitor className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">Hệ thống</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Ngôn ngữ & Khu vực
              </CardTitle>
              <CardDescription>
                Thiết lập ngôn ngữ và định dạng hiển thị
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Ngôn ngữ hiển thị</Label>
                <Select defaultValue="vi">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                    <SelectItem value="ko">한국어</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Khu vực</Label>
                <Select defaultValue="vn">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vn">Việt Nam</SelectItem>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="jp">Japan</SelectItem>
                    <SelectItem value="kr">South Korea</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Đơn vị tiền tệ</Label>
                <Select defaultValue="vnd">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vnd">VND (₫)</SelectItem>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="jpy">JPY (¥)</SelectItem>
                    <SelectItem value="krw">KRW (₩)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Âm thanh & Thông báo
              </CardTitle>
              <CardDescription>
                Quản lý âm thanh và thông báo của ứng dụng
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Âm thanh giao diện</Label>
                  <p className="text-sm text-muted-foreground">
                    Phát âm thanh khi tương tác với giao diện
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thông báo trình duyệt</Label>
                  <p className="text-sm text-muted-foreground">
                    Hiển thị thông báo đẩy từ trình duyệt
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thông báo email</Label>
                  <p className="text-sm text-muted-foreground">
                    Nhận thông báo qua email về đơn hàng và khuyến mãi
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button className="flex-1">Lưu cài đặt</Button>
            <Button variant="outline">Khôi phục mặc định</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Appearance;