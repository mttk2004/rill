import { Navigation } from '@/components/navigation';
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
        <div className="min-h-screen bg-background">
            <Navigation user={auth.user} />
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
