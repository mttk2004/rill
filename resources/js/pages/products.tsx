import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Music, Search, Filter, Heart, Star } from 'lucide-react';

export default function Products() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Sản phẩm - Rill">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800;900&family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet" />
                <meta name="description" content="Khám phá bộ sưu tập đĩa than chất lượng cao tại Rill. Tìm kiếm các album yêu thích từ các nghệ sĩ nổi tiếng thế giới." />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-vintage-amber-50/30 via-white to-vintage-orange-50/40 dark:from-background-dark dark:via-vintage-primary dark:to-vintage-amber-100">
                {/* Header */}
                <header className="relative z-10 border-b border-vintage-amber-200/60 bg-white/95 backdrop-blur-lg shadow-sm dark:border-vintage-amber-200/30 dark:bg-background-dark/95">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <Link href="/" className="flex items-center space-x-3">
                                <Music className="h-8 w-8 text-accent" />
                                <span className="text-xl font-bold text-primary dark:text-primary-foreground">
                                    Rill
                                </span>
                            </Link>
                            <nav className="flex items-center space-x-4">
                                {auth.user ? (
                                    <>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            Xin chào, {auth.user.name}
                                        </span>
                                        <Link
                                            href={dashboard()}
                                            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
                                        >
                                            {auth.user.role === 'admin' ? 'Quản lý' : 'Tài khoản'}
                                        </Link>
                                    </>
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
                                            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
                                        >
                                            Đăng ký
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="mb-8 text-center">
                        <h1 
                            className="text-4xl sm:text-5xl font-black text-vintage-primary dark:text-white mb-4"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Bộ Sưu Tập Vinyl
                        </h1>
                        <p 
                            className="text-xl text-vintage-tertiary dark:text-vintage-tertiary max-w-2xl mx-auto"
                            style={{ fontFamily: "'Crimson Text', serif" }}
                        >
                            Khám phá hàng ngàn đĩa than chất lượng cao từ các nghệ sĩ nổi tiếng thế giới
                        </p>
                    </div>

                    {/* Search and Filters */}
                    <div className="mb-8 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm album, nghệ sĩ..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            />
                        </div>
                        <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800">
                            <Filter className="h-5 w-5" />
                            <span>Bộ lọc</span>
                        </button>
                    </div>

                    {/* Products Grid - Placeholder */}
                    <div className="text-center py-16">
                        <Music className="h-24 w-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
                        <h3 
                            className="text-2xl font-bold text-vintage-primary dark:text-white mb-4"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Sản phẩm đang được cập nhật
                        </h3>
                        <p 
                            className="text-vintage-tertiary dark:text-vintage-tertiary max-w-md mx-auto mb-8"
                            style={{ fontFamily: "'Crimson Text', serif" }}
                        >
                            Chúng tôi đang hoàn thiện kho dữ liệu sản phẩm. Vui lòng quay lại sau để khám phá bộ sưu tập đĩa than tuyệt vời của chúng tôi.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center space-x-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
                        >
                            <span>Quay lại trang chủ</span>
                        </Link>
                    </div>
                </main>
            </div>
        </>
    );
}
