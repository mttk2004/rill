import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import { router } from "@inertiajs/react";

export function ProductsEmpty() {
  return (
    <Card className="text-center py-16 border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardContent>
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center">
          <Music className="h-10 w-10 text-slate-500" />
        </div>
        <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">
          Không tìm thấy sản phẩm
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
          Không có sản phẩm nào khớp với bộ lọc hiện tại.
        </p>
        <Button onClick={() => router.get('/products')}>
          Xem tất cả sản phẩm
        </Button>
      </CardContent>
    </Card>
  );
}
