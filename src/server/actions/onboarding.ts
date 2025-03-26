"use server";

import {
    OnboardingFormValues,
    OnboardingSchema,
} from "@/components/onboarding/schema";
import db from "@/lib/db";
import { currentUserId } from "./auth";

export async function completeOnboarding(rawData: OnboardingFormValues) {
    const userId = await currentUserId();
    if (!userId) throw new Error("Not authenticated");
    console.log("rawData", rawData);
    const parsed = OnboardingSchema.safeParse(rawData);

    if (!parsed.success) {
        console.error("Validation failed", parsed.error.flatten());
        throw new Error("Invalid onboarding data.");
    }

    const {
        username,
        bio,
        profileImage,
        followedUserIds = [],
        selectedTagIds = [],
    } = parsed.data;

    try {
        await db.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: userId },
                data: {
                    username,
                    bio,
                    image: profileImage,
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
