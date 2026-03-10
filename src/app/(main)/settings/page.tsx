"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Sun,
    Moon,
    Volume2,
    VolumeX,
    Bell,
    BellOff,
    LogOut,
    Trash2,
    Palette,
    Headphones,
    Mail,
    ShieldAlert,
    ChevronRight,
    Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/actions/auth";

// ── Toggle Switch ────────────────────────────────────────
function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed",
                checked ? "bg-emerald-500" : "bg-muted"
            )}
        >
            <span
                className={cn(
                    "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200",
                    checked ? "translate-x-5" : "translate-x-0.5"
                )}
            />
        </button>
    );
}

// ── Setting Row ──────────────────────────────────────────
function SettingRow({
    icon: Icon,
    iconColor,
    iconBg,
    title,
    description,
    children,
}: {
    icon: typeof Sun;
    iconColor: string;
    iconBg: string;
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", iconBg)}>
                    <Icon className={cn("h-4.5 w-4.5", iconColor)} />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="text-xs text-muted-foreground truncate">{description}</p>
                </div>
            </div>
            <div className="shrink-0">{children}</div>
        </div>
    );
}

// ── Section Card ─────────────────────────────────────────
function SettingsSection({
    icon: Icon,
    iconColor,
    title,
    children,
}: {
    icon: typeof Palette;
    iconColor: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 font-bold text-sm mb-1">
                <Icon className={cn("h-4 w-4", iconColor)} />
                {title}
            </h2>
            <div className="divide-y divide-border mt-3">{children}</div>
        </div>
    );
}

export default function SettingsPage() {
    const router = useRouter();

    // Appearance
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== "undefined") {
            return document.documentElement.classList.contains("dark");
        }
        return false;
    });

    // Sound
    const [soundEffects, setSoundEffects] = useState(true);
    const [autoPlayPronunciation, setAutoPlayPronunciation] = useState(true);

    // Notifications
    const [dailyReminder, setDailyReminder] = useState(false);

    // Dark mode toggle
    function handleDarkModeToggle(value: boolean) {
        setDarkMode(value);
        if (value) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }

    // Logout
    async function handleLogout() {
        await logout();
        router.push("/login");
    }

    // Delete account (placeholder confirmation)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    return (
        <div className="mx-auto max-w-2xl space-y-5 pb-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Cài đặt</h1>
                <p className="text-sm text-muted-foreground mt-1">Tùy chỉnh trải nghiệm học tập của bạn</p>
            </div>

            {/* 1. Appearance */}
            <SettingsSection icon={Palette} iconColor="text-sky-500" title="Giao diện">
                <SettingRow
                    icon={darkMode ? Moon : Sun}
                    iconColor={darkMode ? "text-indigo-400" : "text-amber-500"}
                    iconBg={darkMode ? "bg-indigo-100 dark:bg-indigo-900/30" : "bg-amber-100 dark:bg-amber-900/30"}
                    title="Chế độ tối"
                    description={darkMode ? "Đang bật — Dễ chịu cho mắt vào ban đêm" : "Đang tắt — Giao diện sáng mặc định"}
                >
                    <Toggle checked={darkMode} onChange={handleDarkModeToggle} />
                </SettingRow>
            </SettingsSection>

            {/* 2. Learning Sounds */}
            <SettingsSection icon={Headphones} iconColor="text-emerald-500" title="Âm thanh học tập">
                <SettingRow
                    icon={soundEffects ? Volume2 : VolumeX}
                    iconColor={soundEffects ? "text-emerald-500" : "text-muted-foreground"}
                    iconBg="bg-emerald-100 dark:bg-emerald-900/30"
                    title="Hiệu ứng âm thanh"
                    description="Phát âm khi trả lời đúng / sai"
                >
                    <Toggle checked={soundEffects} onChange={setSoundEffects} />
                </SettingRow>
                <SettingRow
                    icon={Mic}
                    iconColor={autoPlayPronunciation ? "text-teal-500" : "text-muted-foreground"}
                    iconBg="bg-teal-100 dark:bg-teal-900/30"
                    title="Tự động phát âm từ vựng"
                    description="Phát âm tự động khi hiển thị flashcard"
                >
                    <Toggle checked={autoPlayPronunciation} onChange={setAutoPlayPronunciation} />
                </SettingRow>
            </SettingsSection>

            {/* 3. Notifications */}
            <SettingsSection icon={Bell} iconColor="text-amber-500" title="Thông báo">
                <SettingRow
                    icon={dailyReminder ? Bell : BellOff}
                    iconColor={dailyReminder ? "text-amber-500" : "text-muted-foreground"}
                    iconBg="bg-amber-100 dark:bg-amber-900/30"
                    title="Nhắc nhở học tập hàng ngày"
                    description="Nhận email nhắc học vào mỗi buổi sáng"
                >
                    <Toggle checked={dailyReminder} onChange={setDailyReminder} />
                </SettingRow>
            </SettingsSection>

            {/* 4. Danger Zone */}
            <div className="rounded-xl border-2 border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/10 p-5">
                <h2 className="flex items-center gap-2 font-bold text-sm text-red-600 dark:text-red-400 mb-1">
                    <ShieldAlert className="h-4 w-4" />
                    Vùng nguy hiểm
                </h2>
                <p className="text-xs text-red-500/70 dark:text-red-400/60 mb-4">
                    Các thao tác dưới đây không thể hoàn tác
                </p>

                <div className="space-y-3">
                    {/* Sign out */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium transition-all hover:bg-muted cursor-pointer group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors">
                                <LogOut className="h-4.5 w-4.5 text-muted-foreground group-hover:text-orange-500 transition-colors" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold">Đăng xuất</p>
                                <p className="text-xs text-muted-foreground">Thoát khỏi tài khoản hiện tại</p>
                            </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>

                    {/* Delete account */}
                    {!showDeleteConfirm ? (
                        <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex w-full items-center justify-between rounded-lg border-2 border-red-200 bg-card px-4 py-3 text-sm font-medium transition-all hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/20 cursor-pointer group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                                    <Trash2 className="h-4.5 w-4.5 text-red-500" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-red-600 dark:text-red-400">Xóa tài khoản</p>
                                    <p className="text-xs text-red-500/70">Xóa vĩnh viễn tài khoản và toàn bộ dữ liệu</p>
                                </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-red-400" />
                        </button>
                    ) : (
                        <div className="rounded-lg border-2 border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30 p-4">
                            <p className="text-sm font-bold text-red-600 dark:text-red-400 mb-2">
                                ⚠️ Bạn có chắc chắn muốn xóa tài khoản?
                            </p>
                            <p className="text-xs text-red-500/80 mb-4">
                                Hành động này sẽ xóa vĩnh viễn toàn bộ tiến trình học tập, điểm XP và dữ liệu cá nhân. Không thể hoàn tác!
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="cursor-pointer"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Hủy bỏ
                                </Button>
                                <Button
                                    size="sm"
                                    className="cursor-pointer bg-red-600 hover:bg-red-700 text-white"
                                    onClick={() => {
                                        alert("Tính năng xóa tài khoản sẽ được triển khai sau.");
                                        setShowDeleteConfirm(false);
                                    }}
                                >
                                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Xác nhận xóa
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
