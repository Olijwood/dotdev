"use server";

import { Prisma, ReactionType } from "@prisma/client";
import db from "@/lib/db";
import { currentUserId } from "@/server/actions/auth";
import { PostForCreate } from "../../types";
import { addTagToPost, getOrCreateTag, updatePostTags } from "./tags";

const postFilterMap = {
    isFollowing: (userId?: string) =>
        userId
            ? Prisma.sql`p."userId" IN (SELECT "followingId" FROM "Follow" WHERE "followerId" = ${userId}) OR p.id IN (
                        SELECT pt."postId" 
                        FROM "PostTag" pt
                        INNER JOIN "TagFollow" tf ON pt."tagId" = tf."tagId"
                        WHERE tf."userId" = ${userId}
                    )`
            : Prisma.empty,
    isSaved: (userId?: string) =>
        userId
            ? Prisma.sql`EXISTS (
                SELECT 1 FROM "SavedPost" s
                WHERE s."postId" = p.id AND s."userId" = ${userId}
            )`
            : Prisma.empty,
    byUserId: (userId?: string) =>
        userId ? Prisma.sql`p."userId" = ${userId}` : Prisma.empty,

    byTag: (tagName?: string) =>
        tagName
            ? Prisma.sql`EXISTS (
                SELECT 1 FROM "PostTag" pt
                INNER JOIN "Tag" t ON pt."tagId" = t.id
                WHERE pt."postId" = p.id AND t.name = ${tagName}
            )`
            : Prisma.empty,
};

export type PostFilters = {
    isFollowing?: boolean;
    isSaved?: boolean;
    byUserId?: string;
    byTag?: string;
};

type AllPostsQuery = {
    id: string;
    title: string;
    slug: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    published: boolean;
    bannerImgUrl: string | null;
    username: string;
    userImage: string | null;
    commentCount: number;
    reactionCount: number;
    combinedScore: number;
    saveCount: number;
    isSaved: boolean;
    tags: {
        id: string;
        name: string;
        description: string | null;
        color: string;
        badge: string | null;
    }[];
};
export type PostsSortType = "latest" | "top";

/**
 * Constructs the WHERE condition dynamically based on provided filters.
 */
function buildWhereClause(filters: PostFilters, userId?: string): Prisma.Sql {
    const conditions: Prisma.Sql[] = [Prisma.sql`p.published = true`];

    if (filters.isFollowing) {
        conditions.push(postFilterMap.isFollowing(userId));
    }
    if (filters.byUserId) {
        conditions.push(postFilterMap.byUserId(filters.byUserId));
    }
    if (filters.byTag) {
        conditions.push(postFilterMap.byTag(filters.byTag));
    }
    if (filters.isSaved) {
        conditions.push(postFilterMap.isSaved(userId));
    }

    return conditions.length
        ? Prisma.sql`WHERE ${Prisma.join(conditions, ` AND `)}`
        : Prisma.empty;
}

