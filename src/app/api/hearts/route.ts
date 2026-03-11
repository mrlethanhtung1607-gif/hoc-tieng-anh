import { getHearts } from "@/lib/actions/hearts";
import { NextResponse } from "next/server";

export async function GET() {
    const hearts = await getHearts();
    return NextResponse.json({ hearts });
}
