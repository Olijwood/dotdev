"use server";

// import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

export async function githubAuthenticate() {
    try {
        await signIn("github", { redirectTo: "/" });
    } catch (error) {
        if (error instanceof AuthError) {
            return "GitHub log in failed";
        }
        throw error;
    }
}
