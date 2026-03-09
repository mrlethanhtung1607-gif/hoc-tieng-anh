"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Map,
    ClipboardCheck,
    Trophy,
    Settings,
    BookOpen,
    GraduationCap,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    {
        label: "Lộ trình của tôi",
        href: "/lessons",
        icon: Map,
    },
    {
        label: "Luyện tập",
        href: "/practice",
        icon: BookOpen,
    },
    {
        label: "Kiểm tra trình độ",
        href: "/placement-test",
        icon: ClipboardCheck,
    },
    {
        label: "Bảng xếp hạng",
        href: "/leaderboard",
        icon: Trophy,
    },
] as const;

const BOTTOM_ITEMS = [
    {
        label: "Hồ sơ",
        href: "/profile",
        icon: GraduationCap,
    },
    {
        label: "Cài đặt",
        href: "/settings",
        icon: Settings,
    },
] as const;

interface SidebarProps {
    open?: boolean;
    onClose?: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 flex h-full w-64 flex-col border-r border-border bg-card transition-transform duration-300 lg:static lg:translate-x-0",
                    open ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Logo */}
                <div className="flex h-16 items-center justify-between border-b border-border px-5">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 font-bold text-lg"
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white text-sm font-black">
                            H
                        </span>
                        <span>HocTiengAnh</span>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden cursor-pointer"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Main nav */}
                <nav className="flex-1 overflow-y-auto px-3 py-4">
                    <ul className="space-y-1">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={onClose}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        <Icon className="h-5 w-5 shrink-0" />
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Bottom items */}
                <div className="border-t border-border px-3 py-4">
                    <ul className="space-y-1">
                        {BOTTOM_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={onClose}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        <Icon className="h-5 w-5 shrink-0" />
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </aside>
        </>
    );
}
