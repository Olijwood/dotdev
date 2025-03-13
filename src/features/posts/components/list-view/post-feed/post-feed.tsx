"use server";

import type { PostListItem } from "@/features/posts/types";
import { getPosts, getTopPosts } from "../../../server/db";
import { PostList } from "../post-list";

type PostListOrderBy = "latest" | "top";
type PostFeedProps = {
    orderBy?: PostListOrderBy;
};

export const PostFeed = async ({ orderBy = "latest" }: PostFeedProps = {}) => {
    const posts = orderBy === "latest" ? await getPosts() : await getTopPosts();

    if (posts.length === 0) {
        return (
            <p className="text-center text-muted-foreground">
                No posts available.
            </p>
        );
    }

    return <PostList posts={posts as PostListItem[]} />;
};
