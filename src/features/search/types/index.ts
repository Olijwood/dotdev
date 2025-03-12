export type Person = {
    id: string;
    username: string;
    name: string;
    image: string;
    joinedAt: Date;
    postCount: number;
};

export type Comment = {
    id: string;
    content: string;
    createdAt: Date;
    postId: string;
    postTitle: string;
    postSlug: string;
    username: string;
    userImage: string;
    likes: number;
};
