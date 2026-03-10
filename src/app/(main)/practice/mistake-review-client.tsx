"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    CheckCircle2,
    XCircle,
    ChevronRight,
    Trash2,
    RotateCcw,
    Sparkles,
    Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { deleteMistake } from "@/lib/actions/mistakes";

interface Mistake {
    id: string;
    question_content: string;
    options: string[];
    correct_answer: string;
    user_answer: string;
    lesson_title: string | null;
    created_at: string;
}

export function MistakeReviewClient({ mistakes: initial }: { mistakes: Mistake[] }) {
    const router = useRouter();
    const [mistakes, setMistakes] = useState(initial);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">("idle");
    const [resolved, setResolved] = useState(0);

    const total = mistakes.length;
    const current = mistakes[currentIndex];

    // All done!
    if (!current || currentIndex >= total) {
        return (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mx-auto mb-4">
                    <Trophy className="h-8 w-8 text-emerald-500" />
                </div>
                <h2 className="text-lg font-black mb-2">Ôn tập hoàn tất! 🎉</h2>
                <p className="text-sm text-muted-foreground mb-1">
                    Bạn đã trả lời đúng <span className="font-bold text-emerald-600">{resolved}</span> / {total} câu hỏi
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                    Các câu trả lời đúng đã được xóa khỏi danh sách ôn tập
                </p>
                <Button
                    className="cursor-pointer gap-2"
                    onClick={() => router.refresh()}
                >
                    <RotateCcw className="h-4 w-4" /> Ôn tập lại
                </Button>
            </div>
        );
    }

    const progress = ((currentIndex) / total) * 100;

    function handleSelect(index: number) {
        if (feedback !== "idle") return;
        setSelectedOption(index);
    }

    async function handleCheck() {
        if (selectedOption === null) return;
        const isCorrect = current.options[selectedOption] === current.correct_answer;

        if (isCorrect) {
            setFeedback("correct");
            setResolved((r) => r + 1);
            // Remove from database — "debt paid"
            await deleteMistake(current.id);
        } else {
            setFeedback("incorrect");
        }
    }

    function handleNext() {
        setCurrentIndex((i) => i + 1);
        setSelectedOption(null);
        setFeedback("idle");
    }

    return (
        <div className="space-y-4">
            {/* Progress */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <span className="text-xs font-medium text-muted-foreground shrink-0">
                    {currentIndex + 1} / {total}
                </span>
            </div>

            {/* Question Card */}
            <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
                {/* Lesson tag */}
                {current.lesson_title && (
                    <span className="inline-block text-[10px] font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full px-2.5 py-0.5 mb-3">
                        📖 {current.lesson_title}
                    </span>
                )}

                <h3 className="text-base sm:text-lg font-bold mb-4">{current.question_content}</h3>

                {/* Options */}
                <div className="space-y-2.5">
                    {current.options.map((opt, i) => {
                        const isSelected = selectedOption === i;
                        const isCorrectOption = opt === current.correct_answer;

                        let optionStyle = "border-border bg-background hover:bg-muted";
                        if (feedback !== "idle") {
                            if (isCorrectOption) {
                                optionStyle = "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30";
                            } else if (isSelected && !isCorrectOption) {
                                optionStyle = "border-red-400 bg-red-50 dark:bg-red-950/30";
                            }
                        } else if (isSelected) {
                            optionStyle = "border-orange-400 bg-orange-50 dark:bg-orange-950/20";
                        }

                        return (
                            <button
                                key={i}
                                type="button"
                                onClick={() => handleSelect(i)}
                                disabled={feedback !== "idle"}
                                className={cn(
                                    "flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all cursor-pointer text-left disabled:cursor-default",
                                    optionStyle
                                )}
                            >
                                <span className={cn(
                                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold border",
                                    isSelected && feedback === "idle"
                                        ? "border-orange-400 bg-orange-500 text-white"
                                        : feedback !== "idle" && isCorrectOption
                                            ? "border-emerald-400 bg-emerald-500 text-white"
                                            : "border-border bg-muted"
                                )}>
                                    {feedback !== "idle" && isCorrectOption ? (
                                        <CheckCircle2 className="h-4 w-4" />
                                    ) : feedback !== "idle" && isSelected && !isCorrectOption ? (
                                        <XCircle className="h-4 w-4" />
                                    ) : (
                                        String.fromCharCode(65 + i)
                                    )}
                                </span>
                                {opt}
                            </button>
                        );
                    })}
                </div>

                {/* Feedback */}
                {feedback !== "idle" && (
                    <div className={cn(
                        "mt-4 rounded-lg px-4 py-3 text-sm animate-in fade-in slide-in-from-bottom-2 duration-300",
                        feedback === "correct"
                            ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
                            : "bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-300"
                    )}>
                        {feedback === "correct" ? (
                            <p className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                <span className="font-bold">Chính xác!</span> Câu này đã được xóa khỏi danh sách ôn tập ✨
                            </p>
                        ) : (
                            <p className="flex items-center gap-2">
                                <XCircle className="h-4 w-4 text-red-500" />
                                <span className="font-bold">Chưa đúng.</span> Đáp án đúng: <span className="font-bold">{current.correct_answer}</span>
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Action buttons */}
            <div className="flex justify-end">
                {feedback === "idle" ? (
                    <Button
                        onClick={handleCheck}
                        disabled={selectedOption === null}
                        className="cursor-pointer gap-2 bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-40"
                    >
                        Kiểm tra
                    </Button>
                ) : (
                    <Button
                        onClick={handleNext}
                        className="cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        Câu tiếp theo <ChevronRight className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
