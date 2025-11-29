import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { FormEvent } from "react";

interface ProductsSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export function ProductsSearchBar({ searchTerm, onSearchChange, onSubmit }: ProductsSearchBarProps) {
  return (
    <form onSubmit={onSubmit} className="w-full md:w-auto md:flex-1">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Tìm kiếm
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
          <Input
            placeholder="Tìm kiếm theo tên sản phẩm..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
    </form>
  );
}
