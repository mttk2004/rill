import { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Column<T> {
  header: string;
  accessor?: keyof T | ((row: T) => ReactNode);
  render?: (row: T) => ReactNode;
  className?: string;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  getRowKey: (row: T) => string;
  rowClassName?: (row: T) => string;
}

export function AdminTable<T>({
  data,
  columns,
  loading = false,
  emptyMessage = "Không tìm thấy dữ liệu",
  getRowKey,
  rowClassName,
}: AdminTableProps<T>) {
  const renderCell = (row: T, column: Column<T>) => {
    if (column.render) {
      return column.render(row);
    }

    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }

    if (column.accessor) {
      return String(row[column.accessor] ?? '—');
    }

    return '—';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, idx) => (
              <TableHead key={idx} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-500"></div>
                  <span className="text-slate-600 dark:text-slate-400">Đang tải...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-12">
                <div className="text-slate-500 dark:text-slate-400">
                  {emptyMessage}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow
                key={getRowKey(row)}
                className={rowClassName ? rowClassName(row) : undefined}
              >
                {columns.map((column, idx) => (
                  <TableCell key={idx} className={column.className}>
                    {renderCell(row, column)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
