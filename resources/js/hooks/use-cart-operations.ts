import { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';

export function useCartOperations() {
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(cartItemId);
      return;
    }

    setIsUpdating(cartItemId);

    router.put(`/cart/${cartItemId}`, { quantity: newQuantity }, {
      preserveScroll: true,
      preserveState: true,
      onFinish: () => {
        setIsUpdating(null);
      },
      onSuccess: () => {
        toast.success('Đã cập nhật số lượng!');
        router.reload();
      },
      onError: (errors) => {
        const errorMessage = errors.message || Object.values(errors)[0] || 'Không thể cập nhật số lượng';
        toast.error(typeof errorMessage === 'string' ? errorMessage : 'Có lỗi xảy ra khi cập nhật số lượng');
      }
    });
  };

  const removeItem = async (cartItemId: number, skipConfirm: boolean = false) => {
    if (!skipConfirm && !confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      return;
    }

    setIsUpdating(cartItemId);

    router.delete(`/cart/${cartItemId}`, {
      preserveScroll: true,
      preserveState: true,
      onFinish: () => {
        setIsUpdating(null);
      },
      onSuccess: () => {
        toast.success('Đã xóa sản phẩm!');
        router.reload();
      },
      onError: (errors) => {
        const errorMessage = errors.message || Object.values(errors)[0] || 'Không thể xóa sản phẩm';
        toast.error(typeof errorMessage === 'string' ? errorMessage : 'Có lỗi xảy ra khi xóa sản phẩm');
      }
    });
  };

  return {
    isUpdating,
    updateQuantity,
    removeItem,
  };
}
