import React from 'react';
import { DollarSign, ShoppingBag, Users } from 'lucide-react';
import StatCard from '../StatCard';
import { formatCurrency } from '../../../utils/format';

interface StatsGridProps {
  revenue: number;
  totalProfit: number;
  newOrders: number;
  customers: number;
}

const StatsGrid: React.FC<StatsGridProps> = ({ revenue, totalProfit, newOrders, customers }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Tổng Doanh Thu"
        value={formatCurrency(revenue)}
        icon={DollarSign}
        color="bg-emerald-600"
      />
      <StatCard
        title="Tổng Lợi Nhuận"
        value={formatCurrency(totalProfit)}
        icon={DollarSign}
        color="bg-green-600"
      />
      <StatCard
        title="Tổng Số Đơn Hàng"
        value={newOrders}
        icon={ShoppingBag}
        color="bg-blue-600"
      />
      <StatCard
        title="Tổng Số Khách Hàng"
        value={customers}
        icon={Users}
        color="bg-amber-500"
      />
    </div>
  );
};

export default StatsGrid;
