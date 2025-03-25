"use server";

import { Prisma } from "@prisma/client";
import { Tag } from "@/features/posts/types";
import db from "@/lib/db";
import { currentUserId } from "@/server/actions/auth";

export async function getAllTags(): Promise<Tag[]> {
    const tags = await db.tag.findMany({
        orderBy: {
            name: "asc",
        },
    });

    return tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        description: tag.description || "",
        color: tag.color,
        badge: tag.badge,
    }));
}

export async function getTagByName(name: string): Promise<Tag | null> {
    const tag = await db.tag.findUnique({
        where: { name },
    });

    if (!tag) return null;

    return {
        id: tag.id,
        name: tag.name,
        displayName: tag.displayName,
        description: tag.description || "",
        color: tag.color,
        badge: tag.badge,
        guidelines: tag.guidelines || "",
        about: tag.about || "",
        aboutLink: tag.aboutLink || "",
    };
}

export async function createTag(tag: Omit<Tag, "id">): Promise<Tag> {
    const created = await db.tag.create({
        data: {
            name: tag.name,
            description: tag.description,
            color: tag.color,
            badge: tag.badge || null,
        },
    });

    return {
        id: created.id,
        name: created.name,
        description: created.description || "",
        color: created.color,
        badge: created.badge,
    };
}

export async function getOrCreateTag(tagName: string): Promise<Tag> {
    const normalizedName = tagName.toLowerCase().trim();

    const existingTag = await getTagByName(normalizedName);
    if (existingTag) return existingTag;

    return createTag({
        name: normalizedName,
        description: "",
        color: "text-gray-600",
        badge: null,
    });
}

export async function getPostTags(postId: string): Promise<Tag[]> {
    const postTags = await db.postTag.findMany({
        where: { postId },
        include: { tag: true },
    });

    return postTags.map((pt) => ({
        id: pt.tag.id,
        name: pt.tag.name,
        description: pt.tag.description || "",
        color: pt.tag.color,
        badge: pt.tag.badge,
    }));
}

export async function addTagToPost(
    postId: string,
    tagId: string,
): Promise<void> {
    await db.postTag.create({
        data: {
            postId,
            tagId,
        },
    });
}

export async function removeTagFromPost(
    postId: string,
    tagId: string,
): Promise<void> {
    await db.postTag.deleteMany({
        where: {
            postId,
            tagId,
        },
    });
}

export async function updatePostTags(
    postId: string,
    tagNames: string[],
): Promise<void> {
    // Get current tags for the post
    const currentPostTags = await db.postTag.findMany({
        where: { postId },
        include: { tag: true },
    });

    const currentTagNames = new Set(currentPostTags.map((pt) => pt.tag.name));

    for (const tagName of tagNames) {
        const normalizedName = tagName.toLowerCase().trim();

        if (currentTagNames.has(normalizedName)) {
            currentTagNames.delete(normalizedName); //
            continue;
        }

        const tag = await getOrCreateTag(normalizedName);

        if (tag.id) {
            await addTagToPost(postId, tag.id);
        }
    }

    for (const tagName of currentTagNames) {
        const tag = await getTagByName(tagName);
        if (tag && tag.id) {
            await removeTagFromPost(postId, tag.id);
        }
    }
}

type OnboardingTag = {
    id: string;
    name: string;
    description?: string;
    postCount: number;
    isFollowing: boolean;
};

export async function getOnboardingAvailableTags() {
    const userId = await currentUserId();

    const isFollowingSelect = userId
        ? Prisma.sql`, (
            SELECT 1 
            FROM "TagFollow" tf 
            WHERE tf."userId" = ${userId} AND tf."tagId" = t.id
        ) AS "isFollowing"`
        : Prisma.empty;

    const result = await db.$queryRaw<Array<OnboardingTag>>(Prisma.sql`
        SELECT 
            t.id, 
            t.name, 
            t.description,
            (SELECT COUNT(*) FROM "PostTag" pt WHERE pt."tagId" = t.id) AS "postCount"
            ${isFollowingSelect}
            
        FROM "Tag" t
        ORDER BY "postCount" DESC, t.name ASC
        LIMIT 50
    `);
    if (!result || result.length === 0) {
        return [];
    }
    const tags = result.map((tag) => {
        return {
            id: tag.id,
            name: tag.name,
            description: tag.description || "",
            postCount: tag.postCount || 0,
            isFollowing: tag.isFollowing || false,
        };
    });
    return tags;
}
