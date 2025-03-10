"use server";

import { getPostsByUserId } from "../../../server/db";
import { EmptyState } from "../empty-state";
import { PostList } from "../post-list";

type UserPostFeedProps = { authorId: string; username: string };

export const UserPostFeed = async ({
    authorId,
    username,
}: UserPostFeedProps) => {
    const posts = await getPostsByUserId(authorId);

    if (posts.length === 0) {
        return (
            <EmptyState
                heading="Nothing to see"
                paragraph={`Check back later to check if ${username} has written anything!`}
            />
        );
    }

    return (
        <>
            <PostList posts={posts} />;
        </>
    );
};
