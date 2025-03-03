"use server";

import { revalidatePath } from "next/cache";
import { toggleSavePost } from "../db";

export async function toggleSavePostAction(postId: string) {
    try {
        const result = await toggleSavePost(postId);

        revalidatePath("/");

        return result;
    } catch (error) {
        console.error("Error toggling saved post:", error);
        throw error;
    }
}
