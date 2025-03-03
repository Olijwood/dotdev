"use server";

import { revalidatePath } from "next/cache";
import { togglePostCount } from "@/features/posts/server/db";
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
                    // Conditionally include replyLike only if userId exists
                    ...(userId
                        ? {
                              replyLike: {
                                  where: { userId },
                                  select: { userId: true },
                              },
                          }
                        : {}),
                },
            },
            // Conditionally include commentLike only if userId exists
            ...(userId
                ? {
                      commentLike: {
                          where: { userId },
                          select: { userId: true },
                      },
                  }
                : {}),
        },
        orderBy: { createdAt: "desc" },
    });

    return comments.map((comment) => ({
        ...comment,
        userLiked: comment.commentLike?.length > 0 || false,
        replies: comment.replies.map((reply) => ({
            ...reply,
            userLiked: reply.replyLike?.length > 0 || false,
        })),
    }));
}

export async function addComment(postId: string, content: string) {
    const userId = await currentUserId();
    if (!userId) throw new Error("Unauthorized");

    try {
        return await db.$transaction(async (tx) => {
            const newComment = await tx.comment.create({
                data: {
                    postId,
                    content,
                    userId,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            image: true,
                        },
                    },
                },
            });

            await togglePostCount(postId, true, "commentCount");
            revalidatePath("/");
            return {
                ...newComment,
                userLiked: false,
            };
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
    }
}

export async function addReply(commentId: string, content: string) {
    const userId = await currentUserId();
    if (!userId) throw new Error("Unauthorized");

    try {
        return await db.$transaction(async (tx) => {
            const newReply = await tx.reply.create({
                data: {
                    commentId,
                    content,
                    userId,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            image: true,
                        },
                    },
                },
            });

            await tx.comment.update({
                where: { id: commentId },
                data: { repliesCount: { increment: 1 } },
            });

            return {
                ...newReply,
                userLiked: false,
            };
        });
    } catch (error) {
        console.error("Error adding reply:", error);
        throw error;
    }
}

export async function toggleCommentLike(commentId: string) {
    const userId = await currentUserId();
    if (!userId) throw new Error("Unauthorized");

    try {
        return await db.$transaction(async (tx) => {
            const existingLike = await tx.commentLike.findFirst({
                where: { commentId, userId },
            });

            if (existingLike) {
                // Unlike
                await tx.commentLike.delete({
                    where: { id: existingLike.id },
                });

                await tx.comment.update({
                    where: { id: commentId },
                    data: { likes: { decrement: 1 } },
                });

                return { liked: false };
            } else {
                // Like
                await tx.commentLike.create({
                    data: { commentId, userId },
                });

                await tx.comment.update({
                    where: { id: commentId },
                    data: { likes: { increment: 1 } },
                });

                return { liked: true };
            }
        });
    } catch (error) {
        console.error("Error toggling comment like:", error);
        throw error;
    }
}

export async function toggleReplyLike(replyId: string) {
    const userId = await currentUserId();
    if (!userId) throw new Error("Unauthorized");

    try {
        return await db.$transaction(async (tx) => {
            const existingLike = await tx.replyLike.findFirst({
                where: { replyId, userId },
            });

            if (existingLike) {
                // Unlike
                await tx.replyLike.delete({
                    where: { id: existingLike.id },
                });

                await tx.reply.update({
                    where: { id: replyId },
                    data: { likes: { decrement: 1 } },
                });

                return { liked: false };
            } else {
                // Like
                await tx.replyLike.create({
                    data: { replyId, userId },
                });

                await tx.reply.update({
                    where: { id: replyId },
                    data: { likes: { increment: 1 } },
                });

                return { liked: true };
            }
        });
    } catch (error) {
        console.error("Error toggling reply like:", error);
        throw error;
    }
}
