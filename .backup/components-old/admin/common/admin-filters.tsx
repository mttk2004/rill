import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export interface FilterField {
  name: string;
  label: string;
  type: 'search' | 'select';
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

interface AdminFiltersProps {
  fields: FilterField[];
  className?: string;
}

export const AdminFilters = ({ fields, className = "" }: AdminFiltersProps) => {
  const renderField = (field: FilterField) => {
    switch (field.type) {
      case 'search':
        return (
          <div className={`space-y-2 ${field.className || ''}`}>
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {field.label}
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder={field.placeholder || `Tìm kiếm ${field.label.toLowerCase()}...`}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="pl-10 border-slate-200 focus:border-amber-500 focus:ring-amber-500/20"
              />
            </div>
          </div>
        );

      case 'select':
        return (
          <div className={`space-y-2 ${field.className || ''}`}>
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {field.label}
            </Label>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="border-slate-200">
                <SelectValue placeholder={field.placeholder || `Chọn ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={`mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl ${className}`}>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {fields.map((field) => (
            <div key={field.name}>
              {renderField(field)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
