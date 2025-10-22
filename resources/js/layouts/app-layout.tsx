import { Navigation } from '@/components/navigation';
import Footer from '@/components/Footer'; // Import the new Footer component
import { type BreadcrumbItem, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode, useEffect } from 'react';
import { Toaster } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { auth, cart } = usePage<SharedData>().props;
  const { setUser } = useAuthStore();
  const { setCart } = useCartStore();

  useEffect(() => {
    setUser(auth.user);
    // Ensure cart is not null/undefined before setting
    if (cart) {
      setCart(cart);
    }
  }, [auth, cart, setUser, setCart]);


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-grow container mx-auto">
        {children}
      </main>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
}
