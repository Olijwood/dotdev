"use server";

import { getPosts } from "@/features/posts/server/db";
import { searchPosts } from "../db/search-posts";

export async function searchPostsAction({
    query,
    sort = "relevant",
}: {
    query: string;
    sort?: string;
}) {
    try {
        if (!query || query.length < 2) {
            const posts = await getPosts();
            return {
                success: true,
                posts,
            };
        }

        const posts = await searchPosts({ query, sort });

        return {
            success: true,
            posts,
        };
    } catch (error) {
        console.error("Error in searchPostsAction:", error);
        return {
            success: false,
            error: "Failed to search posts",
        };
    }
}
