import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Home } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  primaryActionLabel?: string;
  primaryActionHref?: string;
  onPrimaryAction?: () => void;
  showHomeButton?: boolean;
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  title,
  description,
  primaryActionLabel,
  primaryActionHref,
  onPrimaryAction,
  showHomeButton = true,
  className,
  compact = false,
}: EmptyStateProps) {
  const titleSize = compact ? 'text-xl' : 'text-2xl';
  const descriptionSize = compact ? 'text-base' : 'text-base';
  const padding = compact ? 'py-12' : 'py-16';

  const PrimaryButton = primaryActionLabel && (primaryActionHref || onPrimaryAction) ? (
    primaryActionHref ? (
      <Link href={primaryActionHref}>
        <Button size="lg" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white">
          {primaryActionLabel}
        </Button>
      </Link>
    ) : (
      <Button
        size="lg"
        onClick={onPrimaryAction}
        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
      >
        {primaryActionLabel}
      </Button>
    )
  ) : null;

  return (
    <Card className={cn('border shadow-md bg-white dark:bg-slate-900', className)}>
      <CardContent className={cn('text-center', padding)}>
        <h3 className={cn(titleSize, 'font-semibold mb-3 text-slate-900 dark:text-white')}>
          {title}
        </h3>
        <p className={cn(descriptionSize, 'text-slate-600 dark:text-slate-400 mb-8')}>
          {description}
        </p>
        <div className="flex items-center justify-center gap-3">
          {PrimaryButton}
          {showHomeButton && (
            <Link href="/">
              <Button size="lg" variant="outline">
                <Home className="h-4 w-4 mr-2" />
                Trang chủ
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
