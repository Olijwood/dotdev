"use server";

import { Prisma } from "@prisma/client";
import { PostListItem } from "@/features/posts/types";
import db from "@/lib/db";
import { currentUserId } from "@/server/actions/auth";

type SearchPostsParams = {
    query: string;
    sort?: string;
    limit?: number;
    offset?: number;
};

export async function searchPosts({
    query,
    sort = "relevant",
    limit = 10,
    offset = 0,
}: SearchPostsParams) {
    const userId = await currentUserId();
    if (!query || query.length < 2) return [];

    // Create a search query with proper escaping to prevent SQL injection
    const searchQuery = `%${query.replace(/%/g, "\\%").replace(/_/g, "\\_")}%`;

    try {
        let orderBy: Prisma.Sql;

        // Determine the sort order based on the sort parameter
        switch (sort) {
            case "recent":
                orderBy = Prisma.sql`"createdAt" DESC`;
                break;
            case "popular":
                orderBy = Prisma.sql`"combinedScore" DESC, p."createdAt" DESC`;
                break;
            case "relevant":
            default:
                // For relevance, prioritize matches in title, then description, then content
                orderBy = Prisma.sql`
          CASE 
            WHEN title ILIKE ${query + "%"} THEN 1
            WHEN title ILIKE ${"%" + query + "%"} THEN 2
            WHEN content ILIKE ${"%" + query + "%"} THEN 3
            ELSE 4
          END,
          "createdAt" DESC
        `;
                break;
        }

        const posts = await db.$queryRaw<PostListItem[]>(
            Prisma.sql`
        SELECT 
          p.id,
          p.title,
          p.slug,
          p.content,
          p."createdAt",
          p."bannerImgUrl",
          p.published,
          u.username,
          u.image as "userImage",

           -- Subquery counts
            COALESCE(comment_counts.count, 0) AS "commentCount",
            COALESCE(reaction_counts.count, 0) AS "reactionCount",
            COALESCE(save_counts.count, 0) AS "saveCount",

            -- Combined score calculation
            (
                COALESCE(comment_counts.count, 0) +
                COALESCE(reaction_counts.count, 0) +
                COALESCE(save_counts.count, 0)
            ) AS "combinedScore",

            -- Whether the current user has saved the post
            CASE WHEN su."userId" IS NOT NULL THEN true ELSE false END AS "isSaved"
        
        FROM "Post" p
        LEFT JOIN "User" u ON p."userId" = u.id

        LEFT JOIN (
            SELECT "postId", COUNT(*) AS count
            FROM "Comment"
            GROUP BY "postId"
        ) AS comment_counts ON comment_counts."postId" = p.id

        LEFT JOIN (
            SELECT "postId", COUNT(*) AS count
            FROM "Reaction"
            GROUP BY "postId"
        ) AS reaction_counts ON reaction_counts."postId" = p.id

        LEFT JOIN (
            SELECT "postId", COUNT(*) AS count
            FROM "SavedPost"
            GROUP BY "postId"
        ) AS save_counts ON save_counts."postId" = p.id

        LEFT JOIN "SavedPost" su ON su."postId" = p.id AND su."userId" = ${userId}

        WHERE 
          (p.title ILIKE ${searchQuery} OR 
           p.content ILIKE ${searchQuery})
          AND p.published = true
        ORDER BY ${orderBy}
        LIMIT ${limit}
        OFFSET ${offset}
      `,
        );
        return posts.map((post) => ({
            ...post,
            username: post.username ?? "Guest",
            userImage: post.userImage ?? "/hacker.png",
            commentCount: post.commentCount,
            reactionCount: post.reactionCount,
            saveCount: post.saveCount,
            isSaved: post.isSaved,
            bannerImgUrl: post.bannerImgUrl,
            createdAt: post.createdAt,
            slug: post.slug,
        }));
    } catch (error) {
        console.error("Error searching posts:", error);
        return [];
    }
}
