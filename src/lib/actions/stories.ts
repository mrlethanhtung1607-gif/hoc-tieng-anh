"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ── Get all stories ──────────────────────────────────────
export async function getStories() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: stories } = await supabase
        .from("stories")
        .select("id, title, description, difficulty, hearts_reward, cover_emoji")
        .order("created_at", { ascending: true });

    // Get completed story IDs for current user
    let completedIds: string[] = [];
    if (user) {
        const { data: completed } = await supabase
            .from("user_stories")
            .select("story_id")
            .eq("user_id", user.id);
        completedIds = (completed ?? []).map((c) => c.story_id);
    }

    return (stories ?? []).map((s) => ({
        ...s,
        isCompleted: completedIds.includes(s.id),
    }));
}

// ── Get single story by ID ───────────────────────────────
export async function getStoryById(id: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from("stories")
        .select("*")
        .eq("id", id)
        .single();
    return data;
}

// ── Get a random story ID (for gacha draw) ───────────────
export async function getRandomStoryId() {
    const supabase = await createClient();
    const { data } = await supabase.rpc("get_random_story_id");
    // Fallback: client-side random if RPC not available
    if (!data) {
        const { data: stories } = await supabase
            .from("stories")
            .select("id");
        if (!stories || stories.length === 0) return null;
        return stories[Math.floor(Math.random() * stories.length)].id;
    }
    return data;
}

// ── Complete story: +hearts, update streak ───────────────
export async function completeStory(storyId: string, heartsReward: number) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Chưa đăng nhập" };

    // Check if already completed
    const { data: existing } = await supabase
        .from("user_stories")
        .select("id")
        .eq("user_id", user.id)
        .eq("story_id", storyId)
        .single();

    if (existing) return { error: "Đã hoàn thành trước đó", alreadyCompleted: true };

    // Mark as completed
    const { error: insertError } = await supabase
        .from("user_stories")
        .insert({ user_id: user.id, story_id: storyId });

    if (insertError) return { error: insertError.message };

    // Add hearts (unlimited from stories)
    const { addHearts } = await import("@/lib/actions/hearts");
    await addHearts(heartsReward);

    // Update streak (only +1 per day max)
    const { updateStreak } = await import("@/lib/actions/gamification");
    await updateStreak();

    revalidatePath("/stories");
    revalidatePath("/dashboard");
    revalidatePath("/profile");
    return { success: true, heartsEarned: heartsReward };
}
