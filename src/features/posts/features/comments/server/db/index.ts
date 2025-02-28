"use server";

import db from "@/lib/db";
import { currentUserId } from "@/server/actions/auth";

export async function getComments(postId: string) {
    const userId = await currentUserId();

    const comments = await db.comment.findMany({
        where: { postId },
        select: {
            id: true,
            postId: true,
            content: true,
            likes: true,
            repliesCount: true,
            createdAt: true,
            user: {
                select: { id: true, username: true, image: true },
            },
            replies: {
                select: {
                    id: true,
                    commentId: true,
                    content: true,
                    likes: true,
                    createdAt: true,
                    user: {
                        select: { id: true, username: true, image: true },
                    },
                    replyLike: {
                        select: { userId: true },
                        where: { userId },
                    },
                },
            },
            commentLike: {
                select: { userId: true },
                where: { userId },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return comments.map((comment) => ({
        ...comment,
        userLiked: comment.commentLike.length > 0,
        replies: comment.replies.map((reply) => ({
            ...reply,
            userLiked: reply.replyLike.length > 0,
        })),
    }));
}

export async function addComment(postId: string, content: string) {
    const userId = await currentUserId();
    if (!userId) throw new Error("Unauthorized");

    const newComment = await db.comment.create({
        data: {
            postId,
            content,
            userId,
        },
        include: {
            user: { select: { id: true, username: true, image: true } },
        },
    });

    return {
        ...newComment,
        userLiked: false,
    };
}

export async function addReply(commentId: string, content: string) {
    const userId = await currentUserId();
    if (!userId) throw new Error("Unauthorized");

    const newReply = await db.reply.create({
        data: {
            commentId,
            content,
            userId,
        },
        include: {
            user: { select: { id: true, username: true, image: true } },
        },
    });

    return {
        ...newReply,
        userLiked: false,
    };
}

export async function toggleCommentLike(commentId: string) {
    const userId = await currentUserId();
    if (!userId) throw new Error("Unauthorized");

    const existingLike = await db.commentLike.findFirst({
        where: { commentId, userId },
    });
    if (existingLike) {
        // Unlike
        await db.commentLike.delete({ where: { id: existingLike.id } });
        await db.comment.update({
            where: { id: commentId },
            data: { likes: { decrement: 1 } },
        });
        return { liked: false };
    } else {
        // Like
        await db.commentLike.create({
            data: { commentId, userId },
        });
        await db.comment.update({
            where: { id: commentId },
            data: { likes: { increment: 1 } },
        });
        return { liked: true };
    }
}
export async function toggleReplyLike(replyId: string) {
    const userId = await currentUserId();
    if (!userId) throw new Error("Unauthorized");

    const existingLike = await db.replyLike.findFirst({
        where: { replyId, userId },
    });

    if (existingLike) {
        // Unlike
        await db.replyLike.delete({ where: { id: existingLike.id } });
        await db.reply.update({
            where: { id: replyId },
            data: { likes: { decrement: 1 } },
        });
        return { liked: false };
    } else {
        // Like
        await db.replyLike.create({
            data: { replyId, userId },
        });
        await db.reply.update({
            where: { id: replyId },
            data: { likes: { increment: 1 } },
        });
        return { liked: true };
    }
}
