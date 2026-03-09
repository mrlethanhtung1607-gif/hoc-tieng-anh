import { Suspense } from "react";
import {
    Trophy,
    Flame,
    Crown,
    TrendingUp,
    Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { getLeaderboardProfiles } from "@/lib/actions/gamification";

// ── Types ─────────────────────────────────────────────
interface LeaderboardEntry {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    totalXp: number;
    streakCount: number;
    level: string;
    isCurrentUser: boolean;
}

// ── Avatar Colors (deterministic by name) ─────────────
const AVATAR_COLORS = [
    "bg-rose-500", "bg-sky-500", "bg-amber-500", "bg-emerald-500",
    "bg-teal-500", "bg-indigo-500", "bg-pink-500", "bg-orange-500",
    "bg-cyan-500", "bg-red-500", "bg-lime-600", "bg-fuchsia-500",
];

function getAvatarColor(name: string) {
    const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function getInitials(name: string) {
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "?";
}

// ── Skeleton ──────────────────────────────────────────
function LeaderboardSkeleton() {
    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div className="text-center">
                <Skeleton className="h-16 w-16 rounded-2xl mx-auto mb-3" />
                <Skeleton className="h-8 w-48 mx-auto mb-2" />
                <Skeleton className="h-4 w-64 mx-auto" />
            </div>
            <Skeleton className="h-20 w-full rounded-2xl" />
            <div className="flex justify-center gap-5">
                <Skeleton className="h-48 w-28 rounded-xl" />
                <Skeleton className="h-56 w-28 rounded-xl" />
                <Skeleton className="h-44 w-28 rounded-xl" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
        </div>
    );
}

// ── Podium (Top 3) ───────────────────────────────────
function Podium({ users }: { users: LeaderboardEntry[] }) {
    const [gold, silver, bronze] = users;
    if (!gold || !silver || !bronze) return null;

    const podiumOrder = [silver, gold, bronze];
    const podiumConfig = [
        { height: "h-24 sm:h-28", medal: "🥈", ring: "ring-gray-300 dark:ring-gray-600", barBg: "bg-gradient-to-t from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-700" },
        { height: "h-32 sm:h-36", medal: "🥇", ring: "ring-amber-400 dark:ring-amber-600", barBg: "bg-gradient-to-t from-amber-300 to-amber-100 dark:from-amber-800 dark:to-amber-600" },
        { height: "h-20 sm:h-24", medal: "🥉", ring: "ring-amber-600 dark:ring-amber-700", barBg: "bg-gradient-to-t from-amber-600 to-amber-400 dark:from-amber-900 dark:to-amber-700" },
    ];

    return (
        <div className="flex items-end justify-center gap-3 sm:gap-5 mb-8">
            {podiumOrder.map((user, i) => {
                const config = podiumConfig[i];
                const isGold = i === 1;
                return (
                    <div key={user.id} className="flex flex-col items-center">
                        <div className="relative mb-2">
                            {isGold && (
                                <Crown className="absolute -top-5 left-1/2 -translate-x-1/2 h-6 w-6 text-amber-400 animate-bounce" />
                            )}
                            <div className={cn(
                                "flex items-center justify-center rounded-full ring-4 text-white font-bold text-sm sm:text-base shadow-lg",
                                isGold ? "h-16 w-16 sm:h-20 sm:w-20" : "h-12 w-12 sm:h-16 sm:w-16",
                                getAvatarColor(user.displayName),
                                config.ring,
                            )}>
                                {getInitials(user.displayName)}
                            </div>
                        </div>
                        <p className={cn("font-bold text-xs sm:text-sm mb-0.5 text-center truncate max-w-[80px] sm:max-w-[100px]", user.isCurrentUser && "text-emerald-600 dark:text-emerald-400")}>
                            {user.isCurrentUser ? "Bạn" : user.displayName}
                        </p>
                        <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-2">
                            {user.totalXp.toLocaleString()} XP
                        </p>
                        <div className={cn("w-20 sm:w-28 rounded-t-xl flex items-center justify-center transition-all", config.height, config.barBg)}>
                            <span className="text-2xl sm:text-3xl">{config.medal}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ── Row ──────────────────────────────────────────────
function LeaderboardRow({ user, rank }: { user: LeaderboardEntry; rank: number }) {
    return (
        <div className={cn(
            "flex items-center gap-3 rounded-xl border-2 px-3 py-3 sm:px-4 sm:py-3.5 transition-all",
            user.isCurrentUser
                ? "border-emerald-300 bg-emerald-50/60 shadow-md shadow-emerald-100/50 dark:border-emerald-700 dark:bg-emerald-950/30"
                : "border-transparent bg-card hover:border-border hover:shadow-sm"
        )}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground">
                {rank}
            </div>
            <div className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white font-bold text-xs",
                getAvatarColor(user.displayName)
            )}>
                {getInitials(user.displayName)}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    <p className={cn("font-semibold text-sm truncate", user.isCurrentUser && "text-emerald-700 dark:text-emerald-400")}>
                        {user.isCurrentUser ? "Bạn" : user.displayName}
                    </p>
                    {user.isCurrentUser && (
                        <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                            BẠN
                        </span>
                    )}
                </div>
                <p className="text-xs text-muted-foreground">Level {user.level}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-xs font-medium tabular-nums">{user.streakCount}</span>
            </div>
            <div className="text-right min-w-[70px] shrink-0">
                <p className="text-sm font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                    {user.totalXp.toLocaleString()}
                </p>
                <p className="text-[10px] text-muted-foreground">XP</p>
            </div>
        </div>
    );
}

// ── Main Content ────────────────────────────────────
async function LeaderboardContent() {
    const users = await getLeaderboardProfiles();
    const currentUser = users.find((u) => u.isCurrentUser);
    const currentRank = currentUser ? users.indexOf(currentUser) + 1 : null;
    const hasEnoughForPodium = users.length >= 3;

    return (
        <div className="mx-auto max-w-2xl">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/20 p-4 mb-3 shadow-sm">
                    <Trophy className="h-10 w-10 text-amber-500" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Bảng xếp hạng</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Top học viên tích cực nhất
                </p>
            </div>

            {/* Current User Summary Card */}
            {currentUser && currentRank && (
                <div className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-teal-50 dark:border-emerald-800 dark:from-emerald-950/30 dark:via-background dark:to-teal-950/20 p-4 mb-6 shadow-sm">
                    <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white font-bold", getAvatarColor(currentUser.displayName))}>
                        {getInitials(currentUser.displayName)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-emerald-700 dark:text-emerald-400">Vị trí của bạn</p>
                        <p className="text-xs text-muted-foreground">Level {currentUser.level} · {currentUser.streakCount} ngày streak</p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">#{currentRank}</span>
                        </div>
                        <p className="text-xs font-medium text-amber-600 dark:text-amber-400">{currentUser.totalXp.toLocaleString()} XP</p>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {users.length === 0 && (
                <div className="text-center py-12 rounded-xl border border-dashed border-border">
                    <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h2 className="text-lg font-semibold">Chưa có dữ liệu</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Hãy bắt đầu học để xuất hiện trên bảng xếp hạng!
                    </p>
                </div>
            )}

            {/* Podium (Top 3) */}
            {hasEnoughForPodium && <Podium users={users.slice(0, 3)} />}

            {/* Full List */}
            {users.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 px-2 mb-3">
                        <Star className="h-4 w-4 text-amber-500" />
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Bảng xếp hạng đầy đủ
                        </h2>
                    </div>
                    {users.map((user, i) => (
                        <LeaderboardRow key={user.id} user={user} rank={i + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function LeaderboardPage() {
    return (
        <Suspense fallback={<LeaderboardSkeleton />}>
            <LeaderboardContent />
        </Suspense>
    );
}
