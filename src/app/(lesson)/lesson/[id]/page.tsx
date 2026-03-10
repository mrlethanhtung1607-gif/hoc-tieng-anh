"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    X,
    Heart,
    CheckCircle2,
    XCircle,
    ArrowRight,
    Trophy,
    Sparkles,
    Zap,
    Volume2,
    Loader2,
    BrainCircuit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { completeLessonAndUnlockNext } from "@/lib/actions/gamification";

// ── Types ────────────────────────────────────────────────
interface MultipleChoiceQuestion {
    id: string;
    type: "multiple_choice";
    prompt: string;
    promptTranslation: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
}

interface FlashcardQuestion {
    id: string;
    type: "flashcard";
    word: string;
    phonetic: string;
    meaning: string;
    example: string;
    exampleTranslation: string;
}

type Question = MultipleChoiceQuestion | FlashcardQuestion;

// ── Fallback mock data (used when AI is unavailable) ─────
const FALLBACK_QUESTIONS: Question[] = [
    { id: "q1", type: "flashcard", word: "Hello", phonetic: "/həˈloʊ/", meaning: "Xin chào", example: "Hello, how are you today?", exampleTranslation: "Xin chào, hôm nay bạn khỏe không?" },
    { id: "q2", type: "multiple_choice", prompt: '"Xin chào" trong tiếng Anh là gì?', promptTranslation: "Choose the correct translation", options: ["Goodbye", "Hello", "Thank you", "Sorry"], correctIndex: 1 },
    { id: "q3", type: "flashcard", word: "Thank you", phonetic: "/θæŋk juː/", meaning: "Cảm ơn", example: "Thank you for helping me!", exampleTranslation: "Cảm ơn bạn đã giúp tôi!" },
];

// ── AI Loading Screen ────────────────────────────────────
function AILoadingScreen() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-b from-sky-50 via-white to-emerald-50 dark:from-sky-950/20 dark:via-background dark:to-emerald-950/20">
            <div className="relative mb-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 shadow-xl shadow-sky-500/30 animate-pulse">
                    <BrainCircuit className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 shadow-lg animate-bounce">
                    <Sparkles className="h-4 w-4 text-white" />
                </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mb-2 text-center">Giáo viên AI đang soạn bài...</h2>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
                Gemini AI đang tạo câu hỏi phù hợp với trình độ của bạn. Chỉ mất vài giây!
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-sky-500" />
                <span>Đang tạo câu hỏi thông minh...</span>
            </div>
        </div>
    );
}

// ── Flashcard Step ───────────────────────────────────────
function FlashcardStep({ question, onComplete }: { question: FlashcardQuestion; onComplete: () => void }) {
    const [isFlipped, setIsFlipped] = useState(false);
    return (
        <div className="flex flex-col items-center justify-center flex-1 px-4">
            <p className="text-sm text-muted-foreground mb-4">Nhấn vào thẻ để xem nghĩa</p>
            <button type="button" onClick={() => setIsFlipped(!isFlipped)} className="group relative w-full max-w-sm cursor-pointer perspective-[1000px]">
                <div className={cn("relative w-full min-h-[280px] sm:min-h-[320px] transition-transform duration-500 transform-3d", isFlipped && "rotate-y-180")}>
                    <div className="absolute inset-0 backface-hidden rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 dark:border-emerald-800 dark:from-emerald-950/40 dark:to-teal-950/30 p-6 flex flex-col items-center justify-center shadow-lg">
                        <Volume2 className="h-5 w-5 text-muted-foreground mb-3" />
                        <p className="text-3xl sm:text-4xl font-black text-emerald-700 dark:text-emerald-300 mb-2">{question.word}</p>
                        <p className="text-sm text-muted-foreground">{question.phonetic}</p>
                        <p className="text-xs text-muted-foreground/60 mt-6">Nhấn để lật thẻ 👆</p>
                    </div>
                    <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-blue-50 dark:border-sky-800 dark:from-sky-950/40 dark:to-blue-950/30 p-6 flex flex-col items-center justify-center shadow-lg">
                        <p className="text-2xl sm:text-3xl font-black text-sky-700 dark:text-sky-300 mb-2">{question.meaning}</p>
                        <p className="text-sm text-muted-foreground mb-4">{question.phonetic}</p>
                        <div className="w-full border-t border-sky-200 dark:border-sky-800 pt-3 mt-auto">
                            <p className="text-xs text-muted-foreground mb-0.5">Ví dụ:</p>
                            <p className="text-sm font-medium text-foreground italic">&ldquo;{question.example}&rdquo;</p>
                            <p className="text-xs text-muted-foreground">{question.exampleTranslation}</p>
                        </div>
                    </div>
                </div>
            </button>
            {isFlipped && (
                <Button size="lg" className="mt-6 cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300" onClick={onComplete}>
                    <CheckCircle2 className="h-5 w-5" /> Đã hiểu
                </Button>
            )}
        </div>
    );
}

