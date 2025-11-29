import { Navigation } from '@/components/navigation';
import Footer from '@/components/Footer'; // Import the new Footer component
import { MarketingBanner } from '@/components/marketing-banner';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';
import { type SharedData } from '@/types';

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { auth } = usePage<SharedData>().props;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation user={auth.user} />
      <MarketingBanner />
      <main className="flex-grow container mx-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
}
