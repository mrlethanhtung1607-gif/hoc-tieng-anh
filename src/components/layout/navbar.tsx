"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/actions/auth";
import { useUserStore } from "@/stores/user-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
    Search,
    Menu,
    LogOut,
    User,
    Settings,
    Flame,
    Zap,
    X,
} from "lucide-react";

interface NavbarProps {
    onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
    const { user } = useUserStore();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/lessons?q=${encodeURIComponent(searchQuery.trim())}`);
            setMobileSearchOpen(false);
        }
    }

    const initials =
        user?.display_name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() ?? "U";

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border bg-background/80 backdrop-blur-md px-4 lg:px-6">
            {/* Mobile menu button */}
            <Button
                variant="ghost"
                size="icon"
                className="lg:hidden mr-2 cursor-pointer"
                onClick={onMenuClick}
                aria-label="Open menu"
            >
                <Menu className="h-5 w-5" />
            </Button>

            {/* Desktop search */}
            <form
                onSubmit={handleSearch}
                className="hidden sm:flex flex-1 max-w-md items-center"
            >
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Tìm khóa học, bài học..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 bg-muted/50"
                    />
                </div>
            </form>

            {/* Mobile search icon */}
            <Button
                variant="ghost"
                size="icon"
                className="sm:hidden cursor-pointer"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                aria-label="Toggle search"
            >
                {mobileSearchOpen ? (
                    <X className="h-5 w-5" />
                ) : (
                    <Search className="h-5 w-5" />
                )}
            </Button>

            {/* Right section */}
            <div className="ml-auto flex items-center gap-2">
                {/* Stats badges */}
                {user && (
                    <div className="hidden md:flex items-center gap-3 mr-2">
                        <div className="flex items-center gap-1 text-sm font-medium">
                            <Flame className="h-4 w-4 text-orange-500" />
                            <span>{user.current_streak}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-medium">
                            <Zap className="h-4 w-4 text-amber-500" />
                            <span>{user.total_xp} XP</span>
                        </div>
                    </div>
                )}

                <ThemeToggle />

                {/* User menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button
                            variant="ghost"
                            className="relative h-9 w-9 rounded-full cursor-pointer"
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src={user?.avatar_url ?? undefined}
                                    alt={user?.display_name ?? "User"}
                                />
                                <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 text-xs font-bold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <div className="px-2 py-1.5">
                            <p className="text-sm font-medium">
                                {user?.display_name ?? "User"}
                            </p>
                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                            <Link href="/profile">
                                <User className="mr-2 h-4 w-4" />
                                Hồ sơ
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            <Link href="/settings">
                                <Settings className="mr-2 h-4 w-4" />
                                Cài đặt
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer text-red-600 dark:text-red-400"
                            onSelect={async () => {
                                await logout();
                            }}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Đăng xuất
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Mobile search overlay */}
            {mobileSearchOpen && (
                <div className="absolute left-0 top-16 w-full border-b border-border bg-background p-3 sm:hidden">
                    <form onSubmit={handleSearch}>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Tìm khóa học, bài học..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-10 bg-muted/50"
                                autoFocus
                            />
                        </div>
                    </form>
                </div>
            )}
        </header>
    );
}
