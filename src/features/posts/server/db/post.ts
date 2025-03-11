"use server";

import { Prisma } from "@prisma/client";
import db from "@/lib/db";
import { currentUserId } from "@/server/actions/auth";
import { PostForCreate } from "../../types";

export async function getPosts() {
    const userId = await currentUserId();

    const posts = await db.post.findMany({
        select: {
            id: true,
            title: true,
            slug: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            published: true,
            bannerImgUrl: true,
            user: { select: { username: true, image: true } },
            _count: {
                select: {
                    comments: true,
                    reactions: true,
                },
            },
            savedBy: userId
                ? {
                      where: { userId },
                      select: { id: true },
                  }
                : undefined,
        },
        where: { published: true },
        orderBy: { createdAt: "desc" },
    });

    return posts.map((post) => ({
        ...post,
        username: post.user.username ?? "Guest",
        userImage: post.user.image ?? "/hacker.png",
        commentCount: post._count.comments,
        reactionCount: post._count.reactions,
        isSaved: userId ? post.savedBy.length > 0 : false,
        // Remove savedBy from the returned object to reduce payload size
        savedBy: undefined,
    }));
}

export async function getTopPosts() {
    const userId = await currentUserId();

    const posts = await db.$queryRaw<
        Array<{
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
            combinedScore: number;
            isSaved: boolean;
        }>
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
            CASE WHEN su."userId" IS NOT NULL THEN true ELSE false END AS "isSaved"

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
      
        WHERE p.published = true

       
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
        published: post.published,
        bannerImgUrl: post.bannerImgUrl,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        slug: post.slug,
    }));
}

export async function getPostsByUserId(userId: string) {
    const currUserId = await currentUserId();

    const posts = await db.post.findMany({
        select: {
            id: true,
            title: true,
            slug: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            published: true,
            bannerImgUrl: true,
            user: { select: { username: true, image: true } },
            _count: {
                select: {
                    comments: true,
                    reactions: true,
                },
            },
            savedBy: currUserId
                ? {
                      where: { userId: currUserId },
                      select: { id: true },
                  }
                : undefined,
        },
        where: { userId, published: true },
        orderBy: { createdAt: "desc" },
    });

    return posts.map((post) => ({
        ...post,
        username: post.user.username ?? "Guest",
        userImage: post.user.image ?? "/hacker.png",
        commentCount: post._count.comments,
        reactionCount: post._count.reactions,
        isSaved: currUserId ? post.savedBy.length > 0 : false,
        savedBy: undefined,
    }));
}

export async function getPostById(id: string) {
    const userId = await currentUserId();

    return await db.post.findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            slug: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            published: true,
            bannerImgUrl: true,
            user: { select: { username: true, image: true, createdAt: true } },
            _count: {
                select: {
                    comments: true,
                    reactions: true,
                },
            },
            savedBy: userId
                ? {
                      where: { userId },
                      select: { id: true },
                  }
                : undefined,
        },
    });
}

export async function getPostBySlug(slug: string) {
    const userId = await currentUserId();

    const post = await db.post.findUnique({
        where: { slug },
        select: {
            id: true,
            title: true,
            slug: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            published: true,
            bannerImgUrl: true,
            userId: true,
            saveCount: true,
            user: { select: { username: true, image: true, createdAt: true } },
            reactions: {
                select: {
                    type: true,
                    userId: true,
                    user: { select: { username: true, image: true } },
                },
            },
            _count: {
                select: {
                    comments: true,
                    reactions: true,
                },
            },
            savedBy: userId
                ? {
                      where: { userId },
                      select: { id: true },
                  }
                : undefined,
        },
    });
    if (!post) return null;

    return {
        ...post,
        commentCount: post._count.comments,
        reactionCount: post._count.reactions,
        isSaved: userId ? post.savedBy.length > 0 : false,
        savedBy: undefined,
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
        },
        where: {
            slug,
            userId,
        },
    });
    if (!post) return null;
    return { ...post, username: post.user.username || "Guest" };
}

export async function createPost(data: PostForCreate) {
    try {
        await db.post.create({
            data: {
                title: data.title,
                slug: data.slug,
                userId: data.userId,
                content: data.content,
                bannerImgUrl: data.bannerImgUrl,
            },
        });
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
};

export async function updatePost(id: string, data: updatePostData) {
    try {
        await db.post.update({
            where: { id },
            data,
        });
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
