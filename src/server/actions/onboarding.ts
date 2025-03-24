"use server";

import db from "@/lib/db";
import { currentUserId } from "./auth";

export async function completeOnboarding({
    profile,
    followedUserIds,
    selectedTagIds,
}: {
    profile: {
        username: string;
        bio: string;
        profileImage: string;
        displayName: string;
    };
    followedUserIds: string[];
    selectedTagIds: string[];
}) {
    const userId = await currentUserId();
    if (!userId) throw new Error("Not authenticated");
    try {
        await db.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: userId },
                data: {
                    username: profile.username,
                    bio: profile.bio,
                    image: profile.profileImage,
                    name: profile.displayName,
                    hasCompletedOnboarding: true,
                },
            });

            if (followedUserIds.length > 0) {
                const follows = followedUserIds.map((followerId) => ({
                    followerId: userId,
                    followingId: followerId,
                }));

                await tx.follow.createMany({
                    data: follows,
                    skipDuplicates: true,
                });
            }

            if (selectedTagIds.length > 0) {
                const tagFollows = selectedTagIds.map((tagId) => ({
                    userId,
                    tagId,
                }));

                await tx.tagFollow.createMany({
                    data: tagFollows,
                    skipDuplicates: true,
                });
            }
        });
    } catch (error) {
        console.error("Error completing onboarding:", error);
    }
}
