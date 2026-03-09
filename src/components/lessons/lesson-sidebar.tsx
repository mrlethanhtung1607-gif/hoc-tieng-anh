"use client";

import Link from "next/link";
import {
    BookOpen,
    Headphones,
    Mic,
    PenLine,
    BookType,
    MessageSquare,
    Lock,
    Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LessonWithProgress, SkillType } from "@/types/database";

const SKILL_CONFIG: Record<SkillType, { icon: typeof BookOpen; label: string }> = {
    vocabulary: { icon: BookType, label: "Từ vựng" },
    listening: { icon: Headphones, label: "Nghe" },
    speaking: { icon: Mic, label: "Nói" },
    reading: { icon: BookOpen, label: "Đọc" },
    writing: { icon: PenLine, label: "Viết" },
    grammar: { icon: MessageSquare, label: "Ngữ pháp" },
};

interface LessonSidebarProps {
    lessons: LessonWithProgress[];
    currentLessonId: string;
    courseId: string;
}

export function LessonSidebar({
    lessons,
    currentLessonId,
    courseId,
}: LessonSidebarProps) {
    // Determine which lessons are unlocked:
    // A lesson is unlocked if:
    //   1) It's the first lesson, OR
    //   2) The previous lesson is completed (score >= 80)
    const unlockedSet = new Set<string>();
    for (let i = 0; i < lessons.length; i++) {
        if (i === 0) {
            unlockedSet.add(lessons[i].id);
        } else {
            const prev = lessons[i - 1];
            if (prev.progress?.completed) {
                unlockedSet.add(lessons[i].id);
            }
        }
        // Always unlock the current lesson and completed lessons
        if (lessons[i].progress?.completed) {
            unlockedSet.add(lessons[i].id);
        }
    }
    // Always unlock the current lesson being viewed
    unlockedSet.add(currentLessonId);

    return (
        <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
                <h3 className="text-sm font-semibold">Bài học trong khóa</h3>
            </div>
            <ul className="divide-y divide-border">
                {lessons.map((lesson) => {
                    const isCurrent = lesson.id === currentLessonId;
                    const isCompleted = lesson.progress?.completed ?? false;
                    const isUnlocked = unlockedSet.has(lesson.id);
                    const config = SKILL_CONFIG[lesson.skill];
                    const Icon = config?.icon ?? BookOpen;

                    if (!isUnlocked && !isCurrent) {
                        return (
                            <li
                                key={lesson.id}
                                className="flex items-center gap-3 px-4 py-3 opacity-40"
                            >
                                <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm text-muted-foreground">
                                        {lesson.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {config?.label} · {lesson.estimated_minutes} phút
                                    </p>
                                </div>
                            </li>
                        );
                    }

                    return (
                        <li key={lesson.id}>
                            <Link
                                href={`/courses/${courseId}/lessons/${lesson.id}`}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50",
                                    isCurrent &&
                                    "bg-emerald-50 border-l-2 border-emerald-500 dark:bg-emerald-950/30"
                                )}
                            >
                                <div
                                    className={cn(
                                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                                        isCurrent
                                            ? "bg-emerald-500 text-white"
                                            : isCompleted
                                                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400"
                                                : "bg-muted text-muted-foreground"
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Icon className="h-4 w-4" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p
                                        className={cn(
                                            "truncate text-sm font-medium",
                                            isCurrent && "text-emerald-700 dark:text-emerald-300"
                                        )}
                                    >
                                        {lesson.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {config?.label} · {lesson.xp_reward} XP · {lesson.estimated_minutes} phút
                                    </p>
                                </div>
                                {isCompleted && (
                                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                        {lesson.progress?.score}%
                                    </span>
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
