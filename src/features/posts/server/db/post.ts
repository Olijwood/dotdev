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

type PostFilters = {
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

export async function getPosts(filters: PostFilters = {}) {
    const userId = await currentUserId();

    const conditions: Prisma.Sql[] = [Prisma.sql`p.published = true`];

    if (filters.isFollowing) conditions.push(postFilterMap.isFollowing(userId));
    if (filters.byUserId)
        conditions.push(postFilterMap.byUserId(filters.byUserId));
    if (filters.byTag) conditions.push(postFilterMap.byTag(filters.byTag));
    if (filters.isSaved) conditions.push(postFilterMap.isSaved(userId));

    const where = conditions.length
        ? Prisma.sql`WHERE ${Prisma.join(conditions, ` AND `)}`
        : Prisma.empty;

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
        
        COALESCE(comment_counts.count, 0) AS "commentCount",
        COALESCE(reaction_counts.count, 0) AS "reactionCount",
        COALESCE(save_counts.count, 0) AS "saveCount",
        
        -- Whether the current user has saved the post
        CASE WHEN su."userId" IS NOT NULL THEN true ELSE false END AS "isSaved",
        
        -- Full tag details
        COALESCE(
            jsonb_agg(
                DISTINCT jsonb_build_object(
                    'id', t.id,
                    'name', t.name,
                    'description', t.description,
                    'color', t.color,
                    'badge', t.badge
                )
            ) FILTER (WHERE t.id IS NOT NULL), '[]'
        ) AS "tags"
        
    FROM "Post" p
    LEFT JOIN "User" u ON u.id = p."userId"
    
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
    
    LEFT JOIN "PostTag" pt ON pt."postId" = p.id
    LEFT JOIN "Tag" t ON t.id = pt."tagId"
    
        ${where}

    
    GROUP BY 
        p.id, p.title, p.slug, p.content, p."createdAt", p."updatedAt", 
        p.published, p."bannerImgUrl", u.username, u.image, su."userId", 
        comment_counts.count, reaction_counts.count, save_counts.count

    ORDER BY p."createdAt" DESC;
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

export async function getTopPosts(
    filters: PostFilters = { isFollowing: false },
) {
    const userId = await currentUserId();

    const followingFilter = filters.isFollowing
        ? postFilterMap.isFollowing(userId)
        : Prisma.empty;

    const posts = await db.$queryRaw<
        Array<AllPostsQuery & { combinedScore: number }>
    >(Prisma.sql`
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
                CASE WHEN su."userId" IS NOT NULL THEN true ELSE false END AS "isSaved",
                
                -- Full tag details
                COALESCE(
                    jsonb_agg(
                        DISTINCT jsonb_build_object(
                            'id', t.id,
                            'name', t.name,
                            'description', t.description,
                            'color', t.color,
                            'badge', t.badge
                            )
                            ) FILTER (WHERE t.id IS NOT NULL), '[]'
                            ) AS "tags"
                            
                            FROM "Post" p
        LEFT JOIN "User" u ON u.id = p."userId"
        
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
                    
                    LEFT JOIN "PostTag" pt ON pt."postId" = p.id
                    LEFT JOIN "Tag" t ON t.id = pt."tagId"
                    
                    WHERE p.published = true
                    ${followingFilter}
                    
                    
                    GROUP BY 
            p.id, u.username, u.image, 
            comment_counts.count, 
            reaction_counts.count, 
            save_counts.count, su."userId"
            
            ORDER BY "combinedScore" DESC, p."createdAt" DESC;
            `);

    return posts.map((post) => ({
        ...post,
        username: post.username ?? "Guest",
        userImage: post.userImage ?? "/hacker.png",
        commentCount: post.commentCount,
        reactionCount: post.reactionCount,
        saveCount: post.saveCount,
        isSaved: post.isSaved,
        combinedScore: post.combinedScore,
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
            SELECT "id", "createdAt", "username", "image"
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
        },
        commentCount: post.commentCount ?? 0,
        reactionCount: post.reactionCount ?? 0,
        saveCount: post.saveCount ?? 0,
        isSaved: post.isSaved ?? false,
        tags: post.tags || [],
        reactions: post.reactions || [],
    };
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
