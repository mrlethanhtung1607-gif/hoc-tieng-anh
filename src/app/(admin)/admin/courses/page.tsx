import { AdminShell } from "@/components/admin/admin-shell";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function AdminCoursesPage() {
    const supabase = await createClient();
    const { data: courses } = await supabase
        .from("courses")
        .select("*, level:levels(name)")
        .order("created_at", { ascending: false });

    return (
        <AdminShell>
            <div className="p-4 sm:p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Quản lý Khóa học</h1>
                    <Button size="sm" className="gap-1 cursor-pointer">
                        <Plus className="h-4 w-4" /> Thêm khóa học
                    </Button>
                </div>
                <div className="rounded-xl border bg-card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="text-left p-3 font-medium">Tên</th>
                                <th className="text-left p-3 font-medium">Cấp độ</th>
                                <th className="text-left p-3 font-medium">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses?.map((course) => (
                                <tr key={course.id} className="border-t">
                                    <td className="p-3 font-medium">{course.title}</td>
                                    <td className="p-3 text-muted-foreground">{(course.level as { name: string } | null)?.name ?? "—"}</td>
                                    <td className="p-3">
                                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            Active
                                        </span>
                                    </td>
                                </tr>
                            )) ?? (
                                    <tr>
                                        <td colSpan={3} className="p-6 text-center text-muted-foreground">
                                            Chưa có khóa học nào.
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminShell>
    );
}
