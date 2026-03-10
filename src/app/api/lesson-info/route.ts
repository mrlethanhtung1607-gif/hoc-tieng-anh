import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
        return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const supabase = await createClient();

    // Get user's current level for dynamic difficulty
    const {
        data: { user },
    } = await supabase.auth.getUser();

    let level = "A1";
    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("current_level")
            .eq("id", user.id)
            .single();
        if (profile?.current_level) {
            level = profile.current_level;
        }
    }

    // Get lesson title
    const { data: lesson } = await supabase
        .from("lessons")
        .select("title")
        .eq("id", id)
        .single();

    if (!lesson) {
        return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    return NextResponse.json({
        title: lesson.title,
        level,
    });
}
