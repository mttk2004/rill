import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../../utils/format';

interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
  profit?: number;
}

interface RevenueChartProps {
  revenueData: RevenueData[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ revenueData }) => {
  const chartData = revenueData.map(item => {
    const date = new Date(item.date);
    const profit = item.profit || 0;
    const revenue = item.revenue || 0;
    const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
    return {
      name: date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' }),
      value: revenue,
      profit: profit,
      profitMargin: profitMargin.toFixed(2),
      fullDate: date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })
    };
  });

  return (
    <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/50 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Biểu đồ doanh thu</h3>
          <p className="text-xs text-gray-500">Dữ liệu được cập nhật thời gian thực</p>
        </div>
        {/* <button className="text-xs font-medium text-primary hover:underline bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
          Xem báo cáo chi tiết
        </button> */}
      </div>
      <div className="h-80 w-full">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <p className="text-lg font-medium mb-1">Chưa có dữ liệu</p>
              <p className="text-sm">Không có đơn hàng nào trong khoảng thời gian này</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B4D3E" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#1B4D3E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                tickFormatter={(value) => formatCurrency(value).replace(/₫/, '').trim() + 'đ'}
              />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.9)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white/90 backdrop-blur-xl rounded-xl border border-white/50 shadow-lg p-3">
                      <div className="font-semibold mb-2">{data.fullDate}</div>
                      <div className="space-y-1">
                        <div className="font-semibold text-gray-900">Doanh thu: {formatCurrency(data.value)}</div>
                        <div className="text-green-600 font-medium">Lợi nhuận: {formatCurrency(data.profit || 0)}</div>
                        <div className="text-sm text-gray-500">Tỷ suất: {data.profitMargin}%</div>
                      </div>
                    </div>
                  );
                }}
              />
              <CartesianGrid vertical={false} stroke="#f3f4f6" />
              <Area type="monotone" dataKey="value" stroke="#1B4D3E" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
