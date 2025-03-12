"use server";

import { searchComments } from "../db/search-comments";

export async function searchCommentsAction({
    query,
    sort = "relevant",
}: {
    query: string;
    sort?: string;
}) {
    try {
        if (!query || query.length < 2) {
            return {
                success: true,
                comments: [],
            };
        }

        const comments = await searchComments(query, sort);
        return { success: true, comments };
    } catch (error) {
        console.error("Error searching comments:", error);
        return {
            success: false,
            error: "Failed to search comments",
            comments: [],
        };
    }
}
