// Streak milestone definitions — pure utility, no "use server"

export const STREAK_MILESTONES = [
    { days: 3, badge: "🔥", title: "3 ngày liên tiếp", color: "text-orange-500" },
    { days: 7, badge: "⚡", title: "1 tuần kiên trì", color: "text-amber-500" },
    { days: 14, badge: "🌟", title: "2 tuần không nghỉ", color: "text-yellow-500" },
    { days: 30, badge: "💎", title: "1 tháng bền bỉ", color: "text-sky-500" },
    { days: 60, badge: "👑", title: "2 tháng huyền thoại", color: "text-indigo-500" },
    { days: 100, badge: "🏆", title: "100 ngày - Bậc thầy", color: "text-emerald-500" },
];

export function getAchievedMilestones(streak: number) {
    return STREAK_MILESTONES.filter((m) => streak >= m.days);
}

export function getNextMilestone(streak: number) {
    return STREAK_MILESTONES.find((m) => streak < m.days) ?? null;
}
