import { AdminShell } from "@/components/admin/admin-shell";
import { RegistrationChart, PopularCoursesChart } from "@/components/admin/charts";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
    const supabase = await createClient();

    const { count: userCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
    const { count: courseCount } = await supabase
        .from("courses")
        .select("*", { count: "exact", head: true });
    const { count: lessonCount } = await supabase
        .from("lessons")
        .select("*", { count: "exact", head: true });

    return (
        <AdminShell>
            <div className="p-4 sm:p-6 space-y-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">Người dùng</p>
                        <p className="text-3xl font-bold">{userCount ?? 0}</p>
                    </div>
                    <div className="rounded-xl border bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">Khóa học</p>
                        <p className="text-3xl font-bold">{courseCount ?? 0}</p>
                    </div>
                    <div className="rounded-xl border bg-card p-5 shadow-sm">
                        <p className="text-sm text-muted-foreground">Bài học</p>
                        <p className="text-3xl font-bold">{lessonCount ?? 0}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <RegistrationChart data={[]} />
                    <PopularCoursesChart data={[]} />
                </div>
            </div>
        </AdminShell>
    );
}
