import { Link } from "@inertiajs/react";

export interface PaginationData {
  current_page: number;
  last_page: number;
  from: number | null;
  to: number | null;
  total: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
}

interface AdminPaginationProps {
  pagination: PaginationData;
  itemName?: string; // e.g., "sản phẩm", "đơn hàng", "nghệ sĩ"
}

export const AdminPagination = ({
  pagination,
  itemName = "mục"
}: AdminPaginationProps) => {
  if (pagination.last_page <= 1) {
    return null;
  }

  // Handle if links is undefined or not an array
  const links = Array.isArray(pagination.links) ? pagination.links : [];

  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="text-sm text-slate-600 dark:text-slate-400">
        Hiển thị {pagination.from} đến {pagination.to} trong tổng số{' '}
        <span className="font-medium text-slate-900 dark:text-white">
          {pagination.total}
        </span>{' '}
        {itemName}
      </div>
      <div className="flex gap-2">
        {links.map((link, idx) => {
          if (!link.url) return null;
          return (
            <Link
              key={idx}
              href={link.url}
              className={`px-3 py-1 rounded-md transition-colors ${link.active
                ? 'bg-amber-500 text-white'
                : 'bg-white/80 dark:bg-slate-800/80 hover:bg-amber-100 dark:hover:bg-slate-700'
                }`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          );
        })}
      </div>
    </div>
  );
};
