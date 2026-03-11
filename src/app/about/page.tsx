import {
    Sparkles,
    Brain,
    Code2,
    Rocket,
    BookOpen,
    ArrowLeft,
    Heart,
    Target,
    RefreshCw,
    Gamepad2,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
                {/* Back link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft className="h-4 w-4" /> Quay lại trang chủ
                </Link>

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                        <Sparkles className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                            Giới thiệu về HocTiengAnh
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Học như chơi, chơi để giỏi 🚀
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-8">
                    {/* 1. Sứ mệnh */}
                    <section>
                        <h2 className="flex items-center gap-2 text-lg font-bold mb-3">
                            <Sparkles className="h-5 w-5 text-amber-500" />
                            Sứ mệnh của chúng tôi
                        </h2>
                        <div className="rounded-xl border-2 border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/10 p-5 space-y-3">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Chúng tôi tin rằng <strong>Tiếng Anh không phải là một gánh nặng</strong> — mà là cánh
                                cửa mở ra cả một thế giới cơ hội. Vấn đề là hầu hết các phương pháp học truyền thống
                                đều quá nhàm chán và thiếu động lực.
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Đó là lý do <strong>HocTiengAnh</strong> ra đời — với sứ mệnh biến việc học
                                từ vựng thành một trải nghiệm <strong>thú vị, gây nghiện như chơi game</strong>.
                            </p>
                            <div className="grid grid-cols-3 gap-3 pt-1">
                                <div className="rounded-lg bg-white dark:bg-card border border-amber-200 dark:border-amber-900/30 p-3 text-center">
                                    <Gamepad2 className="h-6 w-6 text-amber-500 mx-auto mb-1" />
                                    <p className="text-[10px] font-bold text-muted-foreground">Gamification</p>
                                </div>
                                <div className="rounded-lg bg-white dark:bg-card border border-amber-200 dark:border-amber-900/30 p-3 text-center">
                                    <Heart className="h-6 w-6 text-pink-500 mx-auto mb-1" />
                                    <p className="text-[10px] font-bold text-muted-foreground">Động lực mỗi ngày</p>
                                </div>
                                <div className="rounded-lg bg-white dark:bg-card border border-amber-200 dark:border-amber-900/30 p-3 text-center">
                                    <Target className="h-6 w-6 text-emerald-500 mx-auto mb-1" />
                                    <p className="text-[10px] font-bold text-muted-foreground">Mục tiêu rõ ràng</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. Phương pháp */}
                    <section>
                        <h2 className="flex items-center gap-2 text-lg font-bold mb-3">
                            <Brain className="h-5 w-5 text-indigo-500" />
                            Phương pháp học đột phá
                        </h2>
                        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                HocTiengAnh không phải là ứng dụng "học vẹt" — mà áp dụng những phương pháp khoa học
                                đã được chứng minh bởi nghiên cứu tâm lý học nhận thức:
                            </p>

                            <div className="rounded-lg border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/10 p-4 space-y-2">
                                <h4 className="text-sm font-bold flex items-center gap-2">
                                    <RefreshCw className="h-4 w-4 text-indigo-500" />
                                    Ôn tập ngắt quãng (Spaced Repetition)
                                </h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Mỗi câu bạn trả lời sai sẽ được lưu vào <strong>Kho lỗi sai</strong> và hiện lên
                                    thông báo nhắc nhở. Bạn buộc phải quay lại ôn tập cho đến khi trả lời đúng —
                                    đúng thời điểm não sắp quên, giúp ghi nhớ <strong>sâu gấp 3 lần</strong> so với
                                    học thuộc lòng thông thường.
                                </p>
                            </div>

                            <div className="rounded-lg border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/10 p-4 space-y-2">
                                <h4 className="text-sm font-bold flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-emerald-500" />
                                    Chủ động gợi nhớ (Active Recall)
                                </h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Thay vì đọc thụ động, tính năng <strong>Đọc truyện Gacha</strong> yêu cầu bạn
                                    tự tay điền từ Tiếng Anh vào chỗ trống. Não bạn phải <strong>chủ động tìm kiếm</strong> đáp án
                                    thay vì chỉ nhận diện — giống như sự khác biệt giữa xem đáp án và tự giải bài.
                                    Kết hợp gợi ý Tooltip song ngữ Việt-Anh, bạn vừa đọc truyện vừa học từ một cách tự nhiên nhất.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 3. Đội ngũ */}
                    <section>
                        <h2 className="flex items-center gap-2 text-lg font-bold mb-3">
                            <Code2 className="h-5 w-5 text-sky-500" />
                            Đội ngũ phát triển
                        </h2>
                        <div className="rounded-xl border border-border bg-card p-5">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-3xl font-black shadow-lg shrink-0">
                                    T
                                </div>
                                <div className="text-center sm:text-left space-y-2">
                                    <h3 className="text-base font-black">Lê Thanh Tùng</h3>
                                    <p className="text-xs text-muted-foreground font-medium">
                                        Founder & Developer
                                    </p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Nền tảng HocTiengAnh được lên ý tưởng và phát triển <strong>độc lập</strong> bởi
                                        Lê Thanh Tùng — với khát vọng tạo ra một sản phẩm EdTech <strong>chất lượng cao, 
                                        hoàn toàn miễn phí</strong>, dành riêng cho người Việt.
                                    </p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Với niềm tin rằng <strong>công nghệ có thể thay đổi giáo dục</strong>, từng dòng code
                                        trong ứng dụng này được viết với tâm huyết — mong muốn mang đến cho mọi người
                                        một công cụ học tập hiện đại, thông minh và truyền cảm hứng.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 4. Thành tựu nền tảng */}
                    <section>
                        <h2 className="flex items-center gap-2 text-lg font-bold mb-3">
                            <Rocket className="h-5 w-5 text-rose-500" />
                            Nền tảng gồm những gì?
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { number: "50+", label: "Bài học", icon: "📚" },
                                { number: "1000+", label: "Từ vựng", icon: "🔤" },
                                { number: "30+", label: "Truyện ngắn", icon: "📖" },
                                { number: "∞", label: "Động lực", icon: "🔥" },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-xl border border-border bg-card p-4 text-center"
                                >
                                    <p className="text-xl mb-1">{stat.icon}</p>
                                    <p className="text-xl font-black">{stat.number}</p>
                                    <p className="text-[10px] font-medium text-muted-foreground">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CTA */}
                    <div className="rounded-xl border-2 border-emerald-200 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 p-6 text-center">
                        <p className="text-3xl mb-2">🚀</p>
                        <h3 className="text-lg font-black text-emerald-700 dark:text-emerald-400 mb-1">
                            Sẵn sàng chinh phục Tiếng Anh?
                        </h3>
                        <p className="text-sm text-emerald-600/80 dark:text-emerald-400/60 mb-4 max-w-md mx-auto">
                            Hàng ngàn từ vựng, hàng chục câu chuyện, và cả một hành trình thú vị đang chờ bạn.
                            Bắt đầu ngay hôm nay — miễn phí, mãi mãi.
                        </p>
                        <Link
                            href="/lessons"
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-colors"
                        >
                            <BookOpen className="h-4 w-4" /> Bắt đầu hành trình học tập ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
