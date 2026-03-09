"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    BookOpen,
    Users,
    ArrowLeft,
    Menu,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Khóa học & Bài học", href: "/admin/courses", icon: BookOpen },
    { label: "Users", href: "/admin/users", icon: Users },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 flex h-full w-64 flex-col border-r border-border bg-card transition-transform duration-300 lg:static lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex h-16 items-center justify-between border-b border-border px-5">
                    <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white text-sm font-black">
                            A
                        </span>
                        <span className="font-bold text-lg">Admin CMS</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden cursor-pointer"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {ADMIN_NAV.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            item.href === "/admin"
                                ? pathname === "/admin"
                                : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <Icon className="h-5 w-5 shrink-0" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Back link */}
                <div className="border-t border-border px-3 py-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 shrink-0" />
                        Về trang chính
                    </Link>
                </div>
            </aside>

            <div className="flex flex-1 flex-col">
                {/* Mobile header */}
                <header className="sticky top-0 z-30 flex h-14 items-center border-b border-border bg-background/80 backdrop-blur-md px-4 lg:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(true)}
                        className="cursor-pointer"
                        aria-label="Open admin menu"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <span className="ml-3 font-semibold">Admin CMS</span>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
