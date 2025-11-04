import { useState } from "react";
import { Link } from "@inertiajs/react";
import { useCategoryMenu } from "@/hooks/use-category-menu";
import { ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type MenuSection = "genres" | "labels";

export const ProductsFlyoutMenu = () => {
  const { data, loading } = useCategoryMenu();
  const [activeSection, setActiveSection] = useState<MenuSection>("genres");

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const sections = [
    { key: "genres" as MenuSection, label: "Danh mục", items: data.genres },
    { key: "labels" as MenuSection, label: "Hãng đĩa", items: data.labels },
  ];

  const activeItems = data[activeSection] || [];

  return (
    <div className="flex w-[900px] max-h-[500px] bg-popover">
      {/* Left sidebar */}
      <div className="w-48 border-r bg-slate-50/80 dark:bg-slate-900/80 py-2">
        {sections.map((section) => (
          <button
            key={section.key}
            onMouseEnter={() => setActiveSection(section.key)}
            className={cn(
              "w-full px-4 py-3 text-left text-sm font-medium transition-all flex items-center justify-between group",
              activeSection === section.key
                ? "bg-background text-amber-600 dark:text-amber-500 border-r-2 border-amber-500"
                : "text-slate-700 dark:text-slate-300 hover:bg-background/50 hover:text-amber-600 dark:hover:text-amber-500"
            )}
          >
            <span>{section.label}</span>
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-all",
                activeSection === section.key
                  ? "text-amber-500 translate-x-1"
                  : "text-slate-400 group-hover:text-amber-500 group-hover:translate-x-0.5"
              )}
            />
          </button>
        ))}
      </div>

      {/* Right content - 4 column grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          {sections.find((s) => s.key === activeSection)?.label}
        </h3>
        <div className="grid grid-cols-4 gap-x-4 gap-y-3">
          {activeItems.map((item) => (
            <Link
              key={item.slug}
              href={`/products?${activeSection === "genres" ? "genre" : "label"}=${item.name}`}
              className="group block"
            >
              <div className="py-2 px-3 rounded-md transition-all hover:bg-accent">
                <div className="font-medium text-sm text-foreground group-hover:text-white dark:group-hover:text-white transition-colors truncate">
                  {item.name}
                </div>
                {item.count > 0 && (
                  <div className="text-xs text-gray-500 group-hover:text-gray-200 mt-1">
                    {item.count} sản phẩm
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {activeItems.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-12">
            Chưa có dữ liệu
          </div>
        )}
      </div>
    </div>
  );
};
