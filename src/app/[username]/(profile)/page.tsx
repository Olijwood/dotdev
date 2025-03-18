"use server";

import { notFound } from "next/navigation";
import { getUserProfileInfoByUsername } from "@/features/auth/server/db/data";
import {
    PostFeedWrapper,
    UserPostFeed,
    UserProfileCard,
} from "@/features/posts/components/list-view";
import { currentUserId } from "@/server/actions/auth";

const UserPage = async ({
    params,
}: {
    params: Promise<{ username: string }>;
}) => {
    const { username } = await params;

    const author = await getUserProfileInfoByUsername(username);

    if (!author || !author.id || !author.username) {
        return notFound();
    }

    const currUid = await currentUserId();

    const authorProfileInfoProps = {
        currUid,
        id: author.id,
        username: author.username,
        name: author.name,
    };

    return (
        <PostFeedWrapper hidden showEndMessage={false}>
            <UserProfileCard user={authorProfileInfoProps} />
            <UserPostFeed authorId={author.id} username={author.username} />
        </PostFeedWrapper>
    );
};

export default UserPage;
