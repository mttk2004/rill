import { Head } from '@inertiajs/react';
import { Palette, Sun, Moon, Monitor, Sparkles, Eye, Camera } from 'lucide-react';

import AppearanceTabs from '@/components/appearance-tabs';
import SettingsLayout from '@/layouts/settings-layout';
import { useAppearance } from '@/hooks/use-appearance';

export default function Appearance() {
    const { appearance } = useAppearance();

    const getAppearanceIcon = () => {
        switch (appearance) {
            case 'light': return Sun;
            case 'dark': return Moon;
            case 'system': return Monitor;
            default: return Palette;
        }
    };

    const getAppearanceLabel = () => {
        switch (appearance) {
            case 'light': return 'Sáng';
            case 'dark': return 'Tối';
            case 'system': return 'Theo hệ thống';
            default: return 'Tự động';
        }
    };

    const AppearanceIcon = getAppearanceIcon();

    return (
        <SettingsLayout
            title="Cài đặt giao diện"
            description="Tùy chỉnh giao diện và chủ đề phù hợp với sở thích của bạn"
        >
            <Head title="Cài đặt giao diện - Rill" />

            <div className="space-y-8">
                {/* Current Theme Header */}
                <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 rounded-xl border border-purple-200 dark:border-purple-800">
                    <div className="relative">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full">
                            <AppearanceIcon className="h-8 w-8 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                            <Eye className="h-3 w-3 text-white" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100">
                            Chủ đề hiện tại: {getAppearanceLabel()}
                        </h3>
                        <p className="text-purple-700 dark:text-purple-300 flex items-center gap-2 mt-1">
                            <Sparkles className="h-4 w-4" />
                            Giao diện được tối ưu cho trải nghiệm retro-modern
                        </p>
                    </div>
                </div>

                {/* Theme Selection Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                            <Palette className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                            Chọn chủ đề
                        </h4>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 p-6">
                        <div className="flex flex-col items-center gap-6">
                            <div className="text-center">
                                <h5 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                    Lựa chọn chủ đề yêu thích
                                </h5>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">
                                    Chọn chủ đề phù hợp với thời gian sử dụng và sở thích của bạn
                                </p>
                            </div>

                            {/* Enhanced AppearanceTabs */}
                            <div className="flex flex-col items-center gap-4">
                                <AppearanceTabs className="scale-110" />
                                <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                                    💡 Chủ đề "Theo hệ thống" sẽ tự động thay đổi theo cài đặt thiết bị
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Theme Previews */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                            <Camera className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                            Xem trước chủ đề
                        </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Light Theme Preview */}
                        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <Sun className="h-4 w-4 text-yellow-600" />
                                </div>
                                <h5 className="font-semibold text-slate-900">Chủ đề sáng</h5>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 bg-amber-500 rounded"></div>
                                <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                                <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                            </div>
                            <p className="text-xs text-slate-600 mt-3">
                                Giao diện sáng, dễ nhìn ban ngày
                            </p>
                        </div>

                        {/* Dark Theme Preview */}
                        <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-slate-700 rounded-lg">
                                    <Moon className="h-4 w-4 text-blue-400" />
                                </div>
                                <h5 className="font-semibold text-white">Chủ đề tối</h5>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 bg-amber-500 rounded"></div>
                                <div className="h-2 bg-slate-600 rounded w-3/4"></div>
                                <div className="h-2 bg-slate-600 rounded w-1/2"></div>
                            </div>
                            <p className="text-xs text-slate-400 mt-3">
                                Giao diện tối, bảo vệ mắt ban đêm
                            </p>
                        </div>

                        {/* System Theme Preview */}
                        <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-800 rounded-xl border border-slate-300 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-gradient-to-br from-slate-200 to-slate-600 rounded-lg">
                                    <Monitor className="h-4 w-4 text-slate-700" />
                                </div>
                                <h5 className="font-semibold bg-gradient-to-r from-slate-900 to-white bg-clip-text text-transparent">
                                    Theo hệ thống
                                </h5>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 bg-gradient-to-r from-amber-500 to-amber-400 rounded"></div>
                                <div className="h-2 bg-gradient-to-r from-slate-200 to-slate-600 rounded w-3/4"></div>
                                <div className="h-2 bg-gradient-to-r from-slate-200 to-slate-600 rounded w-1/2"></div>
                            </div>
                            <p className="text-xs text-slate-600 mt-3">
                                Tự động theo cài đặt thiết bị
                            </p>
                        </div>
                    </div>
                </div>

                {/* Theme Benefits */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                            Ưu điểm của từng chủ đề
                        </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-sm font-medium mb-2">
                                <Sun className="h-4 w-4" />
                                Chủ đề sáng
                            </div>
                            <ul className="text-blue-600 dark:text-blue-400 text-sm space-y-1">
                                <li>• Dễ đọc trong môi trường sáng</li>
                                <li>• Phù hợp làm việc ban ngày</li>
                                <li>• Giúp tập trung tốt hơn</li>
                                <li>• Tiết kiệm pin màn hình OLED</li>
                            </ul>
                        </div>

                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-2">
                                <Moon className="h-4 w-4" />
                                Chủ đề tối
                            </div>
                            <ul className="text-indigo-600 dark:text-indigo-400 text-sm space-y-1">
                                <li>• Giảm căng thẳng mắt ban đêm</li>
                                <li>• Tiết kiệm pin thiết bị</li>
                                <li>• Tạo cảm giác thời thượng</li>
                                <li>• Phù hợp làm việc khuya</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </SettingsLayout>
    );
}
