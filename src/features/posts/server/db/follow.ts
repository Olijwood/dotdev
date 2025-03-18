"use server";

import db from "@/lib/db";
import { currentUserId } from "@/server/actions/auth";

export async function toggleFollowAction(followingId: string) {
    const userId = await currentUserId();

    if (!userId) {
        return { error: "Unauthorized" };
    }
    if (userId === followingId) {
        return { error: "You cannot follow yourself." };
    }

    const existingFollow = await checkIsFollowingByUserId(followingId, userId);

    if (existingFollow) {
        await unfollow(followingId, userId);

        return { following: false };
    } else {
        await follow(followingId, userId);

        return { following: true };
    }
}

export async function follow(followingId: string, userId: string) {
    try {
        await db.follow.create({
            data: {
                followerId: userId,
                followingId,
            },
        });
    } catch (error) {
        console.error(error);
    }
}

export async function unfollow(followingId: string, userId: string) {
    try {
        await db.follow.delete({
            where: {
                followerId_followingId: {
                    followerId: userId,
                    followingId,
                },
            },
        });
    } catch (error) {
        console.error(error);
    }
}

export async function checkIsFollowing(followingId: string) {
    const userId = await currentUserId();
    if (!userId) return false;

    const existingFollow = await db.follow.findUnique({
        select: {
            id: true,
        },
        where: {
            followerId_followingId: {
                followerId: userId,
                followingId,
            },
        },
    });

    return !!existingFollow;
}

export async function checkIsFollowingByUserId(
    followingId: string,
    userId: string,
) {
    const existingFollow = await db.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: userId,
                followingId,
            },
        },
    });

    return !!existingFollow;
}

export async function toggleTagFollowAction(tagId: string) {
    const userId = await currentUserId();

    if (!userId) {
        return { error: "Unauthorized" };
    }

    const existingFollow = await tagCheckIsFollowingByUserId(tagId, userId);

    if (existingFollow) {
        await tagUnfollow(tagId, userId);

        return { following: false };
    } else {
        await tagFollow(tagId, userId);

        return { following: true };
    }
}

export async function tagFollow(tagId: string, userId: string) {
    try {
        await db.tagFollow.create({
            data: {
                userId,
                tagId,
            },
        });
    } catch (error) {
        console.error(error);
    }
}

export async function tagUnfollow(tagId: string, userId: string) {
    try {
        await db.tagFollow.delete({
            where: {
                userId_tagId: {
                    userId,
                    tagId,
                },
            },
        });
    } catch (error) {
        console.error(error);
    }
}

export async function tagCheckIsFollowing(tagId: string) {
    const userId = await currentUserId();
    if (!userId) return false;
    console.log(tagId);
    const existingFollow = await db.tagFollow.findUnique({
        select: {
            id: true,
        },
        where: {
            userId_tagId: {
                userId,
                tagId,
            },
        },
    });

    return !!existingFollow;
}

export async function tagCheckIsFollowingByUserId(
    tagId: string,
    userId: string,
) {
    const existingFollow = await db.tagFollow.findUnique({
        where: {
            userId_tagId: {
                userId,
                tagId,
            },
        },
    });

    return !!existingFollow;
}
