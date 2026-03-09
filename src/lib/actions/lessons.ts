"use server";

import { createClient } from "@/lib/supabase/server";
import type { Lesson, Exercise, LessonWithProgress } from "@/types/database";

export async function getLessonWithExercises(lessonId: string) {
    const supabase = await createClient();

    const [lessonRes, exercisesRes] = await Promise.all([
        supabase
            .from("lessons")
            .select("*")
            .eq("id", lessonId)
            .single(),
        supabase
            .from("exercises")
            .select("*")
            .eq("lesson_id", lessonId)
            .order("order", { ascending: true }),
    ]);

    if (lessonRes.error) throw new Error(lessonRes.error.message);

    return {
        lesson: lessonRes.data as Lesson,
        exercises: (exercisesRes.data ?? []) as Exercise[],
    };
}

export async function getCourseLessons(courseId: string) {
    const supabase = await createClient();

    const { data: user } = await supabase.auth.getUser();

    const { data: lessons, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", courseId)
        .eq("is_published", true)
        .order("order", { ascending: true });

    if (error) throw new Error(error.message);

    if (!user.user) {
        return (lessons ?? []).map((l) => ({
            ...l,
            progress: null,
        })) as LessonWithProgress[];
    }

    const { data: progress } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.user.id)
        .in(
            "lesson_id",
            (lessons ?? []).map((l) => l.id)
        );

    const progressMap = new Map(
        (progress ?? []).map((p) => [p.lesson_id, p])
    );

    return (lessons ?? []).map((l) => ({
        ...l,
        progress: progressMap.get(l.id) ?? null,
    })) as LessonWithProgress[];
}

export async function getCourseInfo(courseId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("courses")
        .select("*, levels(*)")
        .eq("id", courseId)
        .single();

    if (error) throw new Error(error.message);
    return data;
}
