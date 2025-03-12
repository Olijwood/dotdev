"use server";

import { Prisma } from "@prisma/client";
import db from "@/lib/db";

export async function searchPeople(
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
                orderBy = Prisma.sql`u."createdAt" DESC`;
                break;
            case "popular":
                orderBy = Prisma.sql`"postCount" DESC`;
                break;
            case "relevant":
            default:
                // For relevance, prioritize exact username matches, then name matches
                orderBy = Prisma.sql`
          CASE 
            WHEN u.username ILIKE ${query + "%"} THEN 1
            WHEN u.username ILIKE ${"%" + query + "%"} THEN 2
            WHEN u.name ILIKE ${query + "%"} THEN 3
            WHEN u.name ILIKE ${"%" + query + "%"} THEN 4
            ELSE 5
          END,
          "postCount" DESC
        `;
                break;
        }

        const users = await db.$queryRaw<
            Array<{
                id: string;
                username: string | null;
                name: string;
                image: string | null;
                createdAt: Date;
                postCount: number;
            }>
        >(
            Prisma.sql`
        SELECT 
          u.id,
          u.username,
          u.name,
          u.image,
          u."createdAt", 
          COUNT(p.id) AS "postCount"
        FROM "User" u
        LEFT JOIN "Post" p ON p."userId" = u.id AND p.published = true
        WHERE 
          (u.username ILIKE ${searchQuery} OR u.name ILIKE ${searchQuery})
        GROUP BY u.id
        ORDER BY ${orderBy}
        LIMIT ${limit}
        OFFSET ${offset}
      `,
        );

        return users.map((user) => ({
            id: user.id,
            username:
                user.username || user.name.toLowerCase().replace(/\s+/g, ""),
            name: user.name,
            image: user.image || "/hacker.png",
            joinedAt: user.createdAt,
            postCount: Number(user.postCount) || 0,
        }));
    } catch (error) {
        console.error("Error searching people:", error);
        return [];
    }
}
