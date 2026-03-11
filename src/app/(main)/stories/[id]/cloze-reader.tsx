"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Heart,
    CheckCircle2,
    Sparkles,
    Trophy,
    Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { completeStory } from "@/lib/actions/stories";

// ── Parser: split content into text, gap, and hinted-gap segments
interface TextSegment { type: "text"; value: string }
interface GapSegment { type: "gap"; answer: string; hint?: string; index: number }
type Segment = TextSegment | GapSegment;

function parseContent(content: string): Segment[] {
    const segments: Segment[] = [];
    // Matches: [Vietnamese hint]{English answer} OR ({English answer})
    const regex = /\[([^\]]+)\]\{([^}]+)\}|\(\{([^}]+)\}\)/g;
    let lastIndex = 0;
    let gapIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
        if (match.index > lastIndex) {
            segments.push({ type: "text", value: content.slice(lastIndex, match.index) });
        }
        if (match[1] !== undefined && match[2] !== undefined) {
            // [hint]{answer} syntax
            segments.push({ type: "gap", hint: match[1], answer: match[2], index: gapIndex++ });
        } else {
            // ({answer}) syntax (legacy)
            segments.push({ type: "gap", answer: match[3], index: gapIndex++ });
        }
        lastIndex = regex.lastIndex;
    }
    if (lastIndex < content.length) {
        segments.push({ type: "text", value: content.slice(lastIndex) });
    }
    return segments;
}

