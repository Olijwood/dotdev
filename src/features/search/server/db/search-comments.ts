"use server";

import { Prisma } from "@prisma/client";
import db from "@/lib/db";

export async function searchComments(
    query: string,
    sort: string = "relevant",
    limit: number = 10,
    offset: number = 0,
) {
    if (!query || query.length < 2) return [];

    // Create a search query with proper escaping to prevent SQL injection
    const searchQuery = `%${query.replace(/%/g, "\\%").replace(/_/g, "\\_")}%`;

    try {
        let orderBy: Prisma.Sql;

        // Determine the sort order based on the sort parameter
        switch (sort) {
            case "recent":
                orderBy = Prisma.sql`c."createdAt" DESC`;
                break;
            case "popular":
                orderBy = Prisma.sql`c.likes DESC`;
                break;
            case "relevant":
            default:
                // For relevance, prioritize content matches
                orderBy = Prisma.sql`
          CASE 
            WHEN c.content ILIKE ${query + "%"} THEN 1
            WHEN c.content ILIKE ${"%" + query + "%"} THEN 2
            ELSE 3
          END,
          c."createdAt" DESC
        `;
                break;
        }

        const comments = await db.$queryRaw<
            Array<{
                id: string;
                content: string;
                createdAt: Date;
                postId: string;
                postTitle: string;
                postSlug: string;
                username: string | null;
                userImage: string | null;
                likes: number;
            }>
        >(
            Prisma.sql`
        SELECT 
          c.id,
          c.content,
          c."createdAt",
          c."postId",
          p.title as "postTitle",
          p.slug as "postSlug",
          u.username,
          u.image as "userImage",
          c.likes
        FROM "Comment" c
        JOIN "Post" p ON c."postId" = p.id
        JOIN "User" u ON c."userId" = u.id
        WHERE 
          c.content ILIKE ${searchQuery}
          AND p.published = true
        ORDER BY ${orderBy}
        LIMIT ${limit}
        OFFSET ${offset}
      `,
        );

        return comments.map((comment) => ({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            postId: comment.postId,
            postTitle: comment.postTitle,
            postSlug: comment.postSlug,
            username: comment.username || "",
            userImage: comment.userImage || "",
            likes: Number(comment.likes) || 0,
        }));
    } catch (error) {
        console.error("Error searching comments:", error);
        return [];
    }
}
