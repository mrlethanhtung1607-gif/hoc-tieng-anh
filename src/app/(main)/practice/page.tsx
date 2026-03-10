import { Suspense } from "react";
import {
    RotateCcw,
    CheckCircle2,
    Trophy,
    Sparkles,
    AlertTriangle,
    BookOpen,
    Calendar,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getMistakes } from "@/lib/actions/mistakes";
import { cn } from "@/lib/utils";
import { MistakeReviewClient } from "./mistake-review-client";

function PracticeSkeleton() {
    return (
        <div className="mx-auto max-w-2xl space-y-4">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-64 rounded-xl" />
        </div>
    );
}

async function PracticeContent() {
    const mistakes = await getMistakes();
    const count = mistakes.length;
    const today = new Date().toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="mx-auto max-w-2xl space-y-5">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
                    <RotateCcw className="h-7 w-7 text-orange-500" />
                    Ôn tập lỗi sai
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Ôn lại các câu bạn đã trả lời sai để ghi nhớ tốt hơn
                </p>
            </div>

            {/* Today's Review Stats */}
            <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30">
                            <Calendar className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">{today}</p>
                            <p className="font-bold text-sm">Lịch nhắc nhở ôn tập</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className={cn(
                            "text-2xl font-black",
                            count > 0 ? "text-orange-500" : "text-emerald-500"
                        )}>
                            {count}
                        </p>
                        <p className="text-[10px] text-muted-foreground">câu cần ôn</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            {count === 0 ? (
                /* Empty state — no mistakes! */
                <div className="rounded-2xl border border-border bg-card p-8 sm:p-12 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/20 mx-auto mb-5 shadow-sm">
                        <Trophy className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h2 className="text-xl font-black mb-2">Bạn tuyệt vời quá! 🎉</h2>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
                        Không có lỗi sai nào cần ôn tập hôm nay. Hãy tiếp tục học bài mới để thử thách bản thân!
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a
                            href="/lessons"
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition-colors"
                        >
                            <BookOpen className="h-4 w-4" /> Học bài mới
                        </a>
                    </div>
                    <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground/60">
                        <Sparkles className="h-3 w-3" />
                        <span>Hệ thống sẽ tự động thêm câu khi bạn trả lời sai</span>
                    </div>
                </div>
            ) : (
                /* Mistake review quiz */
                <div className="space-y-4">
                    <div className="flex items-center gap-2 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 px-4 py-2.5">
                        <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0" />
                        <p className="text-xs text-orange-700 dark:text-orange-400">
                            Trả lời đúng để xóa câu hỏi khỏi danh sách ôn tập
                        </p>
                    </div>
                    <MistakeReviewClient mistakes={JSON.parse(JSON.stringify(mistakes))} />
                </div>
            )}
        </div>
    );
}

export default function PracticePage() {
    return (
        <Suspense fallback={<PracticeSkeleton />}>
            <PracticeContent />
        </Suspense>
    );
}
