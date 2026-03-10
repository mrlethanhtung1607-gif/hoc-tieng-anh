"use client";

import { useState, useTransition } from "react";
import { Pencil, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateProfileName } from "@/lib/actions/gamification";

export function ProfileNameForm({ currentName }: { currentName: string }) {
    const [name, setName] = useState(currentName);
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const hasChanged = name.trim() !== currentName;

    function handleSave() {
        if (!hasChanged) return;
        setStatus("idle");
        startTransition(async () => {
            const res = await updateProfileName(name);
            if (res?.error) {
                setStatus("error");
                setErrorMsg(res.error);
            } else {
                setStatus("success");
                setTimeout(() => setStatus("idle"), 3000);
            }
        });
    }

    return (
        <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-bold flex items-center gap-2 mb-4">
                <Pencil className="h-4 w-4 text-muted-foreground" />
                Chỉnh sửa hồ sơ
            </h2>

            <div className="space-y-3">
                <div>
                    <label htmlFor="displayName" className="text-xs font-medium text-muted-foreground mb-1 block">
                        Tên hiển thị
                    </label>
                    <input
                        id="displayName"
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setStatus("idle"); }}
                        maxLength={50}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                        placeholder="Nhập tên hiển thị"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">{name.trim().length}/50 ký tự</p>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        {status === "success" && (
                            <p className="text-xs text-emerald-600 flex items-center gap-1 animate-in fade-in duration-300">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Đã lưu thành công!
                            </p>
                        )}
                        {status === "error" && (
                            <p className="text-xs text-red-500 flex items-center gap-1 animate-in fade-in duration-300">
                                <AlertCircle className="h-3.5 w-3.5" /> {errorMsg}
                            </p>
                        )}
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={!hasChanged || isPending}
                        className="cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40"
                    >
                        {isPending ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Đang lưu...</>
                        ) : (
                            <><Save className="h-4 w-4" /> Lưu thay đổi</>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
