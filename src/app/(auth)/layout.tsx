export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-emerald-50/30 via-background to-teal-50/20 px-4 py-8">
            <div className="mb-8 text-center">
                <div className="flex items-center justify-center gap-2 text-2xl font-black">
                    <span className="text-emerald-600">📖</span>
                    <span>HocTiengAnh</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                    Nền tảng học Tiếng Anh toàn diện
                </p>
            </div>
            <div className="w-full max-w-md">{children}</div>
        </div>
    );
}
