export type Post = {
    id: string;
    slug: string;
    title: string;
    content: string;
    username: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
    published: boolean;
    bannerImgUrl: string;
    commentCount: number;
    reactionCount: number;
    saveCount?: number;
    isAuthor?: boolean;
    isSaved?: boolean;
};

export type PostForCreate = {
    title: string;
    slug: string;
    content: string;
    userId: string;
    bannerImgUrl?: string;
};

export type PostForUpdate = {
    id: string;
    userId: string;
    title: string;
    slug: string;
    content: string;
    published: boolean;
    bannerImgUrl: string | null;
    username: string;
};

export type SavedPostStatus = {
    [postId: string]: boolean;
};
