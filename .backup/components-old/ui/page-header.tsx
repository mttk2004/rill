import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  actions?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'py-6',
  md: 'py-8',
  lg: 'py-12',
};

const titleSizeClasses = {
  sm: 'text-2xl',
  md: 'text-3xl',
  lg: 'text-4xl',
};

export function PageHeader({
  title,
  subtitle,
  actions,
  className,
  size = 'md',
}: PageHeaderProps) {
  return (
    <div className={cn(
      'border-b bg-white dark:bg-slate-900',
      className
    )}>
      {/* Content */}
      <div className={cn('container mx-auto px-4', sizeClasses[size])}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            {typeof title === 'string' ? (
              <h1 className={cn(
                'font-semibold text-slate-900 dark:text-white',
                titleSizeClasses[size]
              )}>
                {title}
              </h1>
            ) : (
              title
            )}
            {subtitle && (
              typeof subtitle === 'string' ? (
                <p className="text-slate-600 dark:text-slate-400 mt-1">{subtitle}</p>
              ) : (
                subtitle
              )
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
