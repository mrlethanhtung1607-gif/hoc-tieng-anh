"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// ── Helpers ──────────────────────────────────────────────

async function adminClient() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") throw new Error("Not authorized");
    return supabase;
}

// ── Dashboard Stats ──────────────────────────────────────

export async function getAdminStats() {
    const supabase = await adminClient();

    const [
        { count: userCount },
        { count: courseCount },
        { count: lessonCount },
        { count: exerciseCount },
    ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("courses").select("*", { count: "exact", head: true }),
        supabase.from("lessons").select("*", { count: "exact", head: true }),
        supabase.from("exercises").select("*", { count: "exact", head: true }),
    ]);

    return {
        users: userCount ?? 0,
        courses: courseCount ?? 0,
        lessons: lessonCount ?? 0,
        exercises: exerciseCount ?? 0,
    };
}

export async function getUserRegistrationTrend() {
    const supabase = await adminClient();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data } = await supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", thirtyDaysAgo.toISOString())
        .order("created_at", { ascending: true });

    // Group by date
    const grouped: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
        const d = new Date();
        d.setDate(d.getDate() - 29 + i);
        grouped[d.toISOString().split("T")[0]] = 0;
    }

    (data ?? []).forEach((u) => {
        const date = u.created_at.split("T")[0];
        if (grouped[date] !== undefined) grouped[date]++;
    });

    return Object.entries(grouped).map(([date, count]) => ({
        date: date.slice(5), // MM-DD
        users: count,
    }));
}

export async function getPopularCourses() {
    const supabase = await adminClient();

    const { data: progress } = await supabase
        .from("user_progress")
        .select("lesson_id");

    const { data: lessons } = await supabase
        .from("lessons")
        .select("id, course_id");

    const { data: courses } = await supabase
        .from("courses")
        .select("id, title");

    if (!progress || !lessons || !courses) return [];

    // Count progress entries per course
    const lessonToCourse = new Map(
        lessons.map((l) => [l.id, l.course_id])
    );

    const courseCountMap: Record<string, number> = {};
    progress.forEach((p) => {
        const courseId = lessonToCourse.get(p.lesson_id);
        if (courseId) {
            courseCountMap[courseId] = (courseCountMap[courseId] ?? 0) + 1;
        }
    });

    return courses
        .map((c) => ({
            name: c.title.length > 20 ? c.title.slice(0, 20) + "…" : c.title,
            students: courseCountMap[c.id] ?? 0,
        }))
        .sort((a, b) => b.students - a.students)
        .slice(0, 5);
}

// ── Course CRUD ──────────────────────────────────────────

export async function getAdminCourses() {
    const supabase = await adminClient();
    const { data } = await supabase
        .from("courses")
        .select("*, levels(name)")
        .order("order", { ascending: true });
    return data ?? [];
}

export async function createCourse(formData: FormData) {
    const supabase = await adminClient();

    const { error } = await supabase.from("courses").insert({
        level_id: formData.get("level_id") as string,
        title: formData.get("title") as string,
        slug: formData.get("slug") as string,
        description: (formData.get("description") as string) || null,
        order: parseInt(formData.get("order") as string) || 0,
        is_published: formData.get("is_published") === "true",
    });

    if (error) throw new Error(error.message);
    revalidatePath("/admin/courses");
    redirect("/admin/courses");
}

export async function updateCourse(formData: FormData) {
    const supabase = await adminClient();
    const id = formData.get("id") as string;

    const { error } = await supabase
        .from("courses")
        .update({
            level_id: formData.get("level_id") as string,
            title: formData.get("title") as string,
            slug: formData.get("slug") as string,
            description: (formData.get("description") as string) || null,
            order: parseInt(formData.get("order") as string) || 0,
            is_published: formData.get("is_published") === "true",
        })
        .eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/courses");
    redirect("/admin/courses");
}

export async function deleteCourse(formData: FormData) {
    const supabase = await adminClient();
    const id = formData.get("id") as string;

    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/courses");
}

// ── Lesson CRUD ──────────────────────────────────────────

export async function getAdminLessons(courseId: string) {
    const supabase = await adminClient();
    const { data } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", courseId)
        .order("order", { ascending: true });
    return data ?? [];
}

