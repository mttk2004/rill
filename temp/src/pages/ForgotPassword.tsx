import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Shield } from "lucide-react";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Quên mật khẩu?</CardTitle>
          <CardDescription>
            Không sao cả! Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Địa chỉ email
            </Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="your@email.com"
              className="pl-4"
            />
            <p className="text-xs text-muted-foreground">
              Nhập email bạn đã sử dụng để đăng ký tài khoản
            </p>
          </div>

          <Button className="w-full">
            Gửi hướng dẫn đặt lại
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Nhớ ra mật khẩu? </span>
            <Link to="/login" className="text-primary hover:underline">
              Đăng nhập
            </Link>
          </div>

          <div className="text-center">
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay về trang chủ
            </Link>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-sm">
            <h4 className="font-medium mb-2">💡 Lưu ý:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Email có thể mất 5-10 phút để đến hộp thư của bạn</li>
              <li>• Kiểm tra cả thư mục spam/junk mail</li>
              <li>• Link đặt lại có hiệu lực trong 24 giờ</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;