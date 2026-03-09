"use client";

import { useEffect } from "react";
import { useUserStore } from "@/stores/user-store";

interface UserProviderProps {
    user: {
        id: string;
        email: string;
        display_name: string;
        avatar_url: string | null;
        total_xp: number;
        current_streak: number;
        longest_streak: number;
        [key: string]: unknown;
    } | null;
    children: React.ReactNode;
}

export function UserProvider({ user, children }: UserProviderProps) {
    const setUser = useUserStore((s) => s.setUser);

    useEffect(() => {
        setUser(user as Parameters<typeof setUser>[0]);
    }, [user, setUser]);

    return <>{children}</>;
}
