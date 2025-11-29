import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { useRef, FormEvent } from 'react';

export default function DeleteUser() {
  const passwordInput = useRef<HTMLInputElement>(null);
  const { data, setData, delete: destroy, processing, errors, reset } = useForm({
    password: '',
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    destroy('/settings/profile', {
      preserveScroll: true,
      onError: () => passwordInput.current?.focus(),
      onSuccess: () => reset(),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3
          className="text-xl font-bold text-red-600 dark:text-red-400 mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Xóa tài khoản
        </h3>
        <p
          className="text-red-500 dark:text-red-300"
          style={{ fontFamily: "'Crimson Text', serif" }}
        >
          Xóa tài khoản và tất cả dữ liệu của bạn
        </p>
      </div>
      <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
        <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
          <p className="font-medium">Cảnh báo</p>
          <p className="text-sm">Vui lòng thận trọng, hành động này không thể hoàn tác.</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" data-test="delete-user-button">Xóa tài khoản</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Bạn có chắc chắn muốn xóa tài khoản?</DialogTitle>
            <DialogDescription>
              Khi tài khoản được xóa, tất cả dữ liệu và thông tin sẽ bị xóa vĩnh viễn. Vui lòng nhập mật khẩu để xác nhận bạn muốn xóa tài khoản vĩnh viễn.
            </DialogDescription>

            <form onSubmit={submit} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="password" className="sr-only">
                  Mật khẩu
                </Label>

                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  ref={passwordInput}
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                />

                <InputError message={errors.password} />
              </div>

              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button variant="secondary" type="button" onClick={() => reset()}>
                    Hủy
                  </Button>
                </DialogClose>

                <Button variant="destructive" disabled={processing} type="submit" data-test="confirm-delete-user-button">
                  {processing ? 'Đang xóa...' : 'Xóa tài khoản'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
