"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    BookOpenText,
    Dice5,
    Sparkles,
    Heart,
    Flame,
    Star,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function StoriesPage() {
    const router = useRouter();
    const [drawing, setDrawing] = useState(false);
    const [animating, setAnimating] = useState(false);

    async function handleDraw() {
        if (drawing) return;
        setDrawing(true);
        setAnimating(true);

        // Fetch random story ID
        const res = await fetch("/api/random-story");
        const data = await res.json();

        // Keep animation for at least 1.5s for effect
        await new Promise((r) => setTimeout(r, 1500));

        if (data.id) {
            router.push(`/stories/${data.id}`);
        } else {
            setDrawing(false);
            setAnimating(false);
        }
    }

    return (
        <div className="mx-auto max-w-lg pt-8 sm:pt-16 px-4">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 mx-auto mb-4 shadow-lg shadow-indigo-500/20">
                    <BookOpenText className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                    Đọc truyện & Điền từ
                </h1>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                    Rút thăm một câu chuyện ngẫu nhiên, điền từ Tiếng Anh vào chỗ trống để kiếm Tim và nối Streak!
                </p>
            </div>

            {/* Stats badges */}
            <div className="flex items-center justify-center gap-3 mb-8">
                <div className="flex items-center gap-1.5 rounded-full bg-pink-100 dark:bg-pink-900/30 px-3 py-1.5 text-xs font-bold text-pink-600 dark:text-pink-400">
                    <Heart className="h-3.5 w-3.5 fill-current" /> +Tim
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 px-3 py-1.5 text-xs font-bold text-orange-600 dark:text-orange-400">
                    <Flame className="h-3.5 w-3.5" /> +Streak
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-current" /> 30+ truyện
                </div>
            </div>

            {/* Gacha draw card */}
            <div className="rounded-2xl border-2 border-border bg-card p-6 sm:p-8 text-center relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-sky-50/50 dark:from-indigo-950/20 dark:to-sky-950/20" />

                <div className="relative z-10">
                    {/* Dice animation */}
                    <div className={cn(
                        "flex h-24 w-24 items-center justify-center rounded-full mx-auto mb-5 transition-all duration-500",
                        animating
                            ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-xl shadow-amber-500/30 animate-bounce"
                            : "bg-gradient-to-br from-indigo-100 to-sky-100 dark:from-indigo-900/40 dark:to-sky-900/30"
                    )}>
                        {animating ? (
                            <Loader2 className="h-12 w-12 text-white animate-spin" />
                        ) : (
                            <Dice5 className="h-12 w-12 text-indigo-500 dark:text-indigo-400" />
                        )}
                    </div>

                    <h2 className="text-lg font-black mb-2">
                        {animating ? "Đang rút thăm..." : "Sẵn sàng chưa?"}
                    </h2>
                    <p className="text-xs text-muted-foreground mb-5 max-w-xs mx-auto">
                        {animating
                            ? "Đợi chút nhé, hệ thống đang chọn câu chuyện cho bạn ✨"
                            : "Bấm nút bên dưới để rút ngẫu nhiên một câu chuyện thú vị"
                        }
                    </p>

                    <Button
                        size="lg"
                        onClick={handleDraw}
                        disabled={drawing}
                        className={cn(
                            "cursor-pointer gap-2 text-base font-bold px-8 py-6 rounded-xl shadow-lg transition-all",
                            animating
                                ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/30"
                                : "bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 shadow-indigo-500/20"
                        )}
                    >
                        {drawing ? (
                            <><Loader2 className="h-5 w-5 animate-spin" /> Đang chọn...</>
                        ) : (
                            <><Dice5 className="h-5 w-5" /> 🎲 Rút thăm câu chuyện hôm nay</>
                        )}
                    </Button>
                </div>
            </div>

            {/* How it works */}
            <div className="mt-8 space-y-3">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">
                    Cách chơi
                </h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                    {[
                        { step: "1", icon: "🎲", text: "Rút thăm truyện" },
                        { step: "2", icon: "✍️", text: "Điền từ vào chỗ trống" },
                        { step: "3", icon: "🎉", text: "Nhận Tim & Streak" },
                    ].map((s) => (
                        <div key={s.step} className="rounded-xl border border-border bg-card/50 p-3">
                            <div className="text-2xl mb-1">{s.icon}</div>
                            <p className="text-[10px] font-medium text-muted-foreground">{s.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground/40 mt-6">
                <Sparkles className="h-3 w-3" /> Trỏ chuột vào chữ gạch chân nét đứt để xem gợi ý
            </div>
        </div>
    );
}
