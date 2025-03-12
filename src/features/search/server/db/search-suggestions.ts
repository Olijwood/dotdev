"use server";

import { Prisma } from "@prisma/client";
import db from "@/lib/db";

export type SearchSuggestion = {
    text: string;
    type: "post" | "comment" | "user";
};

export async function getSearchSuggestions(
    query: string,
    limit: number = 5,
): Promise<SearchSuggestion[]> {
    if (!query || query.length < 2) return [];

    // Create a search query with proper escaping to prevent SQL injection
    const searchQuery = `%${query.replace(/%/g, "\\%").replace(/_/g, "\\_")}%`;

    try {
        // Get post title suggestions
        const postSuggestions = await db.$queryRaw<
            Array<{ title: string; relevance?: number; title_length?: number }>
        >(
            Prisma.sql`
        WITH ranked_titles AS (
          SELECT 
            title,
            CASE 
              WHEN title ILIKE ${query + "%"} THEN 1
              WHEN title ILIKE ${"%" + query + "%"} THEN 2
              ELSE 3
            END AS relevance,
            LENGTH(title) AS title_length
          FROM "Post" 
          WHERE title ILIKE ${searchQuery} AND published = true
        )
        SELECT DISTINCT title, relevance, title_length
        FROM ranked_titles
        ORDER BY relevance, title_length ASC
        LIMIT ${Math.ceil(limit / 3)}
      `,
        );

        // Get user suggestions
        const userSuggestions = await db.$queryRaw<
            Array<{
                username: string;
                relevance?: number;
                name_length?: number;
            }>
        >(
            Prisma.sql`
        WITH ranked_users AS (
          SELECT 
            username,
            CASE 
              WHEN username ILIKE ${query + "%"} THEN 1
              WHEN username ILIKE ${"%" + query + "%"} THEN 2
              ELSE 3
            END AS relevance,
            LENGTH(username) AS name_length
          FROM "User" 
          WHERE username ILIKE ${searchQuery}
        )
        SELECT DISTINCT username, relevance, name_length
        FROM ranked_users
        ORDER BY relevance, name_length ASC
        LIMIT ${Math.ceil(limit / 3)}
      `,
        );

        // Get comment content suggestions
        const commentSuggestions = await db.$queryRaw<
            Array<{
                content: string;
                relevance?: number;
                content_length?: number;
            }>
        >(
            Prisma.sql`
        WITH ranked_comments AS (
          SELECT 
            content,
            CASE 
              WHEN content ILIKE ${query + "%"} THEN 1
              WHEN content ILIKE ${"%" + query + "%"} THEN 2
              ELSE 3
            END AS relevance,
            LENGTH(content) AS content_length
          FROM "Comment" 
          WHERE content ILIKE ${searchQuery}
        )
        SELECT DISTINCT content, relevance, content_length
        FROM ranked_comments
        ORDER BY relevance, content_length ASC
        LIMIT ${Math.ceil(limit / 3)}
      `,
        );

        // Combine and format suggestions
        const formattedPostSuggestions = postSuggestions.map((post) => ({
            text: post.title,
            type: "post" as const,
        }));

        const formattedUserSuggestions = userSuggestions.map((user) => ({
            text: user.username,
            type: "user" as const,
        }));

        const formattedCommentSuggestions = commentSuggestions.map(
            (comment) => {
                // Truncate long comments for display
                const truncatedContent =
                    comment.content.length > 50
                        ? comment.content.substring(0, 47) + "..."
                        : comment.content;

                return {
                    text: truncatedContent,
                    type: "comment" as const,
                };
            },
        );

        // Combine all suggestions and limit to the requested amount
        const allSuggestions = [
            ...formattedPostSuggestions,
            ...formattedUserSuggestions,
            ...formattedCommentSuggestions,
        ].slice(0, limit);

        return allSuggestions;
    } catch (error) {
        console.error("Error getting search suggestions:", error);
        return [];
    }
}
