"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    CheckCircle2,
    XCircle,
    ArrowRight,
    RotateCcw,
    Trophy,
    Target,
    Sparkles,
    BookOpen,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { updateLevel } from "@/lib/actions/gamification";

interface Question {
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
    difficulty: "easy" | "medium" | "hard";
}

const QUESTIONS: Question[] = [
    { id: 1, question: 'What is the correct greeting? "Good _____, how are you?"', options: ["morning", "moring", "mourning", "mooring"], correctIndex: 0, difficulty: "easy" },
    { id: 2, question: "Choose the correct sentence:", options: ["She don't like coffee.", "She doesn't likes coffee.", "She doesn't like coffee.", "She not like coffee."], correctIndex: 2, difficulty: "easy" },
    { id: 3, question: 'Fill in the blank: "I have been _____ English for two years."', options: ["study", "studied", "studying", "to study"], correctIndex: 2, difficulty: "medium" },
    { id: 4, question: 'Which word best completes the sentence? "If I _____ rich, I would travel the world."', options: ["am", "was", "were", "be"], correctIndex: 2, difficulty: "medium" },
    { id: 5, question: 'Choose the correct passive form: "The report _____ by the manager yesterday."', options: ["was written", "is written", "has written", "were written"], correctIndex: 0, difficulty: "hard" },
];

interface LevelResult { level: string; label: string; description: string; color: string; bgColor: string; emoji: string; }

