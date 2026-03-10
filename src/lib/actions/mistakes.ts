"use server";

import { createClient } from "@/lib/supabase/server";

// ── Save a wrong answer to mistakes table ────────────────
export async function saveMistake(data: {
    questionContent: string;
    options: string[];
    correctAnswer: string;
    userAnswer: string;
    lessonTitle?: string;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Chưa đăng nhập" };

    const { error } = await supabase.from("mistakes").insert({
        user_id: user.id,
        question_content: data.questionContent,
        options: data.options,
        correct_answer: data.correctAnswer,
        user_answer: data.userAnswer,
        lesson_title: data.lessonTitle ?? null,
    });

    if (error) return { error: error.message };
    return { success: true };
}

// ── Get all mistakes for the current user ────────────────
export async function getMistakes() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
        .from("mistakes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return data ?? [];
}

// ── Get mistake count for badge ──────────────────────────
export async function getMistakeCount() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return 0;

    const { count } = await supabase
        .from("mistakes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

    return count ?? 0;
}

// ── Delete a mistake (user answered correctly in review) ─
export async function deleteMistake(id: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Chưa đăng nhập" };

    const { error } = await supabase
        .from("mistakes")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) return { error: error.message };
    return { success: true };
}
