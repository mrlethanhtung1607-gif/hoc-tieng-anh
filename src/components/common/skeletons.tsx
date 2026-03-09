import { Skeleton } from "@/components/ui/skeleton";

export function LeaderboardSkeleton() {
    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex flex-col items-center gap-3">
                <Skeleton className="h-14 w-14 rounded-full" />
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>

            <Skeleton className="h-20 w-full rounded-xl" />

            <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-4 rounded-xl border border-border p-4"
                    >
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex items-center gap-3 flex-1">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                        <div className="text-right space-y-1">
                            <Skeleton className="h-5 w-16 ml-auto" />
                            <Skeleton className="h-3 w-8 ml-auto" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function LessonSidebarSkeleton() {
    return (
        <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
                <Skeleton className="h-4 w-32" />
            </div>
            <div className="divide-y divide-border">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 px-4 py-3"
                    >
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function LessonHeaderSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-3">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-8 w-72" />
                <Skeleton className="h-4 w-full max-w-md" />
                <div className="flex gap-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </div>
        </div>
    );
}

export function AdminTableSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-9 w-28 rounded-md" />
            </div>
            <div className="rounded-lg border border-border">
                <div className="border-b border-border p-4 flex gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-4 flex-1" />
                    ))}
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="border-b border-border p-4 flex gap-4 last:border-0"
                    >
                        {Array.from({ length: 4 }).map((_, j) => (
                            <Skeleton key={j} className="h-4 flex-1" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function AdminDashboardSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-8 w-40" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-xl border border-border p-6 space-y-3"
                    >
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                ))}
            </div>
            <Skeleton className="h-80 w-full rounded-xl" />
        </div>
    );
}
