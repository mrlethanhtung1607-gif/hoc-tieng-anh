import { Shield, Lock, Eye, Users, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
                {/* Back link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft className="h-4 w-4" /> Quay lại trang chủ
                </Link>

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                        <Shield className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                            Chính sách bảo mật
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Cập nhật lần cuối: 11/03/2026
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="prose prose-sm dark:prose-invert max-w-none space-y-8">
                    {/* 1. Giới thiệu */}
                    <section>
                        <h2 className="flex items-center gap-2 text-lg font-bold">
                            <Shield className="h-5 w-5 text-emerald-500" />
                            1. Giới thiệu chung
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Chào mừng bạn đến với <strong>HocTiengAnh</strong> — nền tảng học Tiếng Anh trực tuyến dành cho mọi lứa tuổi.
                            Chúng tôi hiểu rằng quyền riêng tư của bạn là vô cùng quan trọng.
                            Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn
                            khi bạn sử dụng ứng dụng.
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Bằng việc sử dụng HocTiengAnh, bạn đồng ý với các điều khoản trong chính sách này.
                            Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.
                        </p>
                    </section>

                    {/* 2. Thu thập thông tin */}
                    <section>
                        <h2 className="flex items-center gap-2 text-lg font-bold">
                            <Eye className="h-5 w-5 text-emerald-500" />
                            2. Thông tin chúng tôi thu thập
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Khi bạn đăng ký và sử dụng HocTiengAnh, chúng tôi có thể thu thập các thông tin sau:
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-2 list-none pl-0">
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-500 mt-0.5">•</span>
                                <span><strong>Thông tin tài khoản:</strong> Địa chỉ email, tên hiển thị, ảnh đại diện (nếu có).</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-500 mt-0.5">•</span>
                                <span><strong>Dữ liệu học tập:</strong> Tiến trình bài học, điểm XP, chuỗi ngày học (Streak), trình độ hiện tại (A0–C2).</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-500 mt-0.5">•</span>
                                <span><strong>Lỗi sai:</strong> Các câu hỏi bạn trả lời sai được lưu lại để phục vụ tính năng ôn tập (Spaced Repetition).</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-500 mt-0.5">•</span>
                                <span><strong>Cài đặt cá nhân:</strong> Tùy chọn giao diện (sáng/tối), âm thanh, thông báo email.</span>
                            </li>
                        </ul>
                    </section>

                    {/* 3. Sử dụng thông tin */}
                    <section>
                        <h2 className="flex items-center gap-2 text-lg font-bold">
                            <Users className="h-5 w-5 text-emerald-500" />
                            3. Cách chúng tôi sử dụng thông tin
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Thông tin của bạn được sử dụng cho các mục đích sau:
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-2 list-none pl-0">
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-500 mt-0.5">✓</span>
                                <span><strong>Cá nhân hóa lộ trình học:</strong> Dựa trên trình độ và lịch sử học tập để đề xuất bài học phù hợp.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-500 mt-0.5">✓</span>
                                <span><strong>Ôn tập thông minh:</strong> Sử dụng dữ liệu lỗi sai để tạo bài ôn tập cá nhân hóa.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-500 mt-0.5">✓</span>
                                <span><strong>Bảng xếp hạng:</strong> Hiển thị tên và điểm XP trên Leaderboard để tạo động lực học tập.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-500 mt-0.5">✓</span>
                                <span><strong>Cải thiện dịch vụ:</strong> Phân tích xu hướng học tập tổng thể (ẩn danh) để nâng cấp nội dung.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-500 mt-0.5">✓</span>
                                <span><strong>Nhắc nhở học tập:</strong> Gửi email nhắc nhở hàng ngày nếu bạn bật tính năng này trong Cài đặt.</span>
                            </li>
                        </ul>
                    </section>

                    {/* 4. Cam kết bảo mật */}
                    <section>
                        <h2 className="flex items-center gap-2 text-lg font-bold">
                            <Lock className="h-5 w-5 text-emerald-500" />
                            4. Cam kết bảo mật
                        </h2>
                        <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/10 p-4 space-y-3">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Chúng tôi cam kết:
                            </p>
                            <ul className="text-sm text-muted-foreground space-y-2 list-none pl-0">
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 font-bold">🔒</span>
                                    <span><strong>Không bán</strong> dữ liệu cá nhân của bạn cho bất kỳ bên thứ ba nào.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 font-bold">🔒</span>
                                    <span><strong>Không chia sẻ</strong> thông tin nhạy cảm với các tổ chức quảng cáo.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 font-bold">🔒</span>
                                    <span><strong>Mã hóa</strong> dữ liệu truyền tải bằng giao thức HTTPS/TLS.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 font-bold">🔒</span>
                                    <span>Sử dụng <strong>Supabase RLS</strong> (Row Level Security) để đảm bảo mỗi người chỉ truy cập được dữ liệu của mình.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 font-bold">🔒</span>
                                    <span>Bạn có quyền <strong>yêu cầu xóa tài khoản</strong> và toàn bộ dữ liệu liên quan bất cứ lúc nào.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* 5. Quyền của bạn */}
                    <section>
                        <h2 className="flex items-center gap-2 text-lg font-bold">
                            <Users className="h-5 w-5 text-emerald-500" />
                            5. Quyền của bạn
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Bạn có toàn quyền kiểm soát dữ liệu cá nhân của mình:
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1.5 list-none pl-0">
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-500 mt-0.5">•</span>
                                <span>Truy cập và chỉnh sửa thông tin cá nhân tại trang <strong>Hồ sơ</strong>.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-500 mt-0.5">•</span>
                                <span>Tắt thông báo email trong phần <strong>Cài đặt</strong>.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-500 mt-0.5">•</span>
                                <span>Yêu cầu xuất hoặc xóa toàn bộ dữ liệu bằng cách liên hệ với chúng tôi.</span>
                            </li>
                        </ul>
                    </section>

                    {/* 6. Liên hệ */}
                    <section>
                        <h2 className="flex items-center gap-2 text-lg font-bold">
                            <Mail className="h-5 w-5 text-emerald-500" />
                            6. Thông tin liên hệ
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Nếu bạn có bất kỳ câu hỏi hay yêu cầu nào liên quan đến chính sách bảo mật,
                            vui lòng liên hệ:
                        </p>
                        <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground space-y-1.5">
                            <p>📧 Email: <strong>contact@hoctienganh.vn</strong></p>
                            <p>📱 Điện thoại: <strong>0839 333 192</strong></p>
                            <p>📍 Địa chỉ: <strong>Ninh Bình, Việt Nam</strong></p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