export async function getPosts(
    filters: PostFilters = {},
    sort: PostsSortType = "latest",
) {
    const userId = await currentUserId();

    const where = buildWhereClause(filters, userId);

    const isTop = sort === "top";

    const combinedScoreSelect = Prisma.sql`
        COALESCE(cd."commentCount", 0) + 
        COALESCE(cd."reactionCount", 0) + 
        COALESCE(cd."saveCount", 0) AS "combinedScore",
    `;

    const orderBy = isTop
        ? Prisma.sql`ORDER BY "combinedScore" DESC, p."createdAt" DESC`
        : Prisma.sql`ORDER BY p."createdAt" DESC`;

    const posts = await db.$queryRaw<Array<AllPostsQuery>>(Prisma.sql`

    SELECT 
        p.id,
        p.title,
        p.slug,
        p.content,
        p."createdAt",
        p."updatedAt",
        p.published,
        p."bannerImgUrl",
        u.username,
        u.image AS "userImage",
          
        cd."commentCount",
        cd."reactionCount",
        cd."saveCount",
        ${combinedScoreSelect}
       
        -- Whether the current user has saved the post
        EXISTS (SELECT 1 FROM "SavedPost" sp WHERE sp."postId" = p.id AND sp."userId" = ${userId}) AS "isSaved",

        -- Full tag details
        (SELECT jsonb_agg(
        DISTINCT jsonb_build_object(
            'id', t.id,
            'name', t.name,
            'description', t.description,
            'color', t.color,
            'badge', t.badge
            )) 
        FILTER (WHERE t.id IS NOT NULL)
        FROM "PostTag" pt
        LEFT JOIN "Tag" t ON t.id = pt."tagId"
        WHERE pt."postId" = p.id) AS "tags"
          
    FROM "Post" p
    LEFT JOIN "User" u ON u.id = p."userId"
    LEFT JOIN (
        WITH count_data AS (
            SELECT 
                p.id as "postId",
                COUNT(DISTINCT c.id) AS "commentCount",
                COUNT(r."postId") AS "reactionCount",
                COUNT(DISTINCT sp.id) AS "saveCount"
            FROM "Post" p
            LEFT JOIN (
                SELECT id, "postId"
                FROM "Comment"
            ) AS c ON c."postId" = p.id
            LEFT JOIN ( 
                SELECT "postId"
                FROM "Reaction" 
            ) AS r ON r."postId" = p.id
            LEFT JOIN (
                SELECT id, "postId"
                FROM "SavedPost"
            ) AS sp ON sp."postId" = p.id
            GROUP BY p.id
        )
        SELECT * FROM count_data
    ) AS cd ON cd."postId" = p.id

    ${where}
    ${orderBy}  
    `);

    return posts.map((post) => ({
        ...post,
        username: post.username ?? "Guest",
        userImage: post.userImage ?? "/hacker.png",
        commentCount: post.commentCount,
        bannerImgUrl: post.bannerImgUrl ?? "",
        reactionCount: post.reactionCount,
        saveCount: post.saveCount,
        isSaved: post.isSaved,
        tags: post.tags || [],
    }));
}

type PostContentQuery = {
    id: string;
    title: string;
    slug: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    published: boolean;
    bannerImgUrl: string | null;
    userId: string;

    commentCount: number;
    reactionCount: number;
    saveCount: number;
    isSaved: boolean;

    authorId: string;
    username: string | null;
    authorImage: string | null;
    authorCreatedAt: Date;
    authorBio: string | null;

    tags: {
        id: string;
        name: string;
        description: string | null;
        color: string;
        badge: string | null;
    }[];

    reactions: {
        type: ReactionType;
        userId: string;
        username: string;
        userImage: string | null;
    }[];
};
export async function getPostBySlug(slug: string) {
    const cUserId = await currentUserId();

    const result = await db.$queryRaw<Array<PostContentQuery>>(Prisma.sql`
        SELECT
            p.id,
            p.title,
            p.slug,
            p.content,
            p."createdAt",
            p."updatedAt",
            p.published,
            p."bannerImgUrl",
            p."userId",

            u.id as "authorId",
            u.username,
            u.bio as "authorBio",
            u.image AS "authorImage",
            u."createdAt" AS "authorCreatedAt",

            -- Count related data
            (SELECT COUNT(*) FROM "Comment" c WHERE c."postId" = p.id) AS "commentCount",
            (SELECT COUNT(*) FROM "Reaction" r WHERE r."postId" = p.id) AS "reactionCount",
            (SELECT COUNT(*) FROM "SavedPost" sp WHERE sp."postId" = p.id) AS "saveCount",

            -- Whether the current user has saved the post
            EXISTS (SELECT 1 FROM "SavedPost" sp WHERE sp."postId" = p.id AND sp."userId" = ${cUserId}) AS "isSaved",

            -- Full tag details
            (SELECT jsonb_agg(
                DISTINCT jsonb_build_object(
                    'id', t.id,
                    'name', t.name,
                    'description', t.description,
                    'color', t.color,
                    'badge', t.badge
                )
            ) FILTER (WHERE t.id IS NOT NULL)
            FROM "PostTag" pt
            LEFT JOIN "Tag" t ON t.id = pt."tagId"
            WHERE pt."postId" = p.id) AS "tags",

            -- Reactions list
            (SELECT jsonb_agg(
                DISTINCT jsonb_build_object(
                    'type', r.type,
                    'userId', ru.id,
                    'username', ru.username,
                    'userImage', ru.image
                )
            ) FILTER (WHERE r."userId" IS NOT NULL)
            FROM "Reaction" r
            LEFT JOIN "User" ru ON ru.id = r."userId"
            WHERE r."postId" = p.id) AS "reactions"

        FROM "Post" p
        LEFT JOIN (
            SELECT "id", "createdAt", "username", "image", "bio"
            FROM "User"
        ) AS u ON u.id = p."userId"
        WHERE p.slug = ${slug}
    `);

    if (!result || result.length === 0) return null;

    const post = result[0];

    return {
        ...post,
        author: {
            id: post.authorId,
            username: post.username ?? "Guest",
            image: post.authorImage ?? "/hacker.png",
            createdAt: post.authorCreatedAt,
            bio: post.authorBio ?? "",
        },
        commentCount: post.commentCount ?? 0,
        reactionCount: post.reactionCount ?? 0,
        saveCount: post.saveCount ?? 0,
        isSaved: post.isSaved ?? false,
        tags: post.tags || [],
        reactions: post.reactions || [],
    };
}

