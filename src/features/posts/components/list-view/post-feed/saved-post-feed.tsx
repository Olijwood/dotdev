"use server";

import { BookmarkIcon } from "lucide-react";
import { JSX } from "react";
import { getPosts } from "../../../server/db";
import { PostList } from "../../list-view";
import { EmptyState } from "./../empty-state";

export const SavedPostFeed = async (): Promise<JSX.Element> => {
    const savedPosts = await getPosts({ isSaved: true });

    if (savedPosts.length === 0) {
        return (
            <EmptyState
                Icon={BookmarkIcon}
                heading="Your reading list is empty"
                paragraph="Save interesting posts to read later by clicking the bookmark icon on any post."
            />
        );
    }

    return <PostList posts={savedPosts} />;
};
