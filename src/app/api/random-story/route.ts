import { getRandomStoryId } from "@/lib/actions/stories";
import { NextResponse } from "next/server";

export async function GET() {
    const id = await getRandomStoryId();
    if (!id) {
        return NextResponse.json({ error: "Không có truyện nào" }, { status: 404 });
    }
    return NextResponse.json({ id });
}
