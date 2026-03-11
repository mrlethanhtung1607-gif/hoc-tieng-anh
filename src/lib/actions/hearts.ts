"use server";

import { createClient } from "@/lib/supabase/server";

const MAX_HEARTS = 5;

// ── Check and auto-reset hearts daily ────────────────────
// If last_heart_reset is not today and hearts < 5, refill to 5
// If hearts >= 5 (from farming stories), keep as-is
export async function checkAndResetHearts() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
        .from("profiles")
        .select("hearts, last_heart_reset")
        .eq("id", user.id)
        .single();

    if (!profile) return null;

    const today = new Date().toISOString().split("T")[0];
    const lastReset = profile.last_heart_reset;
    let currentHearts = Math.min(profile.hearts ?? MAX_HEARTS, MAX_HEARTS);

    if (lastReset !== today) {
        // New day: refill to MAX if below, clamp if above
        if (currentHearts < MAX_HEARTS) {
            currentHearts = MAX_HEARTS;
        }
        await supabase
            .from("profiles")
            .update({ hearts: currentHearts, last_heart_reset: today })
            .eq("id", user.id);
    }

    return { hearts: currentHearts, max: MAX_HEARTS };
}

// ── Spend 1 heart (before starting a unit) ───────────────
// Returns { success, hearts } or { error }
export async function spendHeart() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Chưa đăng nhập" };

    // First check/reset
    await checkAndResetHearts();

    const { data: profile } = await supabase
        .from("profiles")
        .select("hearts")
        .eq("id", user.id)
        .single();

    if (!profile) return { error: "Profile không tồn tại" };

    const current = profile.hearts ?? 0;
    if (current <= 0) {
        return { error: "Hết tim", noHearts: true, hearts: 0 };
    }

    const newHearts = current - 1;
    await supabase
        .from("profiles")
        .update({ hearts: newHearts })
        .eq("id", user.id);

    return { success: true, hearts: newHearts };
}

// ── Get current hearts count ─────────────────────────────
export async function getHearts() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return 0;

    // Check/reset first
    await checkAndResetHearts();

    const { data: profile } = await supabase
        .from("profiles")
        .select("hearts")
        .eq("id", user.id)
        .single();

    return Math.min(profile?.hearts ?? MAX_HEARTS, MAX_HEARTS);
}

// ── Add hearts (from story completion) ───────────────────
export async function addHearts(amount: number) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Chưa đăng nhập" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("hearts")
        .eq("id", user.id)
        .single();

    if (!profile) return { error: "Profile không tồn tại" };

    const newHearts = Math.min((profile.hearts ?? 0) + amount, MAX_HEARTS);
    await supabase
        .from("profiles")
        .update({ hearts: newHearts })
        .eq("id", user.id);

    return { success: true, hearts: newHearts, maxed: newHearts >= MAX_HEARTS };
}
