"use server";

import React, { JSX, Suspense } from "react";
import type { PostListItem } from "@/features/posts/types";
// import { delay } from "@/lib/utils";
import { getPosts, getTopPosts } from "../../../server/db";
import { PostList, SkeletonPostList } from "../post-list";

type PostListOrderBy = "latest" | "top";
type PostFeedProps = {
    emptyState?: JSX.Element;
    orderBy?: PostListOrderBy;
    filters?: {
        onlyFollowing?: boolean;
        byUserId?: string;
        byTag?: string;
        isSaved?: boolean;
    };
};

export const PostFeed = async ({
    emptyState,
    orderBy = "latest",
    filters,
}: PostFeedProps = {}) => {
    const posts =
        orderBy === "latest"
            ? await getPosts(filters)
            : await getTopPosts(filters);

    if (posts.length === 0) {
        if (emptyState) {
            return emptyState;
        }
        return (
            <p className="text-center text-muted-foreground">
                No posts available.
            </p>
        );
    }

    // await delay(3000);

    return (
        <Suspense fallback={<SkeletonPostList />}>
            <PostList posts={posts as PostListItem[]} />
        </Suspense>
    );
};
