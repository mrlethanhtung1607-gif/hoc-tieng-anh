import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Skeleton } from "@/components/ui/skeleton";
import { LessonSidebar } from "@/components/lessons/lesson-sidebar";
import { Flashcard } from "@/components/lessons/flashcard";
import { AudioPlayer } from "@/components/lessons/audio-player";

function LessonSidebarSkeleton() {
    return (
        <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
        </div>
    );
}

interface PageProps {
    params: Promise<{ courseId: string; lessonId: string }>;
}

export default async function LessonDetailPage({ params }: PageProps) {
    const { courseId, lessonId } = await params;
    const supabase = await createClient();

    const { data: lesson } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", lessonId)
        .single();

    const { data: exercises } = await supabase
        .from("exercises")
        .select("*")
        .eq("lesson_id", lessonId)
        .order("order_index");

    const { data: lessons } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index");

    if (!lesson) {
        return (
            <div className="text-center py-12">
                <h1 className="text-xl font-bold">Bài học không tồn tại</h1>
                <p className="text-muted-foreground">Vui lòng quay lại và thử lại.</p>
            </div>
        );
    }

    const flashcardExercises = exercises?.filter((e) => e.type === "flashcard") ?? [];
    const audioExercises = exercises?.filter((e) => e.type === "listening") ?? [];

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-6">
                <div className="rounded-xl border bg-card p-4 sm:p-6">
                    <h1 className="text-xl sm:text-2xl font-bold mb-2">{lesson.title}</h1>
                    <p className="text-sm text-muted-foreground">{lesson.description}</p>
                </div>

                {flashcardExercises.length > 0 && (
                    <Flashcard exercises={flashcardExercises} />
                )}

                {audioExercises.length > 0 && (
                    <AudioPlayer exercises={audioExercises} />
                )}
            </div>

            <aside className="lg:w-72 shrink-0">
                <Suspense fallback={<LessonSidebarSkeleton />}>
                    <LessonSidebar
                        lessons={lessons ?? []}
                        courseId={courseId}
                        currentLessonId={lessonId}
                    />
                </Suspense>
            </aside>
        </div>
    );
}
