"use server";

import React, { JSX, Suspense } from "react";
import type { PostListItem } from "@/features/posts/types";
import { getPosts, PostFilters, PostsSortType } from "../../../server/db";
import { PostList, SkeletonPostList } from "../post-list";

type PostListOrderBy = "latest" | "top";
type PostFeedProps = {
    emptyState?: JSX.Element;
    orderBy?: PostListOrderBy;
    filters?: PostFilters;
};

export const PostFeed = async ({
    emptyState,
    orderBy = "latest",
    filters,
}: PostFeedProps = {}) => {
    const posts =
        orderBy === "latest"
            ? await getPosts(filters)
            : await getPosts(filters, "top" as PostsSortType);

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

    return (
        <Suspense fallback={<SkeletonPostList />}>
            <PostList posts={posts as PostListItem[]} />
        </Suspense>
    );
};
