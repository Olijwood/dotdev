"use client";

import type { PostListItem } from "@/features/posts/types";
import { PostItem } from "./post-item";

type PostListProps = {
    posts: PostListItem[];
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
