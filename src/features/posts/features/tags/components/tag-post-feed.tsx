"use server";

import { PostList, EmptyState } from "../../../components/list-view";
import { getPostsByTagName } from "../../../server/db";

type TagPostFeedProps = { tagName: string };

export const TagPostFeed = async ({ tagName }: TagPostFeedProps) => {
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
        <PostList
            posts={posts}
            className="overflow-y-auto no-scrollbar lg:!scrollbar-thin h-[74vh]  sm:rounded-lg sm:pr-1"
        />
    );
};
