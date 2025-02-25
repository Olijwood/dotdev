"use server";

import db from "@/lib/db";
import { PostForCreate } from "../../types";

export async function getPosts() {
    const posts = await db.post.findMany({
        include: {
            user: { select: { username: true, image: true } },
            comments: true,
            reactions: true,
        },
        where: { published: true },
        orderBy: { createdAt: "desc" },
    });

    return posts.map((post) => ({
        ...post,
        username: post.user.username ?? "Guest",
        image: post.user.image ?? "/hacker.png",
        commentCount: post.comments.length || 0,
        reactionCount: post.reactions.length || 0,
    }));
}

export async function getPostById(id: string) {
    return await db.post.findUnique({
        where: { id },
        include: {
            user: { select: { username: true, image: true, createdAt: true } },
            comments: true,
            reactions: true,
        },
    });
}

export async function getPostBySlug(slug: string) {
    return await db.post.findUnique({
        where: { slug },
        include: {
            user: { select: { username: true, image: true, createdAt: true } },
            comments: true,
            reactions: true,
        },
    });
}

export async function postBySlugExists(slug: string) {
    const post = await db.post.findUnique({
        select: { id: true },
        where: { slug },
    });

    return !!post;
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
        where: { slug, userId },
    });
    if (!post || post.userId !== userId) return null;
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
        const deletedPost = await db.post.delete({ where: { id } });

        if (!deletedPost) {
            return { success: false, error: "Post not found" };
        }
        return { success: true };
    } catch {
        return { success: false, error: "Failed to delete post" };
    }
}