export async function createLesson(formData: FormData) {
    const supabase = await adminClient();
    const courseId = formData.get("course_id") as string;

    const { error } = await supabase.from("lessons").insert({
        course_id: courseId,
        title: formData.get("title") as string,
        slug: formData.get("slug") as string,
        skill: formData.get("skill") as string,
        description: (formData.get("description") as string) || null,
        xp_reward: parseInt(formData.get("xp_reward") as string) || 50,
        estimated_minutes: parseInt(formData.get("estimated_minutes") as string) || 10,
        order: parseInt(formData.get("order") as string) || 0,
        is_published: formData.get("is_published") === "true",
    });

    if (error) throw new Error(error.message);
    revalidatePath(`/admin/courses/${courseId}`);
    redirect(`/admin/courses/${courseId}`);
}

export async function updateLesson(formData: FormData) {
    const supabase = await adminClient();
    const id = formData.get("id") as string;
    const courseId = formData.get("course_id") as string;

    const { error } = await supabase
        .from("lessons")
        .update({
            title: formData.get("title") as string,
            slug: formData.get("slug") as string,
            skill: formData.get("skill") as string,
            description: (formData.get("description") as string) || null,
            xp_reward: parseInt(formData.get("xp_reward") as string) || 50,
            estimated_minutes: parseInt(formData.get("estimated_minutes") as string) || 10,
            order: parseInt(formData.get("order") as string) || 0,
            is_published: formData.get("is_published") === "true",
        })
        .eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath(`/admin/courses/${courseId}`);
    redirect(`/admin/courses/${courseId}`);
}

export async function deleteLesson(formData: FormData) {
    const supabase = await adminClient();
    const id = formData.get("id") as string;
    const courseId = formData.get("course_id") as string;

    const { error } = await supabase.from("lessons").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath(`/admin/courses/${courseId}`);
}

// ── Exercise CRUD ────────────────────────────────────────

export async function getAdminExercises(lessonId: string) {
    const supabase = await adminClient();
    const { data } = await supabase
        .from("exercises")
        .select("*")
        .eq("lesson_id", lessonId)
        .order("order", { ascending: true });
    return data ?? [];
}

export async function createExercise(formData: FormData) {
    const supabase = await adminClient();
    const lessonId = formData.get("lesson_id") as string;
    const courseId = formData.get("course_id") as string;

    const optionsRaw = formData.get("options") as string;
    let options = null;
    if (optionsRaw?.trim()) {
        try {
            options = JSON.parse(optionsRaw);
        } catch {
            options = optionsRaw.split(",").map((s) => s.trim()).filter(Boolean);
        }
    }

    const { error } = await supabase.from("exercises").insert({
        lesson_id: lessonId,
        type: formData.get("type") as string,
        question: formData.get("question") as string,
        options,
        correct_answer: formData.get("correct_answer") as string,
        explanation: (formData.get("explanation") as string) || null,
        media_url: (formData.get("media_url") as string) || null,
        order: parseInt(formData.get("order") as string) || 0,
    });

    if (error) throw new Error(error.message);
    revalidatePath(`/admin/courses/${courseId}/lessons/${lessonId}`);
    redirect(`/admin/courses/${courseId}/lessons/${lessonId}`);
}

export async function updateExercise(formData: FormData) {
    const supabase = await adminClient();
    const id = formData.get("id") as string;
    const lessonId = formData.get("lesson_id") as string;
    const courseId = formData.get("course_id") as string;

    const optionsRaw = formData.get("options") as string;
    let options = null;
    if (optionsRaw?.trim()) {
        try {
            options = JSON.parse(optionsRaw);
        } catch {
            options = optionsRaw.split(",").map((s) => s.trim()).filter(Boolean);
        }
    }

    const { error } = await supabase
        .from("exercises")
        .update({
            type: formData.get("type") as string,
            question: formData.get("question") as string,
            options,
            correct_answer: formData.get("correct_answer") as string,
            explanation: (formData.get("explanation") as string) || null,
            media_url: (formData.get("media_url") as string) || null,
            order: parseInt(formData.get("order") as string) || 0,
        })
        .eq("id", id);

    if (error) throw new Error(error.message);
    revalidatePath(`/admin/courses/${courseId}/lessons/${lessonId}`);
    redirect(`/admin/courses/${courseId}/lessons/${lessonId}`);
}

export async function deleteExercise(formData: FormData) {
    const supabase = await adminClient();
    const id = formData.get("id") as string;
    const lessonId = formData.get("lesson_id") as string;
    const courseId = formData.get("course_id") as string;

    const { error } = await supabase.from("exercises").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath(`/admin/courses/${courseId}/lessons/${lessonId}`);
}

// ── Levels (read-only for selects) ───────────────────────

export async function getAdminLevels() {
    const supabase = await adminClient();
    const { data } = await supabase
        .from("levels")
        .select("*")
        .order("order", { ascending: true });
    return data ?? [];
}
