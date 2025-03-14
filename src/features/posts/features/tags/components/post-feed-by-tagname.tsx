"use server";

import { PostList, EmptyState } from "../../../components/list-view";
import { getPostsByTagName } from "../../../server/db";

type PostFeedByTagName = { tagName: string };

export const PostFeedByTagName = async ({ tagName }: PostFeedByTagName) => {
    const posts = await getPostsByTagName(tagName);

    if (posts.length === 0) {
        return (
            <EmptyState
                heading="Nothing to see"
                paragraph={`Check back later if there are any posts with the tag "${tagName}"!`}
            />
        );
    }

    return (
        <>
            <PostList posts={posts} />;
        </>
    );
};
