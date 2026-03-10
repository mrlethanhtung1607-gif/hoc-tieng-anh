import { Suspense } from "react";
import {
    Zap,
    Flame,
    GraduationCap,
    BookOpen,
    Calendar,
    Mail,
    Star,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getFullProfile } from "@/lib/actions/gamification";
import { cn } from "@/lib/utils";
import { ProfileNameForm } from "./profile-name-form";

// ── Avatar helpers ───────────────────────────────────────
const AVATAR_COLORS = [
    "from-emerald-500 to-teal-500",
    "from-sky-500 to-blue-500",
    "from-amber-500 to-orange-500",
    "from-rose-500 to-pink-500",
    "from-indigo-500 to-violet-500",
];

function getAvatarGradient(name: string) {
    const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function getInitials(name: string) {
    return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";
}

// ── Skeleton ─────────────────────────────────────────────
function ProfileSkeleton() {
    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex flex-col items-center gap-4 rounded-2xl border bg-card p-8">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-56" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
            </div>
            <Skeleton className="h-48 rounded-xl" />
        </div>
    );
}

// ── Stats Card ───────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, bg }: {
    icon: typeof Zap;
    label: string;
    value: string | number;
    color: string;
    bg: string;
}) {
    return (
        <div className="rounded-xl border border-border bg-card p-4 text-center transition-all hover:shadow-sm">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl mx-auto mb-2", bg)}>
                <Icon className={cn("h-5 w-5", color)} />
            </div>
            <p className="text-xl font-black">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
        </div>
    );
}

// ── Main content ─────────────────────────────────────────
async function ProfileContent() {
    const profile = await getFullProfile();

    if (!profile) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Không thể tải hồ sơ. Vui lòng đăng nhập lại.</p>
            </div>
        );
    }

    const gradient = getAvatarGradient(profile.fullName);
    const joinDate = new Date(profile.joinedAt).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            {/* Profile Header Card */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
                {/* Banner */}
                <div className="h-28 sm:h-36 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500">
                    <div className="absolute top-6 right-6 h-20 w-20 rounded-full bg-white/10 blur-xl" />
                    <div className="absolute top-12 left-8 h-12 w-12 rounded-full bg-white/5 blur-lg" />
                </div>

                {/* Avatar + info */}
                <div className="flex flex-col items-center -mt-14 sm:-mt-16 pb-6 px-6">
                    {profile.avatarUrl ? (
                        <img
                            src={profile.avatarUrl}
                            alt={profile.fullName}
                            className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-4 border-background object-cover shadow-lg"
                        />
                    ) : (
                        <div className={cn(
                            "flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full border-4 border-background bg-gradient-to-br text-white text-2xl sm:text-3xl font-black shadow-lg",
                            gradient
                        )}>
                            {getInitials(profile.fullName)}
                        </div>
                    )}

                    <h1 className="text-xl sm:text-2xl font-black mt-3">{profile.fullName}</h1>

                    <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                        <Mail className="h-3.5 w-3.5" />
                        <span className="text-sm">{profile.email}</span>
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                            Level {profile.level}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Tham gia {joinDate}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard
                    icon={Zap}
                    label="Tổng XP"
                    value={profile.xp.toLocaleString()}
                    color="text-amber-500"
                    bg="bg-amber-100 dark:bg-amber-900/30"
                />
                <StatCard
                    icon={Flame}
                    label="Chuỗi ngày học"
                    value={profile.streak}
                    color="text-orange-500"
                    bg="bg-orange-100 dark:bg-orange-900/30"
                />
                <StatCard
                    icon={GraduationCap}
                    label="Trình độ"
                    value={profile.level}
                    color="text-emerald-500"
                    bg="bg-emerald-100 dark:bg-emerald-900/30"
                />
                <StatCard
                    icon={BookOpen}
                    label="Bài đã học"
                    value={profile.completedLessons}
                    color="text-sky-500"
                    bg="bg-sky-100 dark:bg-sky-900/30"
                />
            </div>

            {/* Achievements Summary */}
            <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="font-bold flex items-center gap-2 mb-4">
                    <Star className="h-4 w-4 text-amber-500" />
                    Thành tích
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                        {
                            title: "Người mới bắt đầu",
                            desc: "Hoàn thành bài học đầu tiên",
                            earned: profile.completedLessons >= 1,
                            emoji: "🌱",
                        },
                        {
                            title: "Chăm chỉ",
                            desc: "Đạt 100 XP trở lên",
                            earned: profile.xp >= 100,
                            emoji: "⚡",
                        },
                        {
                            title: "Kiên trì",
                            desc: "Duy trì streak 3 ngày",
                            earned: profile.streak >= 3,
                            emoji: "🔥",
                        },
                    ].map((badge) => (
                        <div
                            key={badge.title}
                            className={cn(
                                "rounded-lg border p-3 text-center transition-all",
                                badge.earned
                                    ? "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20"
                                    : "border-border opacity-50 grayscale"
                            )}
                        >
                            <div className="text-2xl mb-1">{badge.emoji}</div>
                            <p className="text-xs font-bold">{badge.title}</p>
                            <p className="text-[10px] text-muted-foreground">{badge.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit Profile Form */}
            <ProfileNameForm currentName={profile.fullName} />
        </div>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<ProfileSkeleton />}>
            <ProfileContent />
        </Suspense>
    );
}
