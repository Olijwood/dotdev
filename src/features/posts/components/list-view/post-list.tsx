"use client";

import { PostItem } from "./post-item";

type Post = {
    id: string;
    title: string;
    slug: string;
    content: string;
    username: string;
    image: string;
    commentCount: number;
    reactionCount: number;
};

type PostListProps = {
    posts: Post[];
};

export const PostList = ({ posts }: PostListProps) => {
    return (
        <div className="flex w-full max-w-4xl flex-col items-center self-center">
            {posts.map((post) => (
                <PostItem post={post} key={post.slug} />
            ))}
        </div>
    );
};
