import { Package, CheckCircle, AlertTriangle, TrendingUp, Star } from "lucide-react";
import { AdminStatsCards, StatCardData } from "@/components/admin/common/admin-stats-cards";

interface ProductStatsCardsProps {
  stats: {
    total: number;
    active: number;
    out_of_stock: number;
    low_stock: number;
    featured: number;
  };
}

export const ProductStatsCardsRefactored = ({ stats }: ProductStatsCardsProps) => {
  const statsCards: StatCardData[] = [
    {
      title: "Tổng sản phẩm",
      value: stats.total,
      icon: Package,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Đang bán",
      value: stats.active,
      subtitle: `${((stats.active / stats.total) * 100).toFixed(1)}% tổng số`,
      icon: CheckCircle,
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Hết hàng",
      value: stats.out_of_stock,
      subtitle: `${((stats.out_of_stock / stats.total) * 100).toFixed(1)}% tổng số`,
      icon: AlertTriangle,
      gradient: "from-red-500 to-red-600",
    },
    {
      title: "Sắp hết hàng",
      value: stats.low_stock,
      subtitle: `${((stats.low_stock / stats.total) * 100).toFixed(1)}% tổng số`,
      icon: TrendingUp,
      gradient: "from-amber-500 to-amber-600",
    },
    {
      title: "Nổi bật",
      value: stats.featured,
      subtitle: `${((stats.featured / stats.total) * 100).toFixed(1)}% tổng số`,
      icon: Star,
      gradient: "from-purple-500 to-purple-600",
    },
  ];

  return <AdminStatsCards stats={statsCards} />;
};
