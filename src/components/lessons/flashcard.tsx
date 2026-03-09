"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Exercise } from "@/types/database";

interface FlashcardProps {
    exercises: Exercise[];
}

export function Flashcard({ exercises }: FlashcardProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const current = exercises[currentIndex];
    if (!current) return null;

    const goNext = () => {
        if (currentIndex < exercises.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex((i) => i + 1), 150);
        }
    };

    const goPrev = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex((i) => i - 1), 150);
        }
    };

    const reset = () => {
        setIsFlipped(false);
        setTimeout(() => setCurrentIndex(0), 150);
    };

    return (
        <div className="flex flex-col items-center gap-6">
            {/* Progress */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                    {currentIndex + 1}
                </span>
                <span>/</span>
                <span>{exercises.length}</span>
                <div className="ml-2 h-2 w-28 sm:w-40 rounded-full bg-muted overflow-hidden">
                    <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                        style={{
                            width: `${((currentIndex + 1) / exercises.length) * 100}%`,
                        }}
                    />
                </div>
            </div>

            {/* Card */}
            <div
                className="flashcard-container w-full max-w-lg cursor-pointer"
                style={{ perspective: "1200px" }}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <div
                    className={`flashcard-inner relative w-full transition-transform duration-600 ${isFlipped ? "flashcard-flipped" : ""
                        }`}
                    style={{
                        transformStyle: "preserve-3d",
                    }}
                >
                    {/* Front */}
                    <div
                        className="flashcard-face absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-5 sm:p-8 shadow-lg min-h-[240px] sm:min-h-[320px]"
                        style={{ backfaceVisibility: "hidden" }}
                    >
                        <p className="text-center text-xl sm:text-2xl font-bold leading-relaxed">
                            {current.question}
                        </p>
                        {current.options && current.options.length > 0 && (
                            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                                {current.options.map((opt) => (
                                    <span
                                        key={opt}
                                        className="rounded-lg bg-muted px-3 py-1.5 text-sm font-medium"
                                    >
                                        {opt}
                                    </span>
                                ))}
                            </div>
                        )}
                        <p className="mt-6 text-xs text-muted-foreground">
                            Nhấn để lật xem đáp án
                        </p>
                    </div>

                    {/* Back */}
                    <div
                        className="flashcard-face absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-emerald-500/30 bg-emerald-50 p-5 sm:p-8 shadow-lg dark:bg-emerald-950/20 min-h-[240px] sm:min-h-[320px]"
                        style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                        }}
                    >
                        <div className="mb-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                            Đáp án
                        </div>
                        <p className="text-center text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                            {current.correct_answer}
                        </p>
                        {current.explanation && (
                            <p className="mt-4 text-center text-sm text-muted-foreground leading-relaxed">
                                {current.explanation}
                            </p>
                        )}
                        <p className="mt-6 text-xs text-muted-foreground">
                            Nhấn để lật lại
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        goPrev();
                    }}
                    disabled={currentIndex === 0}
                    className="cursor-pointer"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        reset();
                    }}
                    className="cursor-pointer"
                >
                    <RotateCcw className="h-4 w-4" />
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        goNext();
                    }}
                    disabled={currentIndex === exercises.length - 1}
                    className="cursor-pointer"
                >
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}
