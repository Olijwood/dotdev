"use server";

import { ReactionType } from "@prisma/client";
import { getUserById } from "@/data/user";
import db from "@/lib/db";

export async function getReactionsByPost(postId: string) {
    const reactions = await db.reaction.findMany({
        where: { postId },
        include: { user: { select: { username: true, image: true } } },
    });

    return reactions;
}

export async function toggleReaction(
    postId: string,
    userId: string | null,
    type: ReactionType,
) {
    if (!userId) {
        throw new Error("User ID required.");
    }

    const userExists = getUserById(userId);
    if (!userExists) {
        throw new Error("Invalid credentials.");
    }

    try {
        const existingReaction = await db.reaction.findUnique({
            where: {
                userId_postId_type: { userId, postId, type },
            },
        });

        if (existingReaction) {
            await db.reaction.delete({
                where: {
                    userId_postId_type: { userId, postId, type },
                },
            });

            return { removed: true };
        } else {
            await db.reaction.create({
                data: { userId, postId, type },
            });

            return { added: true };
        }
    } catch (error) {
        console.error("Error in toggleReaction:", error);
        throw error;
    }
}
