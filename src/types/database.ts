// ============================================================
// TypeScript types matching the Supabase schema
// ============================================================

export type UserRole = "admin" | "student";
export type LearningGoal = "travel" | "work" | "exam" | "fun";
export type CEFRLevel = "Pre-A1" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type AgeCategory = "kids" | "teens" | "adults";

export type SkillType =
    | "listening"
    | "speaking"
    | "reading"
    | "writing"
    | "grammar"
    | "vocabulary";

export type ExerciseType =
    | "multiple_choice"
    | "fill_blank"
    | "listening"
    | "speaking"
    | "matching"
    | "translation"
    | "reorder";

// ---- Tables ----

export interface User {
    id: string;
    email: string;
    display_name: string;
    avatar_url: string | null;
    age: number | null;
    role: UserRole;
    learning_goal: LearningGoal | null;
    total_xp: number;
    current_streak: number;
    longest_streak: number;
    last_active_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface Level {
    id: string;
    name: string;
    slug: string;
    cefr: CEFRLevel | null;
    category: AgeCategory;
    description: string | null;
    icon_url: string | null;
    order: number;
    created_at: string;
}

export interface Course {
    id: string;
    level_id: string;
    title: string;
    slug: string;
    description: string | null;
    thumbnail_url: string | null;
    order: number;
    is_published: boolean;
    created_at: string;
}

export interface Lesson {
    id: string;
    course_id: string;
    title: string;
    slug: string;
    skill: SkillType;
    description: string | null;
    xp_reward: number;
    estimated_minutes: number;
    order: number;
    is_published: boolean;
    created_at: string;
}

export interface Exercise {
    id: string;
    lesson_id: string;
    type: ExerciseType;
    question: string;
    options: string[] | null;
    correct_answer: string;
    explanation: string | null;
    media_url: string | null;
    order: number;
    created_at: string;
}

export interface UserProgress {
    id: string;
    user_id: string;
    lesson_id: string;
    score: number;
    xp_earned: number;
    completed: boolean;
    attempts: number;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
}

// ---- Joined / enriched types ----

export interface LessonWithProgress extends Lesson {
    progress: UserProgress | null;
}

export interface CourseWithLessons extends Course {
    lessons: LessonWithProgress[];
}

export interface LevelWithCourses extends Level {
    courses: CourseWithLessons[];
}
