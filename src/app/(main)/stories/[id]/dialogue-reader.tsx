"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Volume2, ChevronRight, CheckCircle2, XCircle, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { completeStory } from "@/lib/actions/stories";

// ── Types ────────────────────────────────────────────────
interface DialogueSegment {
    type: "dialogue";
    character: "narrator" | "A" | "B";
    text: string;
    translations: Record<string, string>;
}

interface QuestionSegment {
    type: "question";
    prompt: string;
    options: string[];
    correctIndex: number;
}

type Segment = DialogueSegment | QuestionSegment;

interface Props {
    storyId: string;
    title: string;
    heartsReward: number;
    content: Segment[];
}

// ── Character config ─────────────────────────────────────
const CHARACTERS: Record<string, { name: string; avatar: string; bgColor: string }> = {
    A: { name: "A", avatar: "👩", bgColor: "bg-sky-100 dark:bg-sky-900/30" },
    B: { name: "B", avatar: "👨", bgColor: "bg-amber-100 dark:bg-amber-900/30" },
};

// ── Word with tooltip ────────────────────────────────────
function TranslatedWord({ word, translation, isLast }: { word: string; translation?: string; isLast?: boolean }) {
    const clean = word.replace(/[.,!?;:'"()]/g, "");
    const punct = word.replace(clean, "");
    const space = isLast ? "" : " ";

    if (!translation) return <span>{word}{space}</span>;

    return (
        <>
            <span className="relative inline group/word">
                <span className="cursor-help border-b-2 border-dotted border-muted-foreground/20 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {clean}
                </span>
                {punct && <span>{punct}</span>}
                <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground text-background px-2.5 py-1 text-xs font-medium opacity-0 group-hover/word:opacity-100 transition-opacity z-50 shadow-xl">
                    {translation}
                </span>
            </span>
            {space}
        </>
    );
}

// ── Speak helper (used by bubbles) ───────────────────────
function speakLine(text: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    utterance.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find((v) => v.lang.startsWith("en"));
    if (enVoice) utterance.voice = enVoice;
    window.speechSynthesis.speak(utterance);
}

// ── Dialogue bubble ──────────────────────────────────────
function DialogueBubble({ segment, animate }: { segment: DialogueSegment; animate: boolean }) {
    const isNarrator = segment.character === "narrator";
    const char = CHARACTERS[segment.character];

    const words = segment.text.split(" ");

    if (isNarrator) {
        return (
            <div className={cn("text-center py-4 px-4 transition-all duration-500", animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
                <p className="text-base italic text-muted-foreground leading-loose">
                    {words.map((w, i) => (
                        <TranslatedWord key={i} word={w} translation={segment.translations[w.replace(/[.,!?;:'"()]/g, "")]} isLast={i === words.length - 1} />
                    ))}
                </p>
            </div>
        );
    }

    const isA = segment.character === "A";

    return (
        <div className={cn(
            "flex gap-3 max-w-[88%] transition-all duration-500",
            isA ? "self-start" : "self-end flex-row-reverse",
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
            {/* Avatar */}
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl", char?.bgColor)}>
                {char?.avatar}
            </div>
            {/* Bubble + speaker */}
            <div className="flex flex-col gap-1">
                <div className={cn(
                    "rounded-2xl px-5 py-3.5 text-lg leading-loose shadow-sm",
                    isA
                        ? "bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/50 rounded-tl-sm"
                        : "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-tr-sm"
                )}>
                    {words.map((w, i) => (
                        <TranslatedWord key={i} word={w} translation={segment.translations[w.replace(/[.,!?;:'"()]/g, "")]} isLast={i === words.length - 1} />
                    ))}
                </div>
                <button
                    onClick={() => speakLine(segment.text)}
                    className={cn(
                        "flex items-center gap-1 text-[11px] text-muted-foreground/60 hover:text-indigo-500 transition-colors cursor-pointer w-fit",
                        isA ? "ml-1" : "mr-1 self-end"
                    )}
                    title="Nghe phát âm"
                >
                    <Volume2 className="h-3.5 w-3.5" /> Nghe
                </button>
            </div>
        </div>
    );
}

// ── Inline question ──────────────────────────────────────
function InlineQuestion({
    segment,
    onCorrect,
    animate,
}: {
    segment: QuestionSegment;
    onCorrect: () => void;
    animate: boolean;
}) {
    const [selected, setSelected] = useState<number | null>(null);
    const [answered, setAnswered] = useState(false);
    const isCorrect = selected === segment.correctIndex;

    function handleSelect(idx: number) {
        if (answered) return;
        setSelected(idx);
        setAnswered(true);
        if (idx === segment.correctIndex) {
            setTimeout(onCorrect, 1200);
        }
    }

    return (
        <div className={cn(
            "rounded-2xl border-2 border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/10 p-5 transition-all duration-500",
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
            <p className="text-sm font-bold mb-3 text-center">📝 {segment.prompt}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {segment.options.map((opt, idx) => {
                    let style = "border-border bg-card hover:bg-muted";
                    if (answered && idx === segment.correctIndex) {
                        style = "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400";
                    } else if (answered && idx === selected && !isCorrect) {
                        style = "border-red-400 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400";
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleSelect(idx)}
                            disabled={answered}
                            className={cn(
                                "rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all cursor-pointer text-left",
                                style,
                                !answered && "hover:border-indigo-300"
                            )}
                        >
                            <span className="mr-2 font-bold text-muted-foreground">{String.fromCharCode(65 + idx)}.</span>
                            {opt}
                        </button>
                    );
                })}
            </div>
            {answered && (
                <div className={cn(
                    "flex items-center gap-2 mt-3 text-sm font-bold justify-center",
                    isCorrect ? "text-emerald-600" : "text-red-500"
                )}>
                    {isCorrect ? <><CheckCircle2 className="h-4 w-4" /> Tuyệt vời!</> : <><XCircle className="h-4 w-4" /> Thử lại nhé!</>}
                </div>
            )}
        </div>
    );
}

// ── Confetti ─────────────────────────────────────────────
function Confetti() {
    return (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
            {Array.from({ length: 60 }).map((_, i) => (
                <div
                    key={i}
                    className="absolute animate-[confetti-fall_3s_ease-in-out_forwards]"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `-${Math.random() * 10 + 5}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        backgroundColor: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"][Math.floor(Math.random() * 8)],
                        width: `${Math.random() * 8 + 4}px`,
                        height: `${Math.random() * 8 + 4}px`,
                        borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                        transform: `rotate(${Math.random() * 360}deg)`,
                    }}
                />
            ))}
            <style>{`@keyframes confetti-fall { 0% {opacity:1;transform:translateY(0) rotate(0deg)} 100% {opacity:0;transform:translateY(100vh) rotate(720deg)} }`}</style>
        </div>
    );
}

// ── Main component ───────────────────────────────────────
export default function DialogueReader({ storyId, title, heartsReward, content }: Props) {
    const router = useRouter();
    const [visibleCount, setVisibleCount] = useState(1);
    const [questionAnswered, setQuestionAnswered] = useState<Record<number, boolean>>({});
    const [completed, setCompleted] = useState(false);
    const [claiming, setClaiming] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [toast, setToast] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    const segments = content as Segment[];
    const totalSegments = segments.length;
    const currentSegment = segments[visibleCount - 1];
    const isLastSegment = visibleCount >= totalSegments;
    const currentIsQuestion = currentSegment?.type === "question";
    const currentQuestionAnswered = currentIsQuestion ? questionAnswered[visibleCount - 1] : false;

    // Scroll to bottom when new segment appears
    useEffect(() => {
        if (scrollRef.current) {
            setTimeout(() => {
                scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
            }, 100);
        }
    }, [visibleCount]);

    // Auto-speak when new dialogue appears
    useEffect(() => {
        const seg = segments[visibleCount - 1];
        if (seg?.type === "dialogue") {
            setTimeout(() => speakLine(seg.text), 300);
        }
    }, [visibleCount, segments]);

    function handleContinue() {
        if (isLastSegment) return;
        setVisibleCount((c) => c + 1);
    }

    function handleQuestionCorrect(idx: number) {
        setQuestionAnswered((prev) => ({ ...prev, [idx]: true }));
    }

    async function handleComplete() {
        if (claiming || completed) return;
        setClaiming(true);
        const res = await completeStory(storyId, heartsReward);
        if (res.success || res.alreadyCompleted) {
            setCompleted(true);
            setShowConfetti(true);
            setToast(`🎉 +${heartsReward} Tim! Streak cập nhật!`);
            setTimeout(() => setShowConfetti(false), 4000);
            setTimeout(() => router.push("/stories"), 3000);
        } else {
            setToast(`❌ ${res.error}`);
        }
        setClaiming(false);
    }

    function replayAudio() {
        const seg = segments[visibleCount - 1];
        if (seg?.type === "dialogue") speakLine(seg.text);
    }

    const progress = (visibleCount / totalSegments) * 100;

    return (
        <div className="mx-auto max-w-lg flex flex-col h-[100dvh]">
            {showConfetti && <Confetti />}

            {/* Toast */}
            {toast && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-foreground text-background px-4 py-2 text-sm font-bold shadow-xl animate-in fade-in slide-in-from-top-2">
                    {toast}
                </div>
            )}

            {/* Header */}
            <div className="sticky top-0 z-30 bg-background border-b border-border px-4 py-3 space-y-2">
                <div className="flex items-center justify-between">
                    <button onClick={() => router.push("/stories")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                    <h1 className="text-sm font-bold truncate max-w-[200px]">{title}</h1>
                    <div className="flex items-center gap-2">
                        <button onClick={replayAudio} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer" title="Phát lại">
                            <Volume2 className="h-4 w-4" />
                        </button>
                        <span className="flex items-center gap-1 text-xs font-bold text-pink-500">
                            <Heart className="h-3.5 w-3.5 fill-current" /> +{heartsReward}
                        </span>
                    </div>
                </div>
                {/* Progress bar */}
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Dialogue area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 flex flex-col">
                {segments.slice(0, visibleCount).map((seg, idx) => {
                    const isNew = idx === visibleCount - 1;
                    if (seg.type === "dialogue") {
                        return (
                            <DialogueBubble
                                key={idx}
                                segment={seg}
                                animate={true}
                            />
                        );
                    }
                    if (seg.type === "question") {
                        return (
                            <InlineQuestion
                                key={idx}
                                segment={seg}
                                onCorrect={() => handleQuestionCorrect(idx)}
                                animate={true}
                            />
                        );
                    }
                    return null;
                })}
            </div>

            {/* Bottom action */}
            <div className="sticky bottom-0 z-30 bg-background border-t border-border px-4 py-3">
                {isLastSegment && !completed ? (
                    <Button
                        onClick={handleComplete}
                        disabled={claiming}
                        className="w-full gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-6 shadow-lg cursor-pointer"
                    >
                        {claiming ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                        {claiming ? "Đang xử lý..." : `Hoàn thành & Nhận +${heartsReward} Tim`}
                    </Button>
                ) : completed ? (
                    <div className="text-center text-sm font-bold text-emerald-600">
                        🎉 Hoàn thành! Đang chuyển hướng...
                    </div>
                ) : currentIsQuestion && !currentQuestionAnswered ? (
                    <p className="text-center text-xs text-muted-foreground">
                        📝 Trả lời câu hỏi ở trên để tiếp tục
                    </p>
                ) : (
                    <Button
                        onClick={handleContinue}
                        className="w-full gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-6 shadow-lg cursor-pointer"
                    >
                        Tiếp tục <ChevronRight className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
