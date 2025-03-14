"use server";

import { Tag } from "@/features/posts/types";
import db from "@/lib/db";

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
