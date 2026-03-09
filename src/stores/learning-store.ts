import { create } from "zustand";
import type { Level, Course, Lesson } from "@/types/database";

interface LearningState {
    levels: Level[];
    currentLevel: Level | null;
    currentCourse: Course | null;
    currentLesson: Lesson | null;
    setLevels: (levels: Level[]) => void;
    setCurrentLevel: (level: Level | null) => void;
    setCurrentCourse: (course: Course | null) => void;
    setCurrentLesson: (lesson: Lesson | null) => void;
    reset: () => void;
}

export const useLearningStore = create<LearningState>((set) => ({
    levels: [],
    currentLevel: null,
    currentCourse: null,
    currentLesson: null,
    setLevels: (levels) => set({ levels }),
    setCurrentLevel: (currentLevel) => set({ currentLevel }),
    setCurrentCourse: (currentCourse) => set({ currentCourse }),
    setCurrentLesson: (currentLesson) => set({ currentLesson }),
    reset: () =>
        set({
            levels: [],
            currentLevel: null,
            currentCourse: null,
            currentLesson: null,
        }),
}));
