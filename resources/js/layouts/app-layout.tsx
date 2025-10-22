import { Navigation } from '@/components/navigation';
import Footer from '@/components/Footer'; // Import the new Footer component
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';
import { Toaster } from 'sonner';
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
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
            <Footer />
            <Toaster richColors position="top-right" />
        </div>
    );
}
