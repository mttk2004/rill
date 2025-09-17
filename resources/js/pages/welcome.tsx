import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Music, Truck, Star, Shield, Clock, Award, Disc, Headphones, Heart, Users } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Rill - Cửa hàng Đĩa Than Online">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800;900&family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet" />
                <meta name="description" content="Cửa hàng đĩa than online hàng đầu Việt Nam. Khám phá bộ sưu tập vinyl chất lượng cao từ các nghệ sĩ nổi tiếng. Giao hàng COD toàn quốc." />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-vintage-amber-50/30 via-white to-vintage-orange-50/40 dark:from-background-dark dark:via-vintage-primary dark:to-vintage-amber-100">
                {/* Vintage vinyl record pattern overlay */}
                <div 
                    className="fixed inset-0 opacity-[0.03] dark:opacity-[0.02]" 
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='0.6'%3E%3Ccircle cx='40' cy='40' r='20'/%3E%3Ccircle cx='40' cy='40' r='12' fill='none' stroke='%23d97706' stroke-width='0.5'/%3E%3Ccircle cx='40' cy='40' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '120px 120px'
                    }} 
                />
                {/* Header */}
                <header className="relative z-10 border-b border-vintage-amber-200/60 bg-white/95 backdrop-blur-lg shadow-sm dark:border-vintage-amber-200/30 dark:bg-background-dark/95">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-20 items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <Disc className="h-12 w-12 text-accent" style={{ 
                                        animation: 'spin 15s linear infinite',
                                        filter: 'drop-shadow(0 2px 4px rgba(217, 119, 6, 0.3))'
                                    }} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="h-3 w-3 rounded-full bg-vintage-primary dark:bg-white" />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span 
                                        className="text-4xl font-black text-vintage-primary dark:text-white tracking-tight leading-none" 
                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                    >
                                        Rill
                                    </span>
                                    <span 
                                        className="text-xs text-accent font-semibold tracking-[0.2em] uppercase -mt-1"
                                        style={{ fontFamily: "'Crimson Text', serif" }}
                                    >
                                        Vinyl Records
                                    </span>
                                </div>
                            </div>
                            <nav className="flex items-center space-x-3">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-accent via-vintage-accent-warm to-accent px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/25 hover:scale-105"
                                    >
                                        <span className="relative z-10">Dashboard</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="group relative rounded-xl bg-transparent px-6 py-3 text-sm font-semibold text-accent transition-all duration-300 hover:bg-accent hover:text-white hover:shadow-lg hover:shadow-amber-500/25 dark:text-accent dark:hover:text-white"
                                            style={{
                                                boxShadow: 'inset 0 0 0 2px rgb(217 119 6 / 0.8)'
                                            }}
                                        >
                                            Đăng nhập
                                        </Link>
                                        <Link
                                            href={register()}
                                            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-accent via-vintage-accent-warm to-accent px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/25 hover:scale-105"
                                        >
                                            <span className="relative z-10">Đăng ký</span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>
                {/* Hero Section */}
                <main className="relative overflow-hidden">
                    <div className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pt-40">
                        <div className="mx-auto max-w-4xl text-center">
                            {/* Decorative vinyl records */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-10">
                                <Disc className="h-96 w-96 text-accent" style={{ 
                                    animation: 'spin 30s linear infinite reverse',
                                    transform: 'translateX(-40px) translateY(-20px)'
                                }} />
                                <Disc className="h-64 w-64 text-accent" style={{ 
                                    animation: 'spin 25s linear infinite',
                                    transform: 'translateX(60px) translateY(30px)'
                                }} />
                            </div>
                            
                            {/* Main headline */}
                            <div className="relative z-10">
                                <h1 
                                    className="text-6xl sm:text-8xl lg:text-9xl font-black text-vintage-primary dark:text-white tracking-tighter leading-[0.85] mb-8" 
                                    style={{ 
                                        fontFamily: "'Playfair Display', serif",
                                        textShadow: '0 4px 8px rgba(217, 119, 6, 0.15)'
                                    }}
                                >
                                    Khám phá thế giới{' '}
                                    <span 
                                        className="block text-transparent bg-clip-text bg-gradient-to-r from-accent via-vintage-accent-hot to-vintage-accent-red relative"
                                        style={{
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}
                                    >
                                        vinyl
                                    </span>
                                    <span className="block text-4xl sm:text-6xl lg:text-7xl text-vintage-secondary dark:text-accent -mt-4">
                                        chính hãng
                                    </span>
                                </h1>
                                
                                <p 
                                    className="mt-8 text-xl sm:text-2xl leading-relaxed text-vintage-tertiary dark:text-vintage-tertiary max-w-3xl mx-auto font-medium"
                                    style={{ fontFamily: "'Crimson Text', serif" }}
                                >
                                    Cửa hàng đĩa than online hàng đầu Việt Nam. Chúng tôi mang đến cho bạn những đĩa than chất lượng cao từ các nghệ sĩ nổi tiếng thế giới.
                                </p>

                                {!auth.user && (
                                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                                        <Link
                                            href={register()}
                                            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent via-vintage-accent-warm to-accent px-10 py-5 text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:shadow-3xl hover:shadow-amber-500/30 hover:scale-110 transform"
                                            style={{ 
                                                fontFamily: "'Crimson Text', serif",
                                                boxShadow: '0 20px 40px rgba(217, 119, 6, 0.3), 0 0 0 1px rgba(217, 119, 6, 0.2)'
                                            }}
                                        >
                                            <span className="relative z-10 flex items-center space-x-3">
                                                <span>Bắt đầu mua sắm</span>
                                                <Headphones className="h-5 w-5" />
                                            </span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                        </Link>
                                        <Link
                                            href={login()}
                                            className="group relative rounded-2xl bg-transparent px-10 py-5 text-lg font-bold text-accent transition-all duration-300 hover:bg-accent hover:text-white hover:shadow-2xl hover:shadow-amber-500/25 hover:scale-105 dark:text-accent dark:hover:text-white"
                                            style={{ 
                                                fontFamily: "'Crimson Text', serif",
                                                boxShadow: 'inset 0 0 0 3px rgb(217 119 6)'
                                            }}
                                        >
                                            <span className="flex items-center space-x-3">
                                                <span>Đăng nhập</span>
                                                <Users className="h-5 w-5" />
                                            </span>
                                        </Link>
                                    </div>
                                )}

                                {/* Vintage decorative elements */}
                                <div className="mt-16 flex items-center justify-center space-x-8 opacity-60">
                                    <div className="flex items-center space-x-3 text-vintage-secondary dark:text-vintage-tertiary">
                                        <Heart className="h-6 w-6 fill-current" />
                                        <span 
                                            className="text-sm font-semibold tracking-wider uppercase"
                                            style={{ fontFamily: "'Crimson Text', serif" }}
                                        >
                                            Được yêu thích
                                        </span>
                                    </div>
                                    <div className="h-6 w-px bg-vintage-secondary dark:bg-vintage-tertiary" />
                                    <div className="flex items-center space-x-3 text-vintage-secondary dark:text-vintage-tertiary">
                                        <Music className="h-6 w-6" />
                                        <span 
                                            className="text-sm font-semibold tracking-wider uppercase"
                                            style={{ fontFamily: "'Crimson Text', serif" }}
                                        >
                                            Chất lượng cao
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 relative">
                        <div className="mx-auto max-w-3xl text-center">
                            <h2 
                                className="text-5xl sm:text-6xl font-black text-vintage-primary dark:text-white tracking-tight leading-tight mb-6"
                                style={{ 
                                    fontFamily: "'Playfair Display', serif",
                                    textShadow: '0 2px 4px rgba(217, 119, 6, 0.1)'
                                }}
                            >
                                Tại sao chọn{' '}
                                <span className="text-accent">
                                    Rill
                                </span>?
                            </h2>
                            <p 
                                className="text-xl leading-relaxed text-vintage-tertiary dark:text-vintage-tertiary font-medium"
                                style={{ fontFamily: "'Crimson Text', serif" }}
                            >
                                Chúng tôi cam kết mang đến trải nghiệm mua sắm vinyl tốt nhất cho cộng đồng yêu nhạc Việt Nam
                            </p>
                        </div>
                        <div className="mx-auto mt-20 max-w-6xl">
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="group relative rounded-2xl bg-gradient-to-br from-white via-vintage-amber-50/50 to-vintage-orange-50/30 p-8 shadow-xl border-2 border-vintage-amber-100/80 backdrop-blur-sm dark:from-vintage-amber-100 dark:via-vintage-primary dark:to-background-dark dark:border-vintage-amber-200/30 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:scale-105">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-vintage-accent-hot shadow-lg group-hover:shadow-xl group-hover:shadow-amber-500/25 transition-all duration-300">
                                        <Music className="h-8 w-8 text-white" />
                                    </div>
                                    <h3
                                        className="mt-6 text-2xl font-bold text-vintage-primary dark:text-white"
                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                    >
                                        Bộ sưu tập đồ sộ
                                    </h3>
                                    <p
                                        className="mt-4 text-base leading-relaxed text-vintage-tertiary dark:text-vintage-tertiary font-medium"
                                        style={{ fontFamily: "'Crimson Text', serif" }}
                                    >
                                        Hàng ngàn đĩa than từ các nghệ sĩ hàng đầu, bao gồm cả các album hiếm và phiên bản giới hạn.
                                    </p>
                                </div>
                                <div className="group relative rounded-2xl bg-gradient-to-br from-white via-vintage-amber-50/50 to-vintage-orange-50/30 p-8 shadow-xl border-2 border-vintage-amber-100/80 backdrop-blur-sm dark:from-vintage-amber-100 dark:via-vintage-primary dark:to-background-dark dark:border-vintage-amber-200/30 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:scale-105">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-vintage-accent-hot shadow-lg group-hover:shadow-xl group-hover:shadow-amber-500/25 transition-all duration-300">
                                        <Truck className="h-8 w-8 text-white" />
                                    </div>
                                    <h3
                                        className="mt-6 text-2xl font-bold text-vintage-primary dark:text-white"
                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                    >
                                        Giao hàng COD
                                    </h3>
                                    <p
                                        className="mt-4 text-base leading-relaxed text-vintage-tertiary dark:text-vintage-tertiary font-medium"
                                        style={{ fontFamily: "'Crimson Text', serif" }}
                                    >
                                        Thanh toán khi nhận hàng, giao hàng tận nơi toàn quốc. An toàn, tin cậy và tiện lợi.
                                    </p>
                                </div>
                                <div className="group relative rounded-2xl bg-gradient-to-br from-white via-vintage-amber-50/50 to-vintage-orange-50/30 p-8 shadow-xl border-2 border-vintage-amber-100/80 backdrop-blur-sm dark:from-vintage-amber-100 dark:via-vintage-primary dark:to-background-dark dark:border-vintage-amber-200/30 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:scale-105">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-vintage-accent-hot shadow-lg group-hover:shadow-xl group-hover:shadow-amber-500/25 transition-all duration-300">
                                        <Shield className="h-8 w-8 text-white" />
                                    </div>
                                    <h3
                                        className="mt-6 text-2xl font-bold text-vintage-primary dark:text-white"
                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                    >
                                        Chất lượng đảm bảo
                                    </h3>
                                    <p
                                        className="mt-4 text-base leading-relaxed text-vintage-tertiary dark:text-vintage-tertiary font-medium"
                                        style={{ fontFamily: "'Crimson Text', serif" }}
                                    >
                                        Tất cả đĩa than được kiểm tra kỹ lưỡng trước khi gử đến khách hàng.
                                    </p>
                                </div>
                                <div className="group relative rounded-2xl bg-gradient-to-br from-white via-vintage-amber-50/50 to-vintage-orange-50/30 p-8 shadow-xl border-2 border-vintage-amber-100/80 backdrop-blur-sm dark:from-vintage-amber-100 dark:via-vintage-primary dark:to-background-dark dark:border-vintage-amber-200/30 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:scale-105">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-vintage-accent-hot shadow-lg group-hover:shadow-xl group-hover:shadow-amber-500/25 transition-all duration-300">
                                        <Star className="h-8 w-8 text-white" />
                                    </div>
                                    <h3
                                        className="mt-6 text-2xl font-bold text-vintage-primary dark:text-white"
                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                    >
                                        Đánh giá cộng đồng
                                    </h3>
                                    <p
                                        className="mt-4 text-base leading-relaxed text-vintage-tertiary dark:text-vintage-tertiary font-medium"
                                        style={{ fontFamily: "'Crimson Text', serif" }}
                                    >
                                        Hệ thống review và đánh giá từ cộng đồng người yêu nhạc giúp bạn chọn được album phù hợp.
                                    </p>
                                </div>
                                <div className="group relative rounded-2xl bg-gradient-to-br from-white via-vintage-amber-50/50 to-vintage-orange-50/30 p-8 shadow-xl border-2 border-vintage-amber-100/80 backdrop-blur-sm dark:from-vintage-amber-100 dark:via-vintage-primary dark:to-background-dark dark:border-vintage-amber-200/30 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:scale-105">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-vintage-accent-hot shadow-lg group-hover:shadow-xl group-hover:shadow-amber-500/25 transition-all duration-300">
                                        <Clock className="h-8 w-8 text-white" />
                                    </div>
                                    <h3
                                        className="mt-6 text-2xl font-bold text-vintage-primary dark:text-white"
                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                    >
                                        Hỗ trợ 24/7
                                    </h3>
                                    <p
                                        className="mt-4 text-base leading-relaxed text-vintage-tertiary dark:text-vintage-tertiary font-medium"
                                        style={{ fontFamily: "'Crimson Text', serif" }}
                                    >
                                        Đội ngũ hỗ trợ khách hàng chuyên nghiệp, sẵn sàng giải đáp mọi thắc mắc của bạn.
                                    </p>
                                </div>
                                <div className="group relative rounded-2xl bg-gradient-to-br from-white via-vintage-amber-50/50 to-vintage-orange-50/30 p-8 shadow-xl border-2 border-vintage-amber-100/80 backdrop-blur-sm dark:from-vintage-amber-100 dark:via-vintage-primary dark:to-background-dark dark:border-vintage-amber-200/30 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:scale-105">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-vintage-accent-hot shadow-lg group-hover:shadow-xl group-hover:shadow-amber-500/25 transition-all duration-300">
                                        <Award className="h-8 w-8 text-white" />
                                    </div>
                                    <h3
                                        className="mt-6 text-2xl font-bold text-vintage-primary dark:text-white"
                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                    >
                                        Uy tín hàng đầu
                                    </h3>
                                    <p
                                        className="mt-4 text-base leading-relaxed text-vintage-tertiary dark:text-vintage-tertiary font-medium"
                                        style={{ fontFamily: "'Crimson Text', serif" }}
                                    >
                                        Được tin tưởng bởi hàng ngàn khách hàng trên khắp cả nước.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 relative">
                        <div className="mx-auto max-w-4xl text-center">
                            {/* Background vinyl record */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-10">
                                <Disc className="h-80 w-80 text-accent" style={{
                                    animation: 'spin 20s linear infinite'
                                }} />
                            </div>

                            <div className="relative z-10">
                                <h2
                                    className="text-5xl sm:text-6xl font-black text-vintage-primary dark:text-white tracking-tight leading-tight mb-8"
                                    style={{
                                        fontFamily: "'Playfair Display', serif",
                                        textShadow: '0 2px 4px rgba(217, 119, 6, 0.1)'
                                    }}
                                >
                                    Sẵn sàng bắt đầu{' '}
                                    <span className="text-accent">
                                        hành trình vinyl
                                    </span>?
                                </h2>
                                <p
                                    className="text-xl sm:text-2xl leading-relaxed text-vintage-tertiary dark:text-vintage-tertiary font-medium max-w-3xl mx-auto"
                                    style={{ fontFamily: "'Crimson Text', serif" }}
                                >
                                    Tham gia cộng đồng những người yêu nhạc và khám phá hàng ngàn đĩa than chất lượng cao
                                </p>
                                {!auth.user && (
                                    <div className="mt-12">
                                        <Link
                                            href={register()}
                                            className="group relative overflow-hidden inline-block rounded-3xl bg-gradient-to-r from-accent via-vintage-accent-warm to-accent px-12 py-6 text-xl font-bold text-white shadow-2xl transition-all duration-300 hover:shadow-3xl hover:shadow-amber-500/30 hover:scale-110 transform"
                                            style={{
                                                fontFamily: "'Crimson Text', serif",
                                                boxShadow: '0 20px 40px rgba(217, 119, 6, 0.3), 0 0 0 1px rgba(217, 119, 6, 0.2)'
                                            }}
                                        >
                                            <span className="relative z-10 flex items-center space-x-3">
                                                <span>Tạo tài khoản miễn phí</span>
                                                <Heart className="h-6 w-6 fill-current" />
                                            </span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="relative border-t-2 border-vintage-amber-200/60 bg-gradient-to-br from-white via-vintage-amber-50/30 to-vintage-orange-50/20 dark:border-vintage-amber-200/30 dark:from-background-dark dark:via-vintage-primary dark:to-vintage-amber-100">
                    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <Disc className="h-10 w-10 text-accent" style={{
                                        animation: 'spin 12s linear infinite',
                                        filter: 'drop-shadow(0 2px 4px rgba(217, 119, 6, 0.3))'
                                    }} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="h-2 w-2 rounded-full bg-vintage-primary dark:bg-white" />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span
                                        className="text-3xl font-black text-vintage-primary dark:text-white tracking-tight leading-none"
                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                    >
                                        Rill
                                    </span>
                                    <span
                                        className="text-xs text-accent font-semibold tracking-[0.15em] uppercase -mt-1"
                                        style={{ fontFamily: "'Crimson Text', serif" }}
                                    >
                                        Vinyl Records
                                    </span>
                                </div>
                            </div>
                            <div
                                className="text-sm text-vintage-secondary dark:text-vintage-tertiary font-medium"
                                style={{ fontFamily: "'Crimson Text', serif" }}
                            >
                                &copy; {new Date().getFullYear()} Rill. Tất cả các quyền được bảo lưu.
                            </div>
                        </div>
                        <div className="mt-12 border-t-2 border-vintage-amber-200/40 pt-8 dark:border-vintage-amber-200/20">
                            <p
                                className="text-base text-vintage-tertiary dark:text-vintage-tertiary leading-relaxed font-medium max-w-4xl"
                                style={{ fontFamily: "'Crimson Text', serif" }}
                            >
                                Rill - Cửa hàng đĩa than online hàng đầu Việt Nam. Chúng tôi cam kết mang đến những đĩa than chất lượng cao nhất và dịch vụ khách hàng tốt nhất cho cộng đồng yêu nhạc Việt Nam.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
