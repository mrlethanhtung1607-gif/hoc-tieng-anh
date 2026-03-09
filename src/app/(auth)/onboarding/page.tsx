"use client";

import { useState } from "react";
import { completeOnboarding } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const GOALS = [
    { value: "work", label: "Công việc" },
    { value: "travel", label: "Du lịch" },
    { value: "study", label: "Học tập" },
    { value: "communication", label: "Giao tiếp" },
    { value: "other", label: "Khác" },
];

export default function OnboardingPage() {
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        if (!selectedGoal) {
            setError("Vui lòng chọn mục tiêu học tập.");
            return;
        }
        formData.set("learning_goal", selectedGoal);
        setPending(true);
        setError(null);
        const result = await completeOnboarding(formData);
        if (result?.error) {
            setError(result.error);
            setPending(false);
        }
    }

    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h1 className="text-xl font-bold text-center mb-1">
                Chào mừng bạn! 🎉
            </h1>
            <p className="text-sm text-muted-foreground text-center mb-6">
                Cho chúng tôi biết thêm về bạn để cá nhân hóa lộ trình.
            </p>

            <form action={handleSubmit} className="space-y-5">
                <div>
                    <Label htmlFor="age">Tuổi của bạn</Label>
                    <Input
                        id="age"
                        name="age"
                        type="number"
                        min="5"
                        max="100"
                        placeholder="25"
                        required
                    />
                </div>

                <div>
                    <Label>Mục tiêu học Tiếng Anh</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {GOALS.map((goal) => (
                            <button
                                key={goal.value}
                                type="button"
                                onClick={() => setSelectedGoal(goal.value)}
                                className={`rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-all cursor-pointer ${selectedGoal === goal.value
                                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                                        : "border-border hover:border-emerald-300"
                                    }`}
                            >
                                {goal.label}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <p className="text-sm text-destructive">{error}</p>
                )}
                <Button
                    type="submit"
                    className="w-full cursor-pointer"
                    disabled={pending}
                >
                    {pending ? "Đang xử lý..." : "Bắt đầu học"}
                </Button>
            </form>
        </div>
    );
}
