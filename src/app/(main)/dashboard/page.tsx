import { Suspense } from "react";
import Link from "next/link";
import {
    Flame,
    Zap,
    Trophy,
    BookOpen,
    Target,
    ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/actions/gamification";

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Skeleton className="h-28 rounded-xl" />
                <Skeleton className="h-28 rounded-xl" />
                <Skeleton className="h-28 rounded-xl" />
            </div>
        </div>
    );
}

function getGreeting(): { text: string; emoji: string } {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Chào buổi sáng", emoji: "☀️" };
    if (hour < 18) return { text: "Chào buổi chiều", emoji: "🌤️" };
    return { text: "Chào buổi tối", emoji: "🌙" };
}

async function DashboardContent() {
    const user = await getCurrentUser();
    const greeting = getGreeting();

    return (
        <div className="space-y-6">
            {/* Hero Welcome Card */}
            <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 sm:p-8 dark:border-emerald-800/50 dark:from-emerald-950/40 dark:via-background dark:to-teal-950/30">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-100/50 blur-3xl dark:bg-emerald-900/20" />
                <div className="absolute -bottom-14 -left-14 h-48 w-48 rounded-full bg-teal-100/40 blur-3xl dark:bg-teal-900/15" />

                <div className="relative z-10">
                    <p className="text-sm text-muted-foreground">
                        {greeting.emoji} {greeting.text}
                    </p>
                    <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight">
                        {user?.display_name || "Bạn"}!
                    </h1>
                    <p className="mt-2 text-muted-foreground max-w-md">
                        Chào mừng bạn đến với nền tảng học Tiếng Anh. Hãy bắt
                        đầu hành trình chinh phục ngôn ngữ!
                    </p>
                    <Link href="/placement-test" className="mt-4 inline-block">
                        <Button
                            size="lg"
                            className="cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
                        >
                            <Target className="h-5 w-5" />
                            Làm bài kiểm tra năng lực ngay
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                            <Flame className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-black">
                                {user?.current_streak ?? 0}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Ngày streak
                            </p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                            <Zap className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-black">
                                {user?.total_xp ?? 0}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Tổng XP
                            </p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                            <Trophy className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-black">
                                {user?.longest_streak ?? 0}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Kỷ lục streak
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Link
                    href="/lessons"
                    className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-emerald-300 hover:shadow-md dark:hover:border-emerald-700"
                >
                    <div className="flex items-center gap-3">
                        <BookOpen className="h-6 w-6 text-emerald-500" />
                        <div>
                            <p className="font-semibold group-hover:text-emerald-600 transition-colors">
                                Lộ trình của tôi
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Tiếp tục bài học tiếp theo
                            </p>
                        </div>
                        <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                    </div>
                </Link>
                <Link
                    href="/leaderboard"
                    className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-amber-300 hover:shadow-md dark:hover:border-amber-700"
                >
                    <div className="flex items-center gap-3">
                        <Trophy className="h-6 w-6 text-amber-500" />
                        <div>
                            <p className="font-semibold group-hover:text-amber-600 transition-colors">
                                Bảng xếp hạng
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Xem vị trí của bạn
                            </p>
                        </div>
                        <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <DashboardContent />
        </Suspense>
    );
}
