"use client";

import { PostItem } from "./post-item";

type Post = {
    id: string;
    title: string;
    slug: string;
    content: string;
    username: string;
    createdAt: Date;
    bannerImgUrl: string;
    userImage: string;
    commentCount: number;
    reactionCount: number;
};

type PostListProps = {
    posts: Post[];
};

export const PostList = ({ posts }: PostListProps) => {
    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 bg-none sm:gap-2">
            {posts.map((post) => (
                <PostItem key={post.id} post={post} />
            ))}
        </div>
    );
};
