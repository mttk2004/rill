import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/navigation";
import { CheckCircle, ArrowRight, ShoppingBag, History } from "lucide-react";
import { Head, usePage, Link } from "@inertiajs/react";
import { type SharedData } from '@/types';

interface Order {
    id: string;
    order_number: string;
}

interface ThankYouPageProps extends SharedData {
    order: Order;
}

export default function ThankYou() {
    const pageProps = usePage<ThankYouPageProps>().props;
    const { auth, order } = pageProps;

    return (
        <>
            <Head title={`Đặt hàng thành công #${order.order_number}`} />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
                <Navigation user={auth.user} />

                <main className="container mx-auto px-4 py-16 text-center">
                    <div className="max-w-2xl mx-auto">
                        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm animate-fade-in-up">
                            <CardHeader className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-8">
                                <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
                                <CardTitle className="text-4xl font-bold text-green-700 dark:text-green-300">
                                    Đặt hàng thành công!
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <p className="text-lg text-slate-700 dark:text-slate-200">
                                    Cảm ơn bạn đã mua sắm tại Rill. Đơn hàng của bạn <span className="font-bold text-amber-600">#{order.order_number}</span> đã được ghi nhận.
                                </p>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Chúng tôi sẽ sớm liên hệ với bạn để xác nhận và giao hàng trong thời gian sớm nhất. Bạn có thể theo dõi chi tiết đơn hàng của mình bất cứ lúc nào.
                                </p>
                                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                                    <Link href={`/orders/${order.id}`}>
                                        <Button className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white" size="lg">
                                            <ShoppingBag className="h-5 w-5 mr-2" />
                                            Xem chi tiết đơn hàng
                                        </Button>
                                    </Link>
                                    <Link href="/orders">
                                        <Button variant="outline" className="w-full sm:w-auto" size="lg">
                                            <History className="h-5 w-5 mr-2" />
                                            Lịch sử mua hàng
                                        </Button>
                                    </Link>
                                </div>
                                <div className="pt-6">
                                    <Link href="/products">
                                        <Button variant="ghost" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                                            Tiếp tục mua sắm
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </>
    );
}
