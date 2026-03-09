import { getCurrentUser } from "@/lib/actions/gamification";
import { UserProvider } from "@/components/common/user-provider";
import { MainShell } from "@/components/layout/main-shell";

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    return (
        <UserProvider user={user}>
            <MainShell>{children}</MainShell>
        </UserProvider>
    );
}
