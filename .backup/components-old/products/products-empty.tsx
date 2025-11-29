import { EmptyState } from "@/components/ui/empty-state";
import { router } from "@inertiajs/react";

export function ProductsEmpty() {
  return (
    <EmptyState
      title="Không tìm thấy sản phẩm"
      description="Không có sản phẩm nào khớp với bộ lọc hiện tại."
      primaryActionLabel="Xem tất cả sản phẩm"
      onPrimaryAction={() => router.get('/products')}
    />
  );
}
