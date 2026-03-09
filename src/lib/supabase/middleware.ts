import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/", "/login", "/register", "/callback"];
const ADMIN_ROUTES = ["/admin"];
const ONBOARDING_ROUTE = "/onboarding";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });
    const pathname = request.nextUrl.pathname;

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Allow public routes without auth
    const isPublic = PUBLIC_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    // Not logged in → redirect to login (except public routes)
    if (!user && !isPublic) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // Logged in → redirect away from auth pages
    if (user && (pathname === "/login" || pathname === "/register")) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    // Check onboarding status for logged-in users on protected routes
    if (user && !isPublic && pathname !== ONBOARDING_ROUTE) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("age, learning_goal, role")
            .eq("id", user.id)
            .single();

        // Need onboarding
        if (profile && (!profile.age || !profile.learning_goal)) {
            const url = request.nextUrl.clone();
            url.pathname = ONBOARDING_ROUTE;
            return NextResponse.redirect(url);
        }

        // Admin route protection
        const isAdminRoute = ADMIN_ROUTES.some((route) =>
            pathname.startsWith(route)
        );
        if (isAdminRoute && profile?.role !== "admin") {
            const url = request.nextUrl.clone();
            url.pathname = "/dashboard";
            return NextResponse.redirect(url);
        }
    }

    return supabaseResponse;
}
