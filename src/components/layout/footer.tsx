import Link from "next/link";
import { BookOpen, Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const QUICK_LINKS = [
    { label: "Lộ trình học", href: "/lessons" },
    { label: "Bảng xếp hạng", href: "/leaderboard" },
    { label: "Luyện tập", href: "/practice" },
] as const;

const SUPPORT_LINKS = [
    { label: "Giới thiệu", href: "/about" },
    { label: "Hướng dẫn sử dụng", href: "/guide" },
    { label: "Chính sách bảo mật", href: "/privacy" },
] as const;

export function Footer() {
    return (
        <footer className="border-t border-border bg-muted/30">
            <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-3">
                        <Link href="/" className="flex items-center gap-2 font-bold">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white text-sm font-black">
                                H
                            </span>
                            <span className="text-lg">HocTiengAnh</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Nền tảng học Tiếng Anh toàn diện cho mọi lứa tuổi — từ trẻ em đến
                            người lớn, từ A1 đến C2.
                        </p>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-emerald-500" />
                            Học tập
                        </h3>
                        <ul className="space-y-2">
                            {QUICK_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold">Hỗ trợ</h3>
                        <ul className="space-y-2">
                            {SUPPORT_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold">Liên hệ</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-emerald-500 shrink-0" />
                                contact@hoctienganh.vn
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                                0123 456 789
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                Hà Nội, Việt Nam
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="my-6" />

                <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
                    <p className="text-xs text-muted-foreground">
                        © 2026 HocTiengAnh. All rights reserved.
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Made with ❤️ for learners everywhere
                    </p>
                </div>
            </div>
        </footer>
    );
}
