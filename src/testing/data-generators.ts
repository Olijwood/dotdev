import {
    randFullName,
    randUserName,
    randEmail,
    randAvatar,
    randUuid,
    randParagraph,
    randProductName,
    randSlug,
    randNumber,
    randBoolean,
} from "@ngneat/falso";
import { ReactionType } from "@prisma/client";
import {
    Post,
    PostForCreate,
    PostForUpdate,
    SavedPostStatus,
} from "@/features/posts/types";

export const generateMockUser = (overrides = {}) => ({
    id: randUuid(),
    name: randFullName(),
    username: randUserName(),
    email: randEmail(),
    image: randAvatar(),
    role: "USER",
    ...overrides,
});

export const generateMockPost = (overrides = {}): Post => ({
    id: randUuid(),
    slug: randSlug(),
    title: randProductName(),
    content: randParagraph({ length: 3 }).join("\n\n"),
    username: randUserName(),
    userImage: randAvatar(),
    createdAt: new Date(),
    updatedAt: new Date(),
    published: randBoolean(),
    bannerImgUrl: randAvatar(),
    commentCount: randNumber({ min: 0, max: 100 }),
    reactionCount: randNumber({ min: 0, max: 200 }),
    saveCount: randNumber({ min: 0, max: 50 }),
    isAuthor: false,
    isSaved: false,
    ...overrides,
});

export const generateMockPostForCreate = (
    userId: string,
    overrides = {},
): PostForCreate => ({
    title: randProductName(),
    slug: randSlug(),
    content: randParagraph({ length: 3 }).join("\n\n"),
    userId,
    bannerImgUrl: randAvatar(),
    ...overrides,
});

export const generateMockPostForUpdate = (
    userId: string,
    overrides = {},
): PostForUpdate => ({
    id: randUuid(),
    userId,
    title: randProductName(),
    slug: randSlug(),
    content: randParagraph({ length: 3 }).join("\n\n"),
    published: randBoolean(),
    bannerImgUrl: randAvatar(),
    username: randUserName(),
    ...overrides,
});

export const generateMockReaction = (
    userId: string,
    postId: string,
    type: ReactionType = "CLAP",
) => ({
    userId,
    postId,
    type,
});

export const generateMockSavedPostStatus = (
    postIds: string[],
): SavedPostStatus => {
    const status: SavedPostStatus = {};
    postIds.forEach((id) => {
        status[id] = randBoolean();
    });
    return status;
};

export const generateMockPosts = (count = 5, overrides = {}): Post[] =>
    Array.from({ length: count }, () => generateMockPost(overrides));
