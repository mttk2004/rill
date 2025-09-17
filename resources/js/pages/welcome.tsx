import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Music, Truck, Star, Shield, Clock, Award } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Rill - Cửa hàng Đĩa Than Online">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
                <meta name="description" content="Cửa hàng đĩa than online hàng đầu Việt Nam. Khám phá bộ sưu tập vinyl chất lượng cao từ các nghệ sĩ nổi tiếng. Giao hàng COD toàn quốc." />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-[#0a0a0a] dark:to-[#111111]">
                {/* Header */}
                <header className="relative z-10 border-b border-gray-200/50 bg-white/80 backdrop-blur-sm dark:border-gray-800/50 dark:bg-[#0a0a0a]/80">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Music className="h-8 w-8 text-[#d97706]" />
                                <span className="text-2xl font-bold text-[#1a1a1a] dark:text-white">Rill</span>
                            </div>
                            <nav className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="rounded-lg bg-[#d97706] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#b45309]"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                                        >
                                            Đăng nhập
                                        </Link>
                                        <Link
                                            href={register()}
                                            className="rounded-lg bg-[#d97706] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#b45309]"
                                        >
                                            Đăng ký
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>
                {/* Hero Section */}
                <main className="relative overflow-hidden">
                    <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pt-32">
                        <div className="mx-auto max-w-2xl text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-[#1a1a1a] sm:text-6xl dark:text-white">
                                Khám phá thế giới
                                <span className="text-[#d97706]"> vinyl </span>
                                chính hãng
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                                Cửa hàng đĩa than online hàng đầu Việt Nam. Chúng tôi mang đến cho bạn những đĩa than chất lượng cao từ các nghệ sĩ nổi tiếng thế giới.
                            </p>
                            {!auth.user && (
                                <div className="mt-10 flex items-center justify-center gap-x-4">
                                    <Link
                                        href={register()}
                                        className="rounded-lg bg-[#d97706] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#b45309] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d97706]"
                                    >
                                        Bắt đầu mua sắm
                                    </Link>
                                    <Link
                                        href={login()}
                                        className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"
                                    >
                                        Đăng nhập
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-[#1a1a1a] sm:text-4xl dark:text-white">
                                Tại sao chọn Rill?
                            </h2>
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                                Chúng tôi cam kết mang đến trải nghiệm mua sắm vinyl tốt nhất cho cộng đồng yêu nhạc Việt Nam
                            </p>
                        </div>
                        <div className="mx-auto mt-16 max-w-5xl">
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 dark:bg-[#1a1a1a] dark:border-gray-800">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#d97706]/10">
                                        <Music className="h-6 w-6 text-[#d97706]" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-[#1a1a1a] dark:text-white">
                                        Bộ sưu tập đồ sộ
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                        Hàng ngàn đĩa than từ các nghệ sĩ hàng đầu, bao gồm cả các album hiếm và phiên bản giới hạn.
                                    </p>
                                </div>
                                <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 dark:bg-[#1a1a1a] dark:border-gray-800">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#d97706]/10">
                                        <Truck className="h-6 w-6 text-[#d97706]" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-[#1a1a1a] dark:text-white">
                                        Giao hàng COD
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                        Thanh toán khi nhận hàng, giao hàng tận nơi toàn quốc. An toàn, tin cậy và tiện lợi.
                                    </p>
                                </div>
                                <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 dark:bg-[#1a1a1a] dark:border-gray-800">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#d97706]/10">
                                        <Shield className="h-6 w-6 text-[#d97706]" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-[#1a1a1a] dark:text-white">
                                        Chất lượng đảm bảo
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                        Tất cả đĩa than được kiểm tra kỹ lưỡng trước khi gửi đến khách hàng.
                                    </p>
                                </div>
                                <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 dark:bg-[#1a1a1a] dark:border-gray-800">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#d97706]/10">
                                        <Star className="h-6 w-6 text-[#d97706]" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-[#1a1a1a] dark:text-white">
                                        Đánh giá cộng đồng
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                        Hệ thống review và đánh giá từ cộng đồng người yêu nhạc giúp bạn chọn được album phù hợp.
                                    </p>
                                </div>
                                <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 dark:bg-[#1a1a1a] dark:border-gray-800">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#d97706]/10">
                                        <Clock className="h-6 w-6 text-[#d97706]" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-[#1a1a1a] dark:text-white">
                                        Hỗ trợ 24/7
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                        Đội ngũ hỗ trợ khách hàng chuyên nghiệp, sẵn sàng giải đáp mọi thắc mắc của bạn.
                                    </p>
                                </div>
                                <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 dark:bg-[#1a1a1a] dark:border-gray-800">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#d97706]/10">
                                        <Award className="h-6 w-6 text-[#d97706]" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-[#1a1a1a] dark:text-white">
                                        Uy tín hàng đầu
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                        Được tin tưởng bởi hàng ngàn khách hàng trên khắp cả nước.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-[#1a1a1a] sm:text-4xl dark:text-white">
                                Sẵn sàng bắt đầu hành trình vinyl?
                            </h2>
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                                Tham gia cộng đồng những người yêu nhạc và khám phá hàng ngàn đĩa than chất lượng cao
                            </p>
                            {!auth.user && (
                                <div className="mt-8">
                                    <Link
                                        href={register()}
                                        className="rounded-lg bg-[#d97706] px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-[#b45309] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d97706]"
                                    >
                                        Tạo tài khoản miễn phí
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-[#0a0a0a]">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Music className="h-6 w-6 text-[#d97706]" />
                                <span className="text-xl font-bold text-[#1a1a1a] dark:text-white">Rill</span>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                &copy; 2024 Rill. Tất cả các quyền được bảo lưu.
                            </div>
                        </div>
                        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-800">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Rill - Cửa hàng đĩa than online hàng đầu Việt Nam. Chúng tôi cam kết mang đến những đĩa than chất lượng cao nhất và dịch vụ khách hàng tốt nhất cho cộng đồng yêu nhạc Việt Nam.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
