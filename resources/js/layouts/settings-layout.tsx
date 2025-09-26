import { Navigation } from "@/components/navigation";
import { cn } from "@/lib/utils";
import { Link, usePage } from "@inertiajs/react";
import { User, Lock, Palette, Settings, Disc3 } from "lucide-react";
import { type PropsWithChildren } from "react";
import { type SharedData } from '@/types';

interface SettingsLayoutProps extends PropsWithChildren {
    title: string;
    description: string;
}

const settingsNavItems = [
    {
        title: "Hồ sơ",
        href: "/settings/profile",
        icon: User,
        description: "Thông tin cá nhân"
    },
    {
        title: "Mật khẩu",
        href: "/settings/password",
        icon: Lock,
        description: "Bảo mật tài khoản"
    },
    {
        title: "Giao diện",
        href: "/settings/appearance",
        icon: Palette,
        description: "Chủ đề và hiển thị"
    }
];

export default function SettingsLayout({ children, title, description }: SettingsLayoutProps) {
    const { auth } = usePage<SharedData>().props;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <Navigation user={auth.user} />

            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

                {/* Floating Vinyl Records */}
                <div className="absolute top-10 left-10 animate-spin-slow">
                    <Disc3 className="h-20 w-20 text-amber-500/10" />
                </div>
                <div className="absolute top-20 right-10 animate-spin-reverse">
                    <Disc3 className="h-16 w-16 text-amber-500/5" />
                </div>

                <div className="relative container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl font-bold text-white drop-shadow-lg flex items-center gap-3 mb-2">
                            <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                                <Settings className="h-8 w-8" />
                            </div>
                            {title}
                        </h1>
                        <p className="text-slate-200 drop-shadow text-lg">
                            {description}
                        </p>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Settings Navigation Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl rounded-xl p-6 sticky top-24">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">
                                    Cài đặt tài khoản
                                </h3>
                                <nav className="space-y-2">
                                    {settingsNavItems.map((item) => {
                                        const isActive = currentPath === item.href;
                                        const IconComponent = item.icon;

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group",
                                                    isActive
                                                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg"
                                                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                                                )}
                                            >
                                                <div className={cn(
                                                    "p-2 rounded-lg transition-all duration-300",
                                                    isActive
                                                        ? "bg-white/20"
                                                        : "bg-slate-100 dark:bg-slate-600 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/20"
                                                )}>
                                                    <IconComponent className={cn(
                                                        "h-4 w-4",
                                                        isActive
                                                            ? "text-white"
                                                            : "text-slate-500 dark:text-slate-400 group-hover:text-amber-600"
                                                    )} />
                                                </div>
                                                <div>
                                                    <div className="font-medium">
                                                        {item.title}
                                                    </div>
                                                    <div className={cn(
                                                        "text-xs",
                                                        isActive
                                                            ? "text-white/80"
                                                            : "text-slate-400 dark:text-slate-500"
                                                    )}>
                                                        {item.description}
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </nav>

                                {/* User Info Card */}
                                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-600">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                                            {auth.user?.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                                {auth.user?.name}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                {auth.user?.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl rounded-xl p-8">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
