"use server";

import { JSX } from "react";
import { getSavedPosts } from "../../server/db";
import { PostList } from "../list-view";
import { EmptyState } from "./empty-state";

export const SavedPostFeed = async (): Promise<JSX.Element> => {
    const savedPosts = await getSavedPosts();

    if (savedPosts.length === 0) {
        return <EmptyState />;
    }

    return <PostList posts={savedPosts} />;
};
