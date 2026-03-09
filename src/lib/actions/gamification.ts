"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ── Update Level (Placement Test result) ─────────────────

export async function updateLevel(level: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Chưa đăng nhập" };

    const validLevels = ["A0", "A1", "A2", "B1", "B2", "C1", "C2"];
    if (!validLevels.includes(level)) return { error: "Level không hợp lệ" };

    const { error } = await supabase
        .from("profiles")
        .update({ current_level: level })
        .eq("id", user.id);

    if (error) return { error: error.message };

    revalidatePath("/dashboard");
    revalidatePath("/lessons");
    return { success: true };
}

// ── Complete Lesson + Unlock Next ────────────────────────

export async function completeLessonAndUnlockNext(
    lessonId: string,
    correctCount: number,
    totalCount: number
) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Chưa đăng nhập" };

    const xpEarned = correctCount * 10;
    const score = Math.round((correctCount / totalCount) * 100);
    const isCompleted = score >= 60;

    // 1. Add XP to profiles
    const { data: profile } = await supabase
        .from("profiles")
        .select("xp")
        .eq("id", user.id)
        .single();

    if (profile) {
        await supabase
            .from("profiles")
            .update({ xp: profile.xp + xpEarned })
            .eq("id", user.id);
    }

    // 2. Upsert user_progress
    const { data: existing } = await supabase
        .from("user_progress")
        .select("id, score")
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId)
        .single();

    if (existing) {
        await supabase
            .from("user_progress")
            .update({
                is_completed: isCompleted || existing.score >= 60,
                score: Math.max(existing.score, score),
                completed_at: isCompleted ? new Date().toISOString() : null,
            })
            .eq("id", existing.id);
    } else {
        await supabase.from("user_progress").insert({
            user_id: user.id,
            lesson_id: lessonId,
            is_completed: isCompleted,
            score,
            completed_at: isCompleted ? new Date().toISOString() : null,
        });
    }

    // 3. Unlock next lesson (if current is completed)
    if (isCompleted) {
        const { data: currentLesson } = await supabase
            .from("lessons")
            .select("unit_number")
            .eq("id", lessonId)
            .single();

        if (currentLesson) {
            const { data: nextLesson } = await supabase
                .from("lessons")
                .select("id")
                .eq("unit_number", currentLesson.unit_number + 1)
                .single();

            if (nextLesson) {
                await supabase
                    .from("lessons")
                    .update({ is_unlocked: true })
                    .eq("id", nextLesson.id);
            }
        }
    }

    // 4. Update streak
    await updateStreak();

    // 5. Revalidate pages so Dashboard/Lessons auto-refresh
    revalidatePath("/dashboard");
    revalidatePath("/lessons");
    revalidatePath("/leaderboard");

    return { success: true, xpEarned, score, isCompleted };
}
// ── Streak ───────────────────────────────────────────────

export async function updateStreak() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
        .from("profiles")
        .select("current_streak, longest_streak, last_active_date")
        .eq("id", user.id)
        .single();

    if (!profile) return;

    const today = new Date().toISOString().split("T")[0];
    const lastActive = profile.last_active_date;

    if (lastActive === today) return; // already counted today

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    let newStreak: number;
    if (lastActive === yesterdayStr) {
        newStreak = profile.current_streak + 1;
    } else {
        newStreak = 1; // streak broken, reset
    }

    const newLongest = Math.max(newStreak, profile.longest_streak);

    await supabase
        .from("profiles")
        .update({
            current_streak: newStreak,
            longest_streak: newLongest,
            last_active_date: today,
        })
        .eq("id", user.id);

    return { streak: newStreak, longest: newLongest };
}

// ── XP ───────────────────────────────────────────────────

export async function awardXP(amount: number) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
        .from("profiles")
        .select("total_xp")
        .eq("id", user.id)
        .single();

    if (!profile) return;

    const newXP = profile.total_xp + amount;
    await supabase
        .from("profiles")
        .update({ total_xp: newXP })
        .eq("id", user.id);

    return { totalXP: newXP, awarded: amount };
}

// ── Complete Exercise (XP + Streak combo) ────────────────

