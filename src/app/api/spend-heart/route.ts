import { spendHeart } from "@/lib/actions/hearts";
import { NextResponse } from "next/server";

export async function POST() {
    const result = await spendHeart();
    return NextResponse.json(result);
}
