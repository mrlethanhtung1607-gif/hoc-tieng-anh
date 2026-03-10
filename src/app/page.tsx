import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  Trophy,
  Flame,
  ArrowRight,
  Globe,
  Zap,
  Users,
  Star,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Bài học tương tác",
    description: "Học qua flashcards, trắc nghiệm và bài tập thực hành sinh động.",
    color: "text-emerald-500",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    icon: Trophy,
    title: "Gamification",
    description: "Tích lũy XP, giữ streak hàng ngày và cạnh tranh trên bảng xếp hạng.",
    color: "text-amber-500",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    icon: Globe,
    title: "Lộ trình cá nhân",
    description: "Bài kiểm tra đầu vào xác định trình độ, gợi ý lộ trình phù hợp.",
    color: "text-sky-500",
    bg: "bg-sky-100 dark:bg-sky-900/30",
  },
  {
    icon: Zap,
    title: "Học mọi lúc",
    description: "Giao diện responsive, học trên điện thoại hay máy tính đều mượt mà.",
    color: "text-rose-500",
    bg: "bg-rose-100 dark:bg-rose-900/30",
  },
];

const STATS = [
  { value: "6+", label: "Cấp độ CEFR", icon: GraduationCap },
  { value: "50+", label: "Bài học", icon: BookOpen },
  { value: "100%", label: "Miễn phí", icon: Star },
  { value: "24/7", label: "Học mọi lúc", icon: Globe },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight">
              StudyEnglish<span className="text-emerald-500">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login">
              <Button variant="ghost" className="cursor-pointer text-sm font-medium">
                Đăng nhập
              </Button>
            </Link>
            <Link href="/register">
              <Button className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white text-sm shadow-lg shadow-emerald-500/20">
                Đăng ký miễn phí
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-background to-teal-50/50 dark:from-emerald-950/30 dark:via-background dark:to-teal-950/20" />
        <div className="absolute top-20 -left-20 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-900/20" />
        <div className="absolute bottom-10 -right-20 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-900/15" />
        <div className="absolute top-40 right-1/4 h-40 w-40 rounded-full bg-amber-200/20 blur-3xl dark:bg-amber-900/10" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-24 pb-16 sm:pb-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 mb-6">
              <Flame className="h-4 w-4" />
              <span className="font-medium">Nền tảng học Tiếng Anh #1 Việt Nam</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6">
              Học Tiếng Anh{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Miễn Phí
              </span>{" "}
              &{" "}
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                Thú Vị
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Chinh phục Tiếng Anh từ con số 0 đến thành thạo với phương pháp học tương tác,
              gamification và lộ trình cá nhân hóa. Hoàn toàn miễn phí!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12">
              <Link href="/register">
                <Button size="lg" className="cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-base px-8 h-13 shadow-xl shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:scale-[1.02]">
                  <Sparkles className="h-5 w-5" />
                  Bắt đầu học ngay
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="cursor-pointer gap-2 text-base px-8 h-13 border-2 hover:bg-muted/50 transition-all">
                  Tôi đã có tài khoản
                </Button>
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 text-center transition-all hover:border-emerald-200 hover:shadow-sm dark:hover:border-emerald-800">
                    <Icon className="h-5 w-5 text-emerald-500 mx-auto mb-1.5" />
                    <p className="text-2xl font-black text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 border-t border-border/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
              Tại sao chọn <span className="text-emerald-500">StudyEnglish AI</span>?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Phương pháp học hiện đại, kết hợp công nghệ và gamification để tạo trải nghiệm học tập hiệu quả nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-emerald-200 hover:shadow-lg hover:-translate-y-1 dark:hover:border-emerald-800">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} mb-4 transition-transform group-hover:scale-110`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-24 bg-muted/30 border-t border-border/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
              Bắt đầu trong <span className="text-amber-500">3 bước</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Đăng ký tài khoản", desc: "Tạo tài khoản miễn phí chỉ với email hoặc Google.", icon: Users, color: "from-emerald-500 to-teal-500" },
              { step: "2", title: "Làm bài kiểm tra", desc: "Xác định trình độ A0-B2 qua bài test nhanh 3 phút.", icon: GraduationCap, color: "from-amber-500 to-orange-500" },
              { step: "3", title: "Bắt đầu học", desc: "Theo lộ trình cá nhân, tích lũy XP và lên level!", icon: Zap, color: "from-sky-500 to-blue-500" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative text-center">
                  <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} shadow-lg mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 sm:right-4 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-black">
                    {item.step}
                  </div>
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 border-t border-border/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-8 sm:p-12 text-center text-white shadow-2xl shadow-emerald-500/20">
            <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-4xl font-black mb-4">
                Sẵn sàng chinh phục Tiếng Anh? 🚀
              </h2>
              <p className="text-emerald-100 max-w-lg mx-auto mb-8">
                Tham gia cùng hàng nghìn học viên đang tiến bộ mỗi ngày. Hoàn toàn miễn phí, không giới hạn!
              </p>
              <Link href="/register">
                <Button size="lg" className="cursor-pointer gap-2 bg-white text-emerald-700 hover:bg-emerald-50 text-base px-8 h-13 shadow-xl transition-all hover:scale-[1.02] font-bold">
                  <Sparkles className="h-5 w-5" />
                  Tạo tài khoản miễn phí
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold">
              StudyEnglish<span className="text-emerald-500">AI</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2025 StudyEnglish AI. Nền tảng học Tiếng Anh miễn phí cho người Việt.
          </p>
        </div>
      </footer>
    </div>
  );
}