export async function getUpToXPostLinksByAuthorId(
    authorId: string,
    limit: number = 3,
    notPostSlug?: string,
) {
    const notPostWhere = notPostSlug
        ? Prisma.sql`AND slug != ${notPostSlug}`
        : Prisma.empty;
    const result = await db.$queryRaw<
        Array<{
            title: string;
            slug: string;
        }>
    >(Prisma.sql`
        SELECT title, slug
        FROM "Post"
        WHERE "userId" = ${authorId} ${notPostWhere}
        ORDER BY RANDOM()
        LIMIT ${limit}
    `);
    if (!result || result.length === 0) return [];

    console.log("result", result);

    return result;
}
export async function postBySlugExists(slug: string) {
    return (
        (await db.post.findUnique({
            select: { id: true },
            where: { slug },
        })) !== null
    );
}

export async function getPostForUpdate(slug: string, userId: string) {
    const post = await db.post.findUnique({
        select: {
            id: true,
            userId: true,
            title: true,
            slug: true,
            content: true,
            published: true,
            bannerImgUrl: true,
            user: { select: { username: true } },

            tags: {
                select: {
                    tag: {
                        select: {
                            name: true,
                            id: true,
                            color: true,
                            badge: true,
                            description: true,
                        },
                    },
                },
            },
        },
        where: {
            slug,
            userId,
        },
    });
    if (!post) return null;
    return {
        ...post,
        username: post.user.username || "Guest",
        tags: post.tags.map((tagWrapper) => tagWrapper.tag),
    };
}

export async function createPost(data: PostForCreate) {
    try {
        const post = await db.post.create({
            data: {
                title: data.title,
                slug: data.slug,
                userId: data.userId,
                content: data.content,
                bannerImgUrl: data.bannerImgUrl,
            },
        });

        if (data.tags && data.tags.length > 0) {
            for (const tagName of data.tags) {
                const tag = await getOrCreateTag(tagName);
                if (tag.id) {
                    await addTagToPost(post.id, tag.id);
                }
            }
        }

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

type updatePostData = {
    title?: string;
    slug?: string;
    content?: string;
    published?: boolean;
    bannerImgUrl?: string;
    tags?: string[];
};

export async function updatePost(id: string, data: updatePostData) {
    try {
        await db.post.update({
            where: { id },
            data: {
                title: data.title,
                slug: data.slug,
                content: data.content,
                published: data.published,
                bannerImgUrl: data.bannerImgUrl,
            },
        });
        if (data.tags) {
            await updatePostTags(id, data.tags);
        }
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function togglePostCount(
    id: string,
    increment: boolean,
    field: "reactionCount" | "commentCount" | "saveCount",
) {
    return await db.post.update({
        where: { id },
        data: {
            [field]: increment ? { increment: 1 } : { decrement: 1 },
        },
    });
}

export async function deletePostById(id: string) {
    try {
        await db.post.delete({
            where: { id },
        });

        return { success: true };
    } catch (error) {
        console.error("Error deleting post:", error);
        return { success: false, error: "Failed to delete post" };
    }
}
