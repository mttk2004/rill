import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Navigation } from '@/components/navigation';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user?.role === 'admin';

    // Use Navigation for customer users, simple header for admin
    if (!isAdmin) {
        return <Navigation user={auth.user} />;
    }

    // Default simple header for admin
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
        </header>
    );
}
