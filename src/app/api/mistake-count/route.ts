import { getMistakeCount } from "@/lib/actions/mistakes";
import { NextResponse } from "next/server";

export async function GET() {
    const count = await getMistakeCount();
    return NextResponse.json({ count });
}
