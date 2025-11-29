import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

export interface StatCardData {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  gradient: string; // e.g., "from-blue-500 to-blue-600"
  iconColor?: string; // default: "text-white"
}

interface AdminStatsCardsProps {
  stats: StatCardData[];
  cols?: {
    default?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export const AdminStatsCards = ({
  stats,
  cols = { default: 1, md: 2, xl: 5 }
}: AdminStatsCardsProps) => {
  const gridCols = `grid-cols-${cols.default || 1} ${cols.md ? `md:grid-cols-${cols.md}` : ''} ${cols.lg ? `lg:grid-cols-${cols.lg}` : ''} ${cols.xl ? `xl:grid-cols-${cols.xl}` : ''}`;

  return (
    <div className={`grid ${gridCols} gap-6 mb-8`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90 mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    {stat.title}
                  </p>
                  <p className="text-4xl font-bold text-white">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                  {stat.subtitle && (
                    <p className="text-xs mt-1 opacity-80" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      {stat.subtitle}
                    </p>
                  )}
                </div>
                <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Icon className={`h-8 w-8 ${stat.iconColor || 'text-white'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
