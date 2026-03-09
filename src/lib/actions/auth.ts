"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function loginWithEmail(formData: FormData) {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    });

    if (error) {
        return { error: error.message };
    }

    redirect("/dashboard");
}

export async function registerWithEmail(formData: FormData) {
    const supabase = await createClient();
    const origin = (await headers()).get("origin");

    const { error } = await supabase.auth.signUp({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        options: {
            data: {
                display_name: formData.get("name") as string,
            },
            emailRedirectTo: `${origin}/callback`,
        },
    });

    if (error) {
        return { error: error.message };
    }

    redirect("/onboarding");
}

export async function loginWithGoogle(_formData: FormData) {
    const supabase = await createClient();
    const origin = (await headers()).get("origin");

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${origin}/callback`,
        },
    });

    if (error) {
        throw new Error(error.message);
    }

    redirect(data.url);
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
}

export async function completeOnboarding(formData: FormData) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const age = parseInt(formData.get("age") as string, 10);
    const learningGoal = formData.get("learning_goal") as string;

    const { error } = await supabase
        .from("profiles")
        .update({
            age,
            learning_goal: learningGoal,
        })
        .eq("id", user.id);

    if (error) {
        return { error: error.message };
    }

    redirect("/dashboard");
}
