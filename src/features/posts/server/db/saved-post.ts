"use server";

import { togglePostCount } from "@/features/posts/server/db";
import { SavedPostStatus } from "@/features/posts/types";
import db from "@/lib/db";
import { currentUserId } from "@/server/actions/auth";

// the type for saved post data
type SavedPostWithPost = {
    post: {
        id: string;
        title: string;
        slug: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        published: boolean;
        bannerImgUrl: string;
        user: {
            username: string | null;
            image: string | null;
        };
        _count: {
            comments: number;
            reactions: number;
        };
    };
    createdAt: Date;
};

// the type for the returned post data
type PostData = {
    id: string;
    title: string;
    slug: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    published: boolean;
    bannerImgUrl: string;
    username: string;
    image: string;
    commentCount: number;
    reactionCount: number;
    isSaved?: boolean;
};

export async function getSavedPosts(): Promise<PostData[]> {
    const userId = await currentUserId();
    if (!userId) return [];

    try {
        const savedPosts: SavedPostWithPost[] = await db.savedPost.findMany({
            where: { userId },
            select: {
                post: {
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
                    },
                },
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return savedPosts.map(({ post }) => ({
            ...post,
            username: post.user.username ?? "Guest",
            image: post.user.image ?? "/hacker.png",
            commentCount: post._count.comments,
            reactionCount: post._count.reactions,
            isSaved: true,
        }));
    } catch (error) {
        console.error("Error fetching saved posts:", error);
        return [];
    }
}

export async function isPostSaved(postId: string): Promise<boolean> {
    const userId = await currentUserId();
    if (!userId) return false;

    try {
        const savedPost = await db.savedPost.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });

        return !!savedPost;
    } catch (error) {
        console.error("Error checking if post is saved:", error);
        return false;
    }
}

/**
 * Batch check if multiple posts are saved by the current user
 * This is much more efficient than calling isPostSaved multiple times
 */
export async function batchCheckSavedStatus(
    postIds: string[],
): Promise<SavedPostStatus> {
    const userId = await currentUserId();
    if (!userId || !postIds.length) return {};

    try {
        const savedPosts = await db.savedPost.findMany({
            where: {
                userId,
                postId: { in: postIds },
            },
            select: {
                postId: true,
            },
        });

        // Create a map of postId to saved status
        const savedPostMap: SavedPostStatus = {};

        // Initialize all posts as not saved
        postIds.forEach((id) => {
            savedPostMap[id] = false;
        });

        // Mark posts that are saved
        savedPosts.forEach(({ postId }: { postId: string }) => {
            savedPostMap[postId] = true;
        });

        return savedPostMap;
    } catch (error) {
        console.error("Error batch checking saved posts:", error);
        return {};
    }
}

export async function toggleSavePost(
    postId: string,
): Promise<{ saved: boolean }> {
    const userId = await currentUserId();
    if (!userId) {
        throw new Error("User ID required.");
    }

    try {
        // Use transaction for data consistency
        return await db.$transaction(async (tx) => {
            const existingSave = await tx.savedPost.findUnique({
                where: {
                    userId_postId: {
                        userId,
                        postId,
                    },
                },
            });

            if (existingSave) {
                await tx.savedPost.delete({
                    where: {
                        id: existingSave.id,
                    },
                });

                await togglePostCount(postId, false, "saveCount");

                return { saved: false };
            } else {
                await tx.savedPost.create({
                    data: {
                        userId,
                        postId,
                    },
                });

                await togglePostCount(postId, true, "saveCount");

                return { saved: true };
            }
        });
    } catch (error) {
        console.error("Error toggling saved post:", error);
        throw error;
    }
}
