import React, { useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Music } from 'lucide-react';
import { formatCurrency } from '../../../utils/format';

const CHART_COLORS = ['#1B4D3E', '#d4af37', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

interface GenreData {
  name: string;
  value: number;
  profit: number;
  profit_margin: number;
  [key: string]: string | number;
}

interface GenreChartProps {
  genreData: GenreData[];
}

const GenreChart: React.FC<GenreChartProps> = ({ genreData }) => {
  const [genreMetric, setGenreMetric] = useState<'revenue' | 'profit'>('revenue');

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-6 flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Music size={20} className="text-blue-500" /> {genreMetric === 'revenue' ? 'Doanh thu' : 'Lợi nhuận'} theo thể loại
        </h3>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setGenreMetric('revenue')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${genreMetric === 'revenue'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Doanh thu
          </button>
          <button
            onClick={() => setGenreMetric('profit')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${genreMetric === 'profit'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Lợi nhuận
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-[250px] relative">
        {genreData.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <p className="text-lg font-medium mb-1">Chưa có dữ liệu</p>
              <p className="text-sm">Không có doanh thu theo thể loại trong khoảng thời gian này</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genreData}
                cx="45%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={5}
                dataKey={genreMetric === 'revenue' ? 'value' : 'profit'}
              >
                {genreData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="rgba(255,255,255,0.8)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label: string) => {
                  const entry = genreData.find(g => g.name === label);
                  return entry ? `${label} (${entry.profit_margin}% lợi nhuận)` : label;
                }}
                contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.9)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', paddingLeft: '10px', maxWidth: '35%' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default GenreChart;