// ── Confetti effect ──────────────────────────────────────
function Confetti() {
    const colors = ["#10b981", "#f59e0b", "#3b82f6", "#ec4899", "#8b5cf6", "#ef4444"];
    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {Array.from({ length: 60 }).map((_, i) => (
                <div
                    key={i}
                    className="absolute animate-confetti"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: "-10px",
                        width: `${6 + Math.random() * 8}px`,
                        height: `${6 + Math.random() * 8}px`,
                        backgroundColor: colors[i % colors.length],
                        borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${2 + Math.random() * 2}s`,
                    }}
                />
            ))}
            <style>{`
                @keyframes confetti-fall {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
                .animate-confetti {
                    animation: confetti-fall linear forwards;
                }
            `}</style>
        </div>
    );
}

// ── Tooltip Hint ─────────────────────────────────────────
function HintText({ hint, answer }: { hint: string; answer: string }) {
    return (
        <span className="relative inline-block group cursor-help">
            <span className="border-b-2 border-dotted border-muted-foreground/40 text-foreground/80 transition-colors group-hover:border-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                {hint}
            </span>
            {/* Tooltip bubble */}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none shadow-lg z-10">
                {answer}
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100" />
            </span>
        </span>
    );
}

// ── Inline Gap Input ─────────────────────────────────────
function GapInput({
    answer,
    value,
    onChange,
    status,
}: {
    answer: string;
    value: string;
    onChange: (v: string) => void;
    status: "idle" | "correct" | "incorrect";
}) {
    const width = Math.max(answer.length * 10 + 24, 60);

    return (
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={status === "correct"}
            placeholder="..."
            className={cn(
                "inline-block mx-0.5 px-2 py-0.5 text-sm font-medium rounded-md border-2 text-center transition-all align-baseline focus:outline-none focus:ring-2 focus:ring-offset-1",
                status === "correct"
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-600"
                    : status === "incorrect"
                        ? "border-red-400 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300 dark:border-red-600 focus:ring-red-400/30"
                        : "border-indigo-300 bg-white dark:bg-background dark:border-indigo-700 focus:ring-indigo-400/30"
            )}
            style={{ width: `${width}px` }}
        />
    );
}

// ── Main Component ───────────────────────────────────────
interface ClozeReaderProps {
    storyId: string;
    title: string;
    content: string;
    heartsReward: number;
    difficulty: string;
    coverEmoji: string;
}

export function ClozeReader({
    storyId,
    title,
    content,
    heartsReward,
    difficulty,
    coverEmoji,
}: ClozeReaderProps) {
    const router = useRouter();
    const segments = useMemo(() => parseContent(content), [content]);
    const totalGaps = useMemo(() => segments.filter((s) => s.type === "gap").length, [segments]);

    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [statuses, setStatuses] = useState<Record<number, "idle" | "correct" | "incorrect">>({});
    const [correctCount, setCorrectCount] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [claiming, setClaiming] = useState(false);
    const [toast, setToast] = useState("");

    const allCorrect = correctCount === totalGaps && totalGaps > 0;

    const handleGapChange = useCallback((index: number, value: string, answer: string) => {
        setAnswers((prev) => ({ ...prev, [index]: value }));

        // Real-time check (case-insensitive)
        if (value.trim().toLowerCase() === answer.trim().toLowerCase()) {
            setStatuses((prev) => {
                if (prev[index] === "correct") return prev;
                return { ...prev, [index]: "correct" };
            });
            setCorrectCount((c) => {
                // Only increment if not already correct
                if (statuses[index] !== "correct") return c + 1;
                return c;
            });
        } else if (value.trim().length > 0) {
            setStatuses((prev) => ({ ...prev, [index]: "incorrect" }));
        } else {
            setStatuses((prev) => ({ ...prev, [index]: "idle" }));
        }
    }, [statuses]);

    async function handleClaim() {
        if (!allCorrect || claiming || completed) return;
        setClaiming(true);

        const res = await completeStory(storyId, heartsReward);

        if (res.success || res.alreadyCompleted) {
            setCompleted(true);
            setShowConfetti(true);
            setToast(`🎉 Nhận được +${heartsReward} Tim! Streak đã được cập nhật!`);
            setTimeout(() => setShowConfetti(false), 4000);
            setTimeout(() => setToast(""), 5000);
            // Auto-redirect back to stories after 3s
            setTimeout(() => router.push("/stories"), 3000);
        } else {
            setToast(`❌ ${res.error}`);
            setTimeout(() => setToast(""), 3000);
        }

        setClaiming(false);
    }

    const progress = totalGaps > 0 ? (correctCount / totalGaps) * 100 : 0;

    return (
        <div className="mx-auto max-w-2xl space-y-5 pb-8">
            {showConfetti && <Confetti />}

            {/* Toast */}
            {toast && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-card border border-border shadow-xl px-4 py-3 text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-300">
                    {toast}
                </div>
            )}

            {/* Header */}
            <div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer gap-1.5 mb-2 -ml-2"
                    onClick={() => router.push("/stories")}
                >
                    <ArrowLeft className="h-4 w-4" /> Quay lại
                </Button>
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{coverEmoji}</span>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black">{title}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full px-2 py-0.5">
                                {difficulty}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] text-pink-500 font-medium">
                                <Heart className="h-3 w-3 fill-current" /> +{heartsReward} Tim
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                        className={cn(
                            "h-full rounded-full transition-all duration-700",
                            allCorrect
                                ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                                : "bg-gradient-to-r from-indigo-400 to-sky-500"
                        )}
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <span className="text-xs font-bold text-muted-foreground shrink-0">
                    {correctCount}/{totalGaps}
                </span>
            </div>

            {/* Story content with inline inputs */}
            <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
                <div className="text-base leading-[2.2] select-none">
                    {segments.map((seg, i) => {
                        if (seg.type === "text") {
                            const parts = seg.value.split("\n");
                            return parts.map((part, j) => (
                                <span key={`t${i}-${j}`}>
                                    {j > 0 && <br />}
                                    {part}
                                </span>
                            ));
                        }
                        // Gap with Vietnamese hint → HintText + GapInput
                        if (seg.hint) {
                            return (
                                <span key={`g${seg.index}`} className="inline">
                                    <HintText hint={seg.hint} answer={seg.answer} />
                                    {" "}
                                    <GapInput
                                        answer={seg.answer}
                                        value={answers[seg.index] ?? ""}
                                        onChange={(v) => handleGapChange(seg.index, v, seg.answer)}
                                        status={statuses[seg.index] ?? "idle"}
                                    />
                                </span>
                            );
                        }
                        // Standalone gap (legacy)
                        return (
                            <GapInput
                                key={`g${seg.index}`}
                                answer={seg.answer}
                                value={answers[seg.index] ?? ""}
                                onChange={(v) => handleGapChange(seg.index, v, seg.answer)}
                                status={statuses[seg.index] ?? "idle"}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Completion section */}
            {allCorrect && !completed && (
                <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20 p-5 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mx-auto mb-3">
                        <Trophy className="h-7 w-7 text-emerald-600" />
                    </div>
                    <h3 className="font-black text-lg text-emerald-700 dark:text-emerald-400 mb-1">
                        Hoàn hảo! 100% chính xác! ✨
                    </h3>
                    <p className="text-xs text-emerald-600/70 dark:text-emerald-400/60 mb-4">
                        Bạn đã điền đúng tất cả {totalGaps} chỗ trống
                    </p>
                    <Button
                        onClick={handleClaim}
                        disabled={claiming}
                        className="cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
                    >
                        {claiming ? (
                            <>Đang xử lý...</>
                        ) : (
                            <>
                                <Heart className="h-4 w-4" /> Hoàn thành & Nhận +{heartsReward} Tim
                                <Flame className="h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>
            )}

            {completed && (
                <div className="rounded-xl border-2 border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 p-5 text-center animate-in fade-in duration-500">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 mx-auto mb-3">
                        <CheckCircle2 className="h-7 w-7 text-amber-600" />
                    </div>
                    <h3 className="font-black text-amber-700 dark:text-amber-400">Đã hoàn thành! 🎉</h3>
                    <p className="text-xs text-amber-600/70 mt-1 mb-3">
                        +{heartsReward} Tim đã được cộng vào hồ sơ của bạn
                    </p>
                    <Button
                        variant="outline"
                        className="cursor-pointer gap-2"
                        onClick={() => router.push("/stories")}
                    >
                        <Sparkles className="h-4 w-4" /> Chọn truyện khác
                    </Button>
                </div>
            )}
        </div>
    );
}