function getLevel(correct: number): LevelResult {
    if (correct <= 1) return { level: "A0", label: "Mất gốc", description: "Bạn cần bắt đầu từ những kiến thức cơ bản nhất. Đừng lo, lộ trình của chúng tôi sẽ giúp bạn từng bước!", color: "text-red-600 dark:text-red-400", bgColor: "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800", emoji: "💪" };
    if (correct <= 2) return { level: "A1", label: "Sơ cấp", description: "Bạn đã có nền tảng cơ bản. Hãy tiếp tục luyện tập để nâng cao kỹ năng!", color: "text-orange-600 dark:text-orange-400", bgColor: "bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800", emoji: "📖" };
    if (correct <= 3) return { level: "A2", label: "Trung cấp cơ sở", description: "Nền tảng tốt! Bạn có thể giao tiếp cơ bản và sẵn sàng học những chủ đề phức tạp hơn.", color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800", emoji: "⭐" };
    if (correct <= 4) return { level: "B1", label: "Trung cấp", description: "Tuyệt vời! Bạn có khả năng Tiếng Anh khá tốt. Hãy thử thách bản thân với các bài học nâng cao.", color: "text-emerald-600 dark:text-emerald-400", bgColor: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800", emoji: "🌟" };
    return { level: "B2", label: "Cao cấp", description: "Xuất sắc! Trình độ Tiếng Anh của bạn rất tốt. Hãy tiếp tục duy trì và hoàn thiện hơn nữa!", color: "text-sky-600 dark:text-sky-400", bgColor: "bg-sky-50 border-sky-200 dark:bg-sky-950/30 dark:border-sky-800", emoji: "🏆" };
}

// ── Result Screen (separate component for hooks safety) ──
function ResultScreen({ correctCount, total, answers, onRestart }: { correctCount: number; total: number; answers: (number | null)[]; onRestart: () => void }) {
    const level = getLevel(correctCount);
    const [saving, setSaving] = useState(true);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        updateLevel(level.level)
            .then((res) => {
                if (res?.error) setSaveError(res.error);
                setSaved(true);
            })
            .catch(() => setSaveError("Không thể lưu kết quả"))
            .finally(() => setSaving(false));
    }, [level.level]);

    return (
        <div className="mx-auto max-w-2xl py-8 sm:py-12">
            <div className="text-center mb-8">
                <div className="text-5xl mb-4">{level.emoji}</div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Kết quả kiểm tra</h1>
                <p className="text-muted-foreground">Bạn đã trả lời đúng <span className="font-bold text-foreground">{correctCount}/{total}</span> câu hỏi</p>
            </div>
            <div className={cn("rounded-2xl border-2 p-6 sm:p-8 text-center mb-6", level.bgColor)}>
                <div className={cn("text-sm font-medium mb-1", level.color)}>Trình độ của bạn</div>
                <div className={cn("text-4xl sm:text-5xl font-black mb-1", level.color)}>{level.level}</div>
                <div className="text-lg font-semibold mb-3">{level.label}</div>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">{level.description}</p>
                {saving && <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Đang lưu kết quả...</p>}
                {saved && !saveError && <p className="text-xs text-emerald-600 mt-2">✓ Đã cập nhật trình độ của bạn</p>}
                {saveError && <p className="text-xs text-red-500 mt-2">⚠ {saveError}</p>}
            </div>
            <div className="rounded-xl border border-border bg-card p-4 sm:p-5 mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2"><BookOpen className="h-4 w-4" /> Chi tiết đáp án</h3>
                <div className="space-y-2">
                    {QUESTIONS.map((q, i) => {
                        const userAnswer = answers[i];
                        const isCorrect = userAnswer === q.correctIndex;
                        return (
                            <div key={q.id} className="flex items-start gap-3 text-sm">
                                {isCorrect ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" /> : <XCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />}
                                <div className="min-w-0">
                                    <p className="font-medium truncate">Câu {i + 1}: {q.question}</p>
                                    <p className="text-muted-foreground">{isCorrect ? `✓ ${q.options[q.correctIndex]}` : `✗ ${q.options[userAnswer ?? 0]} → Đáp án: ${q.options[q.correctIndex]}`}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/lessons" className="flex-1"><Button size="lg" className="w-full cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"><Trophy className="h-5 w-5" /> Bắt đầu lộ trình học</Button></Link>
                <Button size="lg" variant="outline" className="cursor-pointer gap-2" onClick={onRestart}><RotateCcw className="h-4 w-4" /> Làm lại</Button>
            </div>
        </div>
    );
}

type Phase = "intro" | "quiz" | "result";

export default function PlacementTestPage() {
    const [phase, setPhase] = useState<Phase>("intro");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>([]);

    const current = QUESTIONS[currentIndex];
    const total = QUESTIONS.length;
    const progress = ((currentIndex + 1) / total) * 100;

    function handleSelect(optionIndex: number) { if (isRevealed) return; setSelectedOption(optionIndex); }
    function handleConfirm() {
        if (selectedOption === null) return;
        setIsRevealed(true);
        if (selectedOption === current.correctIndex) setCorrectCount((c) => c + 1);
        setAnswers((prev) => [...prev, selectedOption]);
    }
    function handleNext() {
        if (currentIndex < total - 1) { setCurrentIndex((i) => i + 1); setSelectedOption(null); setIsRevealed(false); }
        else { setPhase("result"); }
    }
    function handleRestart() { setPhase("intro"); setCurrentIndex(0); setSelectedOption(null); setIsRevealed(false); setCorrectCount(0); setAnswers([]); }

    if (phase === "intro") {
        return (
            <div className="mx-auto max-w-2xl text-center py-8 sm:py-12">
                <div className="inline-flex items-center justify-center rounded-full bg-amber-100 p-4 dark:bg-amber-900/30 mb-4"><Target className="h-10 w-10 text-amber-500" /></div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-3">Bài kiểm tra năng lực</h1>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">Trả lời {total} câu hỏi trắc nghiệm để chúng tôi xác định trình độ và gợi ý lộ trình phù hợp cho bạn.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-left max-w-lg mx-auto">
                    <div className="rounded-xl border border-border bg-card p-4 text-center"><p className="text-2xl font-bold text-emerald-600">{total}</p><p className="text-xs text-muted-foreground">Câu hỏi</p></div>
                    <div className="rounded-xl border border-border bg-card p-4 text-center"><p className="text-2xl font-bold text-amber-600">~3</p><p className="text-xs text-muted-foreground">Phút</p></div>
                    <div className="rounded-xl border border-border bg-card p-4 text-center"><p className="text-2xl font-bold text-sky-600">A0–B2</p><p className="text-xs text-muted-foreground">Phân loại</p></div>
                </div>
                <Button size="lg" className="cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20" onClick={() => setPhase("quiz")}>
                    <Sparkles className="h-5 w-5" /> Bắt đầu kiểm tra <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    if (phase === "result") {
        return <ResultScreen correctCount={correctCount} total={total} answers={answers} onRestart={handleRestart} />;
    }

    return (
        <div className="mx-auto max-w-2xl py-4 sm:py-8">
            <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Câu <span className="font-semibold text-foreground">{currentIndex + 1}</span> / {total}</span>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", current.difficulty === "easy" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400", current.difficulty === "medium" && "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400", current.difficulty === "hard" && "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400")}>
                        {current.difficulty === "easy" ? "Dễ" : current.difficulty === "medium" ? "Trung bình" : "Khó"}
                    </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} /></div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-8 shadow-sm mb-6">
                <p className="text-lg sm:text-xl font-semibold leading-relaxed mb-6">{current.question}</p>
                <div className="space-y-3">
                    {current.options.map((option, i) => {
                        const isSelected = selectedOption === i;
                        const isCorrectOption = i === current.correctIndex;
                        let optionStyle = "border-border hover:border-emerald-300 hover:bg-emerald-50/50 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/20";
                        if (isRevealed) {
                            if (isCorrectOption) optionStyle = "border-emerald-500 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/30";
                            else if (isSelected && !isCorrectOption) optionStyle = "border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-950/30";
                            else optionStyle = "border-border opacity-50";
                        } else if (isSelected) { optionStyle = "border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500/30 dark:border-emerald-600 dark:bg-emerald-950/20"; }
                        return (
                            <button key={i} type="button" onClick={() => handleSelect(i)} disabled={isRevealed} className={cn("flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left text-sm sm:text-base font-medium transition-all cursor-pointer disabled:cursor-default", optionStyle)}>
                                <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors", isRevealed && isCorrectOption ? "bg-emerald-500 text-white" : isRevealed && isSelected && !isCorrectOption ? "bg-red-500 text-white" : isSelected ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground")}>{String.fromCharCode(65 + i)}</span>
                                <span className="flex-1">{option}</span>
                                {isRevealed && isCorrectOption && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
                                {isRevealed && isSelected && !isCorrectOption && <XCircle className="h-5 w-5 text-red-500 shrink-0" />}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="flex justify-end">
                {!isRevealed ? (
                    <Button size="lg" className="cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-40" disabled={selectedOption === null} onClick={handleConfirm}>Xác nhận</Button>
                ) : (
                    <Button size="lg" className="cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20" onClick={handleNext}>
                        {currentIndex < total - 1 ? "Câu tiếp theo" : "Xem kết quả"} <ArrowRight className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
