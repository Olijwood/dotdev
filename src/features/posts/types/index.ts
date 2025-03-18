export type Post = {
    id: string;
    slug: string;
    title: string;
    content: string;
    username: string;
    userImage: string;
    createdAt: Date;
    updatedAt: Date;
    published: boolean;
    bannerImgUrl: string;
    commentCount: number;
    reactionCount: number;
    saveCount?: number;
    isAuthor?: boolean;
    isSaved?: boolean;
    tags?: Tag[];
};

export type PostListItem = {
    id: string;
    title: string;
    slug: string;
    content: string;
    username: string;
    createdAt: Date;
    published?: boolean;
    userImage: string;
    bannerImgUrl: string;
    commentCount: number;
    reactionCount: number;
    saveCount?: number;
    isSaved?: boolean;
    tags?: Tag[];
};

export type PostForCreate = {
    title: string;
    slug: string;
    content: string;
    userId: string;
    bannerImgUrl?: string;
    tags?: string[];
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
    tags?: Tag[];
};

export type SavedPostStatus = {
    [postId: string]: boolean;
};

export type Tag = {
    id: string;
    name: string;
    displayName?: string | null;
    description?: string | null;
    color?: string;
    badge?: string | null;
    guidelines?: string | null;
    about?: string | null;
    aboutLink?: string | null;
};