// ── Multiple Choice Step ─────────────────────────────────
function MultipleChoiceStep({ question, selectedOption, onSelect }: { question: MultipleChoiceQuestion; selectedOption: number | null; onSelect: (index: number) => void }) {
    return (
        <div className="flex flex-col items-center justify-center flex-1 px-4 max-w-xl mx-auto w-full">
            <p className="text-xl sm:text-2xl font-bold text-center mb-2 leading-relaxed">{question.prompt}</p>
            <p className="text-sm text-muted-foreground mb-8">{question.promptTranslation}</p>
            <div className="w-full space-y-3">
                {question.options.map((option, i) => (
                    <button key={i} type="button" onClick={() => onSelect(i)} className={cn(
                        "flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left text-sm sm:text-base font-medium transition-all cursor-pointer",
                        selectedOption === i ? "border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500/30 dark:border-emerald-600 dark:bg-emerald-950/20" : "border-border hover:border-emerald-300 hover:bg-emerald-50/30 dark:hover:border-emerald-700"
                    )}>
                        <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors", selectedOption === i ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground")}>{String.fromCharCode(65 + i)}</span>
                        <span className="flex-1">{option}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

// ── Completion Screen ────────────────────────────────────
function CompletionScreen({ correct, total, xpEarned, lessonId, isAI }: { correct: number; total: number; xpEarned: number; lessonId: string; isAI: boolean }) {
    const router = useRouter();
    const [saving, setSaving] = useState(true);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        completeLessonAndUnlockNext(lessonId, correct, total)
            .then((res) => {
                if (res?.error) setSaveError(res.error);
                setSaved(true);
            })
            .catch(() => setSaveError("Không thể lưu tiến trình"))
            .finally(() => setSaving(false));
    }, [lessonId, correct, total]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-b from-amber-50 via-white to-emerald-50 dark:from-amber-950/20 dark:via-background dark:to-emerald-950/20">
            <div className="relative mb-6">
                <div className="absolute -top-4 -left-6 text-amber-400 animate-bounce delay-100"><Sparkles className="h-6 w-6" /></div>
                <div className="absolute -top-2 -right-8 text-emerald-400 animate-bounce delay-300"><Sparkles className="h-5 w-5" /></div>
                <div className="absolute -bottom-2 -left-4 text-sky-400 animate-bounce delay-500"><Sparkles className="h-4 w-4" /></div>
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-xl shadow-amber-500/30">
                    <Trophy className="h-12 w-12 text-white" />
                </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mb-2 text-center">Bạn đã hoàn thành bài học! 🎉</h1>
            <p className="text-muted-foreground text-center mb-2">Tuyệt vời! Hãy tiếp tục giữ vững phong độ nhé.</p>
            {isAI && <p className="text-xs text-sky-500 mb-2 flex items-center gap-1"><BrainCircuit className="h-3 w-3" /> Câu hỏi được tạo bởi Gemini AI</p>}
            {saving && <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Đang lưu tiến trình...</p>}
            {saved && !saveError && <p className="text-xs text-emerald-600 mb-4">✓ Đã lưu tiến trình + mở khóa bài tiếp theo</p>}
            {saveError && <p className="text-xs text-red-500 mb-4">⚠ {saveError}</p>}
            <div className="flex gap-6 mb-8">
                <div className="flex flex-col items-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30 mb-1"><Zap className="h-7 w-7 text-amber-500" /></div>
                    <p className="text-xl font-black text-amber-600">+{xpEarned}</p>
                    <p className="text-xs text-muted-foreground">XP</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30 mb-1"><CheckCircle2 className="h-7 w-7 text-emerald-500" /></div>
                    <p className="text-xl font-black text-emerald-600">{correct}/{total}</p>
                    <p className="text-xs text-muted-foreground">Đúng</p>
                </div>
            </div>
            <Button size="lg" className="cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 w-full max-w-xs" onClick={() => router.push("/lessons")}>
                Quay về Lộ trình <ArrowRight className="h-4 w-4" />
            </Button>
        </div>
    );
}

// ── Main Lesson Page ─────────────────────────────────────
export default function LessonPage() {
    const params = useParams();
    const router = useRouter();
    const lessonId = params.id as string;

    const [questions, setQuestions] = useState<Question[]>([]);
    const [isAI, setIsAI] = useState(false);
    const [loading, setLoading] = useState(true);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [feedbackState, setFeedbackState] = useState<"idle" | "correct" | "incorrect">("idle");
    const [correctCount, setCorrectCount] = useState(0);
    const [hearts, setHearts] = useState(3);
    const [phase, setPhase] = useState<"lesson" | "complete">("lesson");

    // Fetch AI questions on mount
    useEffect(() => {
        async function loadQuestions() {
            try {
                // Step 1: Fetch lesson title from Supabase via a lightweight API call
                const lessonRes = await fetch(`/api/lesson-info?id=${lessonId}`);
                const lessonData = lessonRes.ok ? await lessonRes.json() : null;
                const topic = lessonData?.title || "Basic English";
                const level = lessonData?.level || "A1";

                // Step 2: Generate AI quiz based on lesson topic
                const quizRes = await fetch("/api/generate-quiz", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ topic, level }),
                });
                const quizData = await quizRes.json();

                if (quizData.questions && Array.isArray(quizData.questions) && quizData.questions.length > 0) {
                    setQuestions(quizData.questions);
                    setIsAI(true);
                } else {
                    setQuestions(FALLBACK_QUESTIONS);
                }
            } catch {
                setQuestions(FALLBACK_QUESTIONS);
            } finally {
                setLoading(false);
            }
        }
        loadQuestions();
    }, [lessonId]);

    const total = questions.length;
    const current = questions[currentIndex];
    const progress = total > 0 ? (currentIndex / total) * 100 : 0;
    const xpPerCorrect = 10;

    const handleFlashcardComplete = useCallback(() => { setFeedbackState("correct"); }, []);

    function handleCheck() {
        if (!current || current.type !== "multiple_choice" || selectedOption === null) return;
        const isCorrect = selectedOption === (current as MultipleChoiceQuestion).correctIndex;
        if (isCorrect) { setCorrectCount((c) => c + 1); setFeedbackState("correct"); }
        else { setHearts((h) => Math.max(0, h - 1)); setFeedbackState("incorrect"); }
    }

    function handleNext() {
        if (currentIndex < total - 1) { setCurrentIndex((i) => i + 1); setSelectedOption(null); setFeedbackState("idle"); }
        else { setPhase("complete"); }
    }

    // Loading state
    if (loading) return <AILoadingScreen />;

    // Completion state
    if (phase === "complete") {
        const flashcardCount = questions.filter((q) => q.type === "flashcard").length;
        const totalCorrect = correctCount + flashcardCount;
        return <CompletionScreen correct={totalCorrect} total={total} xpEarned={totalCorrect * xpPerCorrect} lessonId={lessonId} isAI={isAI} />;
    }

    if (!current) return null;

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
                <div className="flex items-center gap-3 px-4 py-3 max-w-3xl mx-auto">
                    <button type="button" onClick={() => router.push("/lessons")} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer" aria-label="Thoát bài học">
                        <X className="h-5 w-5" />
                    </button>
                    <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        {isAI && <BrainCircuit className="h-4 w-4 text-sky-500" />}
                        <Heart className={cn("h-5 w-5 transition-colors", hearts > 0 ? "text-red-500 fill-red-500" : "text-muted-foreground")} />
                        <span className="text-sm font-bold tabular-nums text-red-500">{hearts}</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col py-6 sm:py-10 max-w-3xl mx-auto w-full">
                {current.type === "flashcard" ? (
                    <FlashcardStep key={current.id} question={current} onComplete={handleFlashcardComplete} />
                ) : (
                    <MultipleChoiceStep key={current.id} question={current} selectedOption={selectedOption} onSelect={setSelectedOption} />
                )}
            </main>

            <footer className={cn(
                "sticky bottom-0 border-t transition-colors duration-300",
                feedbackState === "correct" && "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800",
                feedbackState === "incorrect" && "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800",
                feedbackState === "idle" && "bg-background border-border"
            )}>
                <div className="flex items-center justify-between px-4 py-4 max-w-3xl mx-auto">
                    <div className="flex items-center gap-2">
                        {feedbackState === "correct" && (
                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                <div>
                                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{current.type === "flashcard" ? "Tuyệt vời!" : "Chính xác!"}</p>
                                    <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">+{xpPerCorrect} XP</p>
                                </div>
                            </div>
                        )}
                        {feedbackState === "incorrect" && (
                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                <XCircle className="h-6 w-6 text-red-500" />
                                <div>
                                    <p className="text-sm font-bold text-red-700 dark:text-red-400">Sai rồi!</p>
                                    <p className="text-xs text-red-600/70 dark:text-red-400/70">
                                        Đáp án: {current.type === "multiple_choice" ? current.options[current.correctIndex] : ""}
                                        {current.type === "multiple_choice" && current.explanation && ` — ${current.explanation}`}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div>
                        {feedbackState === "idle" && current.type === "multiple_choice" && (
                            <Button size="lg" className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-40" disabled={selectedOption === null} onClick={handleCheck}>Kiểm tra</Button>
                        )}
                        {feedbackState !== "idle" && (
                            <Button size="lg" className={cn("cursor-pointer gap-2 text-white shadow-lg animate-in fade-in slide-in-from-right-2 duration-300", feedbackState === "correct" ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20" : "bg-red-500 hover:bg-red-600 shadow-red-500/20")} onClick={handleNext}>
                                {currentIndex < total - 1 ? "Tiếp tục" : "Hoàn thành"} <ArrowRight className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    );
}
