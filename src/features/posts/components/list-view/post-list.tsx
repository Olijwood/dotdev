"use client";

import type { PostListItem } from "@/features/posts/types";
import { cn } from "@/lib/utils";
import { PostItem } from "./post-item";

type PostListProps = {
    posts: PostListItem[];
    className?: string;
};

export const PostList = ({ posts, className }: PostListProps) => {
    return (
        <div
            className={cn(
                "mx-auto flex w-full max-w-3xl flex-col items-center gap-3 bg-none sm:gap-2",
                className,
            )}
        >
            {posts.map((post) => (
                <PostItem key={post.id} post={post} />
            ))}
        </div>
    );
};
