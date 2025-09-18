import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cài đặt giao diện',
        href: editAppearance().url,
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cài đặt giao diện - Rill">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800;900&family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet" />
            </Head>

            <SettingsLayout>
                <div className="space-y-6">
                    <div>
                        <h2 
                            className="text-2xl font-bold text-vintage-primary dark:text-white mb-2"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Cài đặt giao diện
                        </h2>
                        <p 
                            className="text-vintage-tertiary dark:text-vintage-tertiary"
                            style={{ fontFamily: "'Crimson Text', serif" }}
                        >
                            Tùy chỉnh giao diện và chủ đề của tài khoản
                        </p>
                    </div>
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
