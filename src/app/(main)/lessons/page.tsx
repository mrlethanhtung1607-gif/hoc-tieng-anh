import { Suspense } from "react";
import Link from "next/link";
import {
    BookOpen,
    Lock,
    CheckCircle2,
    Sparkles,
    ArrowRight,
    Users,
    Star,
    GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser, getLessonsFromDB } from "@/lib/actions/gamification";

function LessonsSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-36 rounded-xl" />
                ))}
            </div>
        </div>
    );
}

type LessonStatus = "completed" | "current" | "locked";

function getStatus(lesson: { isUnlocked: boolean; isCompleted: boolean }): LessonStatus {
    if (lesson.isCompleted) return "completed";
    if (lesson.isUnlocked) return "current";
    return "locked";
}

const STATUS_CONFIG: Record<LessonStatus, { icon: typeof BookOpen; color: string; badge: string; border: string }> = {
    completed: {
        icon: CheckCircle2,
        color: "text-emerald-500",
        badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-800/50",
    },
    current: {
        icon: Sparkles,
        color: "text-amber-500",
        badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
        border: "border-amber-200 dark:border-amber-800/50 shadow-md shadow-amber-100/50 dark:shadow-amber-900/20",
    },
    locked: {
        icon: Lock,
        color: "text-muted-foreground",
        badge: "bg-muted text-muted-foreground",
        border: "border-border opacity-60",
    },
};

const BADGE_LABELS: Record<LessonStatus, string> = {
    completed: "Hoàn thành",
    current: "Đang học",
    locked: "Khóa",
};

async function LessonsContent() {
    const [user, lessons] = await Promise.all([getCurrentUser(), getLessonsFromDB()]);

    const completedCount = lessons.filter((l) => l.isCompleted).length;
    const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-6 sm:p-8 text-white">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <GraduationCap className="h-5 w-5" />
                        <span className="text-sm font-medium text-emerald-100">
                            Learning Path
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Lộ trình học tập của bạn</h1>

                    <div className="flex items-center gap-3 mt-3">
                        <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold backdrop-blur-sm">
                            Level {user?.current_level ?? "A0"}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-emerald-100">
                            <Star className="h-4 w-4" />
                            <span>{user?.total_xp ?? 0} XP</span>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-emerald-100 mb-1">
                            <span>Tiến trình tổng</span>
                            <span>{progressPercent}%</span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-white/20">
                            <div
                                className="h-full rounded-full bg-white transition-all"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Empty state */}
            {lessons.length === 0 && (
                <div className="text-center py-12 rounded-xl border border-dashed border-border">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h2 className="text-lg font-semibold">Chưa có bài học nào</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Hãy liên hệ admin để thêm bài học vào hệ thống.
                    </p>
                </div>
            )}

            {/* Lesson Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {lessons.map((lesson, index) => {
                    const status = getStatus(lesson);
                    const config = STATUS_CONFIG[status];
                    const Icon = config.icon;
                    const isClickable = status !== "locked";

                    const card = (
                        <div
                            className={`group relative rounded-xl border-2 bg-card p-5 transition-all ${config.border} ${isClickable ? "hover:shadow-lg cursor-pointer" : ""
                                }`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-lg font-bold ${config.color}`}>
                                        {lesson.unitNumber}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">{lesson.title}</h3>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Unit {lesson.unitNumber}
                                        </p>
                                    </div>
                                </div>
                                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${config.badge}`}>
                                    {BADGE_LABELS[status]}
                                </span>
                            </div>

                            {/* Score bar for completed */}
                            {status === "completed" && lesson.score > 0 && (
                                <div className="mt-2">
                                    <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5">
                                        <span>Điểm</span>
                                        <span>{lesson.score}%</span>
                                    </div>
                                    <div className="h-1.5 w-full rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full bg-emerald-500"
                                            style={{ width: `${lesson.score}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                                <div className="flex items-center gap-1.5">
                                    <Icon className={`h-4 w-4 ${config.color}`} />
                                    <span className="text-xs text-muted-foreground">
                                        {status === "completed" ? "Đã hoàn thành" : status === "current" ? "Sẵn sàng học" : "Hoàn thành bài trước"}
                                    </span>
                                </div>
                                {isClickable && (
                                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                )}
                            </div>
                        </div>
                    );

                    if (isClickable) {
                        return (
                            <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                                {card}
                            </Link>
                        );
                    }
                    return <div key={lesson.id}>{card}</div>;
                })}
            </div>
        </div>
    );
}

export default function LessonsPage() {
    return (
        <Suspense fallback={<LessonsSkeleton />}>
            <LessonsContent />
        </Suspense>
    );
}
