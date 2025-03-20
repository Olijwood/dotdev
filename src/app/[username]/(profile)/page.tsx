"use server";
import { notFound } from "next/navigation";
import { getUserProfileInfoByUsername } from "@/features/auth/server/db/data";
import {
    PostFeedWrapper,
    EmptyState,
    PostFeed,
    UserProfileCard,
} from "@/features/posts/components/list-view";
import { currentUserId } from "@/server/actions/auth";

const UserPage = async ({
    params,
}: {
    params: Promise<{ username: string }>;
}) => {
    const { username } = await params;

    if (!username) {
        return notFound();
    }

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

    const emptyState = (
        <EmptyState
            heading="Nothing to see"
            paragraph={`Check back later to check if ${username} has written anything!`}
        />
    );

    return (
        <>
            <UserProfileCard user={authorProfileInfoProps} />
            <PostFeedWrapper hidden showEndMessage={false}>
                <PostFeed
                    filters={{ byUserId: author.id }}
                    emptyState={emptyState}
                />
            </PostFeedWrapper>
        </>
    );
};

export default UserPage;
