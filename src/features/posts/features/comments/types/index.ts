export type CommentType = {
    id: string;
    postId: string;
    content: string;
    likes: number;
    repliesCount: number;
    createdAt: Date;
    user: {
        username: string | null;
        image: string | null;
    };
    userLiked: boolean;
    replies?: ReplyType[];
};

export type ReplyType = {
    id: string;
    commentId: string;
    content: string;
    likes: number;
    createdAt: Date;
    user: {
        username: string | null;
        image: string | null;
    };
    userLiked: boolean;
};
