"use server";

// import { Prisma } from "@prisma/client";
import type { PostListItem } from "@/features/posts/types";
import { getPosts, getTopPosts } from "../../../server/db";
import { PostList } from "../post-list";

type PostListOrderBy = "latest" | "top";
type PostFeedProps = {
    orderBy?: PostListOrderBy;
    // where?:
    filters?: {
        onlyFollowing: boolean;
    };
};

export const PostFeed = async ({
    orderBy = "latest",
    // where = {},
    filters,
}: PostFeedProps = {}) => {
    const posts =
        orderBy === "latest"
            ? await getPosts(filters)
            : await getTopPosts(filters);

    if (posts.length === 0) {
        return (
            <p className="text-center text-muted-foreground">
                No posts available.
            </p>
        );
    }

    return <PostList posts={posts as PostListItem[]} />;
};
