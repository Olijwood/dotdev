export type Post = {
    uid: string;
    slug: string;
    title: string;
    content: string;
    username: string;
    saveCount: number;
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
