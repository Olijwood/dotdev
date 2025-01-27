"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

export async function googleAuthenticate() {
    try {
        await signIn("google", {
            redirectTo: "/",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            return "google log in failed";
        }
        throw error;
    }
}
