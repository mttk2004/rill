import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MusicPlayer from '@/components/MusicPlayer';
import { type ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-gray-900 pb-20 md:pb-0">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <MusicPlayer />
      <Footer />
    </div>
  );
}
