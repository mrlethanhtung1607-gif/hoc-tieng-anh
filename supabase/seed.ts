import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

/**
 * Seed runner — executes seed.sql against your Supabase project.
 *
 * Usage:
 *   npx tsx supabase/seed.ts
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars
 * (service role key bypasses RLS for seeding).
 */
async function main() {
    const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        console.error(
            "❌ Missing env vars. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
        );
        console.error(
            "   Hint: Use service role key (not anon key) to bypass RLS."
        );
        process.exit(1);
    }

    const supabase = createClient(url, key);
    const seedPath = path.join(__dirname, "seed.sql");
    const sql = fs.readFileSync(seedPath, "utf-8");

    console.log("🌱 Running seed.sql...");

    const { error } = await supabase.rpc("exec_sql", { sql_query: sql });

    if (error) {
        // If the RPC doesn't exist, print manual instructions
        console.warn("⚠️  The exec_sql RPC is not available.");
        console.log("\n📋 Please run seed.sql manually:");
        console.log("   1. Open Supabase Dashboard → SQL Editor");
        console.log("   2. Paste the contents of supabase/seed.sql");
        console.log("   3. Click 'Run'\n");
        console.log("   Or use Supabase CLI:");
        console.log("   supabase db reset   (runs both schema + seed)\n");
    } else {
        console.log("✅ Seed data inserted successfully!");
    }
}

main();
