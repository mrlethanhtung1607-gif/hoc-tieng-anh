"use client";

import { useState } from "react";
import Link from "next/link";
import { loginWithEmail } from "@/lib/actions/auth";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    async function handleSubmit(formData: FormData) {
        setPending(true);
        setError(null);
        const result = await loginWithEmail(formData);
        if (result?.error) {
            setError(result.error);
            setPending(false);
        }
    }

    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h1 className="text-xl font-bold text-center mb-1">Đăng nhập</h1>
            <p className="text-sm text-muted-foreground text-center mb-6">
                Chào mừng trở lại! Tiếp tục hành trình học tập.
            </p>

            <GoogleButton label="Đăng nhập với Google" />

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                        HOẶC
                    </span>
                </div>
            </div>

            <form action={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                    />
                </div>
                {error && (
                    <p className="text-sm text-destructive">{error}</p>
                )}
                <Button
                    type="submit"
                    className="w-full cursor-pointer"
                    disabled={pending}
                >
                    {pending ? "Đang xử lý..." : "Đăng nhập"}
                </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
                Chưa có tài khoản?{" "}
                <Link
                    href="/register"
                    className="font-medium text-emerald-600 underline underline-offset-4 hover:text-emerald-700"
                >
                    Đăng ký ngay
                </Link>
            </p>
        </div>
    );
}
