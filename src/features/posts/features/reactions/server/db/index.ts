"use server";

import { ReactionType } from "@prisma/client";
import { togglePostCount } from "@/features/posts/server/db";
import db from "@/lib/db";
import { getUserExistsById } from "@/server/db/user";

export async function getReactionsByPost(postId: string) {
    return await db.reaction.findMany({
        where: { postId },
        select: {
            type: true,
            userId: true,
            postId: true,
            user: {
                select: {
                    username: true,
                    image: true,
                },
            },
        },
    });
}

export async function toggleReaction(
    postId: string,
    userId: string | null,
    type: ReactionType,
) {
    if (!userId) {
        throw new Error("User ID required.");
    }

    const userExists = await getUserExistsById(userId);
    if (!userExists) {
        throw new Error("Invalid credentials.");
    }

    try {
        return await db.$transaction(async (tx) => {
            const existingReaction = await tx.reaction.findUnique({
                where: {
                    userId_postId_type: { userId, postId, type },
                },
            });

            if (existingReaction) {
                await tx.reaction.delete({
                    where: {
                        userId_postId_type: { userId, postId, type },
                    },
                });

                await togglePostCount(postId, false, "reactionCount");

                return { removed: true };
            } else {
                await tx.reaction.create({
                    data: { userId, postId, type },
                });

                await togglePostCount(postId, true, "reactionCount");

                return { added: true };
            }
        });
    } catch (error) {
        console.error("Error in toggleReaction:", error);
        throw error;
    }
}
