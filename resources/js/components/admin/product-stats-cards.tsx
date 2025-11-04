import { Card, CardContent } from "@/components/ui/card";
import { Package, CheckCircle, AlertTriangle, TrendingUp, Star } from "lucide-react";

interface ProductStatsCardsProps {
  stats: {
    total: number;
    active: number;
    out_of_stock: number;
    low_stock: number;
    featured: number;
  };
}

export const ProductStatsCards = ({ stats }: ProductStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
      <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100 mb-1">
                Tổng sản phẩm
              </p>
              <p className="text-4xl font-bold text-white">
                {stats.total.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
              <Package className="h-8 w-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-100 mb-1">
                Đang bán
              </p>
              <p className="text-4xl font-bold text-white">
                {stats.active.toLocaleString()}
              </p>
              <p className="text-xs text-green-100 mt-1">
                {((stats.active / stats.total) * 100).toFixed(1)}% tổng số
              </p>
            </div>
            <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden bg-gradient-to-br from-red-500 to-red-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-100 mb-1">
                Hết hàng
              </p>
              <p className="text-4xl font-bold text-white">
                {stats.out_of_stock.toLocaleString()}
              </p>
              <p className="text-xs text-red-100 mt-1">
                {((stats.out_of_stock / stats.total) * 100).toFixed(1)}% tổng số
              </p>
            </div>
            <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-amber-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-100 mb-1">
                Sắp hết hàng
              </p>
              <p className="text-4xl font-bold text-white">
                {stats.low_stock.toLocaleString()}
              </p>
              <p className="text-xs text-amber-100 mt-1">
                {((stats.low_stock / stats.total) * 100).toFixed(1)}% tổng số
              </p>
            </div>
            <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-100 mb-1">
                Nổi bật
              </p>
              <p className="text-4xl font-bold text-white">
                {stats.featured.toLocaleString()}
              </p>
              <p className="text-xs text-purple-100 mt-1">
                {((stats.featured / stats.total) * 100).toFixed(1)}% tổng số
              </p>
            </div>
            <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
              <Star className="h-8 w-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