export async function completeExercise(
    lessonId: string,
    exerciseCount: number,
    correctCount: number
) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Award 10 XP per correct answer
    const xpEarned = correctCount * 10;

    // Update user total_xp
    const { data: profile } = await supabase
        .from("profiles")
        .select("total_xp")
        .eq("id", user.id)
        .single();

    if (profile) {
        await supabase
            .from("profiles")
            .update({ total_xp: profile.total_xp + xpEarned })
            .eq("id", user.id);
    }

    // Update streak
    await updateStreak();

    // Upsert user_progress
    const score = Math.round((correctCount / exerciseCount) * 100);
    const completed = score >= 80;

    const { data: existing } = await supabase
        .from("user_progress")
        .select("id, attempts, score")
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId)
        .single();

    if (existing) {
        await supabase
            .from("user_progress")
            .update({
                score: Math.max(existing.score, score),
                xp_earned: xpEarned,
                completed: completed || existing.score >= 80,
                attempts: existing.attempts + 1,
                completed_at: completed ? new Date().toISOString() : null,
            })
            .eq("id", existing.id);
    } else {
        await supabase.from("user_progress").insert({
            user_id: user.id,
            lesson_id: lessonId,
            score,
            xp_earned: xpEarned,
            completed,
            attempts: 1,
            completed_at: completed ? new Date().toISOString() : null,
        });
    }

    return { xpEarned, score, completed };
}

// ── Leaderboard ──────────────────────────────────────────

export async function getWeeklyLeaderboard() {
    const supabase = await createClient();

    // Get start of current week (Monday)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);

    // Get progress records from this week
    const { data: weeklyProgress } = await supabase
        .from("user_progress")
        .select("user_id, xp_earned")
        .gte("updated_at", monday.toISOString());

    if (!weeklyProgress || weeklyProgress.length === 0) {
        // Fallback: show top users by total_xp
        const { data: topUsers } = await supabase
            .from("profiles")
            .select("id, display_name, avatar_url, total_xp, current_streak")
            .order("total_xp", { ascending: false })
            .limit(10);

        return (topUsers ?? []).map((u, i) => ({
            rank: i + 1,
            userId: u.id,
            displayName: u.display_name,
            avatarUrl: u.avatar_url,
            weeklyXP: u.total_xp,
            streak: u.current_streak,
        }));
    }

    // Aggregate XP per user this week
    const xpMap: Record<string, number> = {};
    weeklyProgress.forEach((p) => {
        xpMap[p.user_id] = (xpMap[p.user_id] ?? 0) + p.xp_earned;
    });

    const userIds = Object.keys(xpMap);
    const { data: users } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, current_streak")
        .in("id", userIds);

    if (!users) return [];

    return users
        .map((u) => ({
            rank: 0,
            userId: u.id,
            displayName: u.display_name,
            avatarUrl: u.avatar_url,
            weeklyXP: xpMap[u.id] ?? 0,
            streak: u.current_streak,
        }))
        .sort((a, b) => b.weeklyXP - a.weeklyXP)
        .slice(0, 10)
        .map((entry, i) => ({ ...entry, rank: i + 1 }));
}

// ── Get current user profile ─────────────────────────────

export async function getCurrentUser() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (!profile) return null;

    // Map profiles table columns → frontend field names
    return {
        id: profile.id,
        email: user.email ?? "",
        display_name: profile.full_name || user.email?.split("@")[0] || "User",
        avatar_url: profile.avatar_url,
        total_xp: profile.xp ?? 0,
        current_streak: profile.streak ?? 0,
        longest_streak: profile.streak ?? 0,
        current_level: profile.current_level ?? "A0",
        created_at: profile.created_at,
    };
}

// ── Leaderboard (real data) ──────────────────────────────

export async function getLeaderboardProfiles() {
    const supabase = await createClient();

    const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, xp, streak, current_level")
        .order("xp", { ascending: false })
        .limit(15);

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (profiles ?? []).map((p) => ({
        id: p.id,
        displayName: p.full_name || "Học viên",
        avatarUrl: p.avatar_url,
        totalXp: p.xp ?? 0,
        streakCount: p.streak ?? 0,
        level: p.current_level ?? "A0",
        isCurrentUser: p.id === user?.id,
    }));
}

// ── Lessons (real data) ──────────────────────────────────

export async function getLessonsFromDB() {
    const supabase = await createClient();

    const { data: lessons } = await supabase
        .from("lessons")
        .select("*")
        .order("unit_number", { ascending: true });

    // Get current user's progress
    const {
        data: { user },
    } = await supabase.auth.getUser();

    let progressMap: Record<string, { is_completed: boolean; score: number }> = {};

    if (user) {
        const { data: progress } = await supabase
            .from("user_progress")
            .select("lesson_id, is_completed, score")
            .eq("user_id", user.id);

        (progress ?? []).forEach((p) => {
            progressMap[p.lesson_id] = {
                is_completed: p.is_completed,
                score: p.score,
            };
        });
    }

    return (lessons ?? []).map((lesson) => {
        const prog = progressMap[lesson.id];
        return {
            id: lesson.id,
            title: lesson.title,
            unitNumber: lesson.unit_number,
            isUnlocked: lesson.is_unlocked,
            isCompleted: prog?.is_completed ?? false,
            score: prog?.score ?? 0,
        };
    });
}
