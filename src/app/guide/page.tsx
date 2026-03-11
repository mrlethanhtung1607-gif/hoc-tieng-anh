import {
    BookOpen,
    Heart,
    Dice5,
    RefreshCw,
    Flame,
    Trophy,
    ArrowLeft,
    Sparkles,
    MousePointerClick,
    Target,
    Zap,
} from "lucide-react";
import Link from "next/link";

export default function GuidePage() {
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                        <Sparkles className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                            Hướng dẫn sử dụng
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Hiểu "Luật chơi" để học Tiếng Anh hiệu quả nhất! 🚀
                        </p>
                    </div>
                </div>

                {/* Welcome banner */}
                <div className="rounded-xl border-2 border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/10 p-5 mb-8">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Chào mừng bạn đến với <strong>HocTiengAnh</strong>! 🎉 Đây không chỉ là một ứng dụng học
                        từ vựng bình thường — mà là cả một <strong>hệ thống game hóa</strong> giúp bạn học mà như chơi.
                        Hãy đọc kỹ hướng dẫn bên dưới để tận dụng tối đa mọi tính năng nhé!
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-8">
                    {/* 1. Lộ trình học */}
                    <section>
                        <h2 className="flex items-center gap-2 text-lg font-bold mb-3">
                            <Target className="h-5 w-5 text-emerald-500" />
                            1. Lộ trình học (Lessons)
                        </h2>
                        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                HocTiengAnh cung cấp kho <strong>50 bài học</strong> bao phủ ~<strong>1000 từ vựng cơ bản</strong>,
                                từ chào hỏi đơn giản đến các chủ đề đời sống thường ngày như Công việc, Du lịch, Ẩm thực, Cảm xúc...
                            </p>
                            <div className="rounded-lg bg-muted/50 p-3 text-sm space-y-2">
                                <p className="flex items-start gap-2">
                                    <BookOpen className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>Mỗi bài học gồm <strong>flashcard từ vựng</strong> + <strong>câu hỏi trắc nghiệm</strong> do AI tạo tự động.</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <Zap className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                    <span>Trả lời đúng = <strong>+10 XP</strong>. Trả lời sai = <strong>-1 Tim ❤️</strong> và câu hỏi đó sẽ bị lưu vào kho Lỗi sai.</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <Heart className="h-4 w-4 text-pink-500 shrink-0 mt-0.5" />
                                    <span>Bắt đầu mỗi bài học <strong>tốn 1 Tim</strong>. Hãy suy nghĩ kỹ trước khi chọn đáp án nhé!</span>
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 2. Hệ thống Tim */}
                    <section>
                        <h2 className="flex items-center gap-2 text-lg font-bold mb-3">
                            <Heart className="h-5 w-5 text-pink-500" />
                            2. Hệ thống Tim (Hearts)
                        </h2>
                        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Tim là "nhiên liệu" để bạn học mỗi ngày. Hệ thống Tim buộc bạn phải
                                <strong> tập trung và trân trọng</strong> từng lần trả lời!
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="rounded-lg bg-pink-50 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-900/50 p-3 text-center">
                                    <p className="text-2xl font-black text-pink-600">5</p>
                                    <p className="text-[10px] font-medium text-pink-500">Tim tối đa / ngày</p>
                                </div>
                                <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-3 text-center">
                                    <p className="text-2xl font-black text-amber-600">☀️</p>
                                    <p className="text-[10px] font-medium text-amber-500">Reset mỗi sáng</p>
                                </div>
                                <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-3 text-center">
                                    <p className="text-2xl font-black text-red-600">0 = 🔒</p>
                                    <p className="text-[10px] font-medium text-red-500">Hết Tim = Khóa bài</p>
                                </div>
                            </div>
                            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 p-3">
                                <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                                    💡 Mẹo: Hết Tim? Đừng lo! Vào mục <strong>Đọc truyện</strong> để kiếm thêm Tim miễn phí!
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 3. Đọc truyện Gacha */}
                    <section>
                        <h2 className="flex items-center gap-2 text-lg font-bold mb-3">
                            <Dice5 className="h-5 w-5 text-indigo-500" />
                            3. Đọc truyện Gacha (Stories)
                        </h2>
                        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Đây là tính năng <strong>độc đáo nhất</strong> của HocTiengAnh! Bạn sẽ rút thăm ngẫu
                                nhiên một câu chuyện thú vị và <strong>điền từ Tiếng Anh vào chỗ trống</strong> để hoàn thành cốt truyện.
                            </p>
                            <div className="rounded-lg bg-muted/50 p-3 text-sm space-y-2.5">
                                <p className="flex items-start gap-2">
                                    <span className="text-indigo-500 font-bold shrink-0">Bước 1:</span>
                                    <span>Vào trang <strong>Đọc truyện</strong> → Bấm nút <strong>"🎲 Rút thăm"</strong>.</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-indigo-500 font-bold shrink-0">Bước 2:</span>
                                    <span>Đọc câu chuyện. Những chữ có <span className="border-b-2 border-dotted border-muted-foreground/40">gạch chân nét đứt</span> là <strong>gợi ý</strong>.</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <MousePointerClick className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                                    <span><strong>Trỏ chuột</strong> vào chữ gạch chân → Hiện <strong>Tooltip bong bóng</strong> chứa đáp án Tiếng Anh!</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-indigo-500 font-bold shrink-0">Bước 3:</span>
                                    <span>Gõ từ Tiếng Anh vào ô trống bên cạnh. Đúng = <span className="text-emerald-500 font-bold">xanh ✓</span>, Sai = <span className="text-red-500 font-bold">đỏ ✗</span>.</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-indigo-500 font-bold shrink-0">Bước 4:</span>
                                    <span>Điền đúng <strong>100%</strong> → Nút "Hoàn thành" xuất hiện → Nhận <strong>+1 Tim ❤️</strong> + <strong>+1 Streak 🔥</strong> + <strong>🎆 Pháo hoa</strong>!</span>
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 4. Ôn tập lỗi sai */}
                    <section>
                        <h2 className="flex items-center gap-2 text-lg font-bold mb-3">
                            <RefreshCw className="h-5 w-5 text-orange-500" />
                            4. Ôn tập lỗi sai (Practice)
                        </h2>
                        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Sai không đáng sợ — <strong>không ôn lại mới đáng sợ!</strong> 💪 Mỗi câu hỏi bạn
                                trả lời sai trong quá trình học sẽ tự động được lưu vào <strong>Kho lỗi sai</strong>.
                            </p>
                            <div className="rounded-lg bg-muted/50 p-3 text-sm space-y-2">
                                <p className="flex items-start gap-2">
                                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] text-white font-bold shrink-0 mt-0.5">!</span>
                                    <span>Khi có lỗi sai chờ ôn, menu <strong>Luyện tập</strong> trên Sidebar sẽ hiện <strong>chấm đỏ 🔴</strong> nhắc nhở bạn.</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <RefreshCw className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                                    <span>Vào trang Luyện tập → Làm lại câu hỏi sai dưới dạng <strong>quiz trắc nghiệm</strong>.</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <Sparkles className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>Trả lời đúng → Câu hỏi được <strong>xóa khỏi kho</strong>. Sạch kho = <strong>"Bạn tuyệt vời quá! 🎉"</strong></span>
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 5. Streak & XP */}
                    <section>
                        <h2 className="flex items-center gap-2 text-lg font-bold mb-3">
                            <Flame className="h-5 w-5 text-orange-500" />
                            5. Chuỗi ngày (Streak) & Đua top
                        </h2>
                        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Sự <strong>kiên trì</strong> là chìa khóa thành công! Hệ thống Streak và XP sẽ giúp bạn
                                duy trì động lực học mỗi ngày.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="rounded-lg border border-border p-3 space-y-2">
                                    <h4 className="text-sm font-bold flex items-center gap-1.5">
                                        <Flame className="h-4 w-4 text-orange-500" /> Streak
                                    </h4>
                                    <ul className="text-xs text-muted-foreground space-y-1.5">
                                        <li>• Mỗi ngày bạn học (Unit hoặc Truyện) = <strong>+1 ngày Streak</strong></li>
                                        <li>• Streak chỉ tăng <strong>1 lần/ngày</strong>, dù bạn học bao nhiêu</li>
                                        <li>• Nghỉ 1 ngày = <strong>Streak reset về 0</strong> 😱</li>
                                        <li>• Mốc thành tựu: 🔥3d → ⚡7d → 🌟14d → 💎30d → 👑60d → 🏆100d</li>
                                    </ul>
                                </div>
                                <div className="rounded-lg border border-border p-3 space-y-2">
                                    <h4 className="text-sm font-bold flex items-center gap-1.5">
                                        <Trophy className="h-4 w-4 text-amber-500" /> XP & Bảng xếp hạng
                                    </h4>
                                    <ul className="text-xs text-muted-foreground space-y-1.5">
                                        <li>• Trả lời đúng mỗi câu = <strong>+10 XP</strong></li>
                                        <li>• XP tích lũy theo thời gian, <strong>không bao giờ mất</strong></li>
                                        <li>• XP quyết định vị trí trên <strong>Bảng xếp hạng</strong> 🏅</li>
                                        <li>• Cạnh tranh với bạn bè và cộng đồng!</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Final encouragement */}
                    <div className="rounded-xl border-2 border-emerald-200 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 p-6 text-center">
                        <p className="text-3xl mb-2">🌟</p>
                        <h3 className="text-lg font-black text-emerald-700 dark:text-emerald-400 mb-1">
                            Bạn đã sẵn sàng!
                        </h3>
                        <p className="text-sm text-emerald-600/80 dark:text-emerald-400/60 mb-4 max-w-md mx-auto">
                            Hành trình ngàn dặm bắt đầu từ một bước chân. Hãy mở bài học đầu tiên và chinh phục Tiếng Anh thôi nào!
                        </p>
                        <Link
                            href="/lessons"
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-colors"
                        >
                            <BookOpen className="h-4 w-4" /> Bắt đầu học ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
