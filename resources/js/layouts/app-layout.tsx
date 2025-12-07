import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MusicPlayer from '@/components/MusicPlayer';
import AnnouncementBar from '@/components/AnnouncementBar';
import { type ReactNode, useEffect } from 'react';
import { ShopProvider } from '@/context/ShopContext';
import { usePage } from '@inertiajs/react';
import { useToast } from '@/context/ToastContext';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { props } = usePage<{
    flash?: {
      success?: string;
      error?: string;
      info?: string;
    };
  }>();

  const { showToast } = useToast();

  // Show flash messages
  useEffect(() => {
    if (props.flash?.success) {
      showToast(props.flash.success, 'success');
    }
    if (props.flash?.error) {
      showToast(props.flash.error, 'error');
    }
    if (props.flash?.info) {
      showToast(props.flash.info, 'info');
    }
  }, [props.flash, showToast]);

  return (
    <ShopProvider>
      <div className="flex min-h-screen flex-col bg-white font-sans text-gray-900 pb-20 md:pb-0">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <MusicPlayer />
        <Footer />
      </div>
    </ShopProvider>
  );
}
