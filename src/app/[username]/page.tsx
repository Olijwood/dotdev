"use server";

import { notFound } from "next/navigation";
import { getUserProfileInfoByUsername } from "@/features/auth/server/db/data";
import {
    UserPostFeed,
    UserProfileCard,
} from "@/features/posts/components/list-view";


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

    const authorProfileInfoProps = {
        username: author.username,
        name: author.name,
    };

    return (
        <div className="flex w-full max-w-4xl flex-col gap-4 p-4 lg:py-8">
            <UserProfileCard user={authorProfileInfoProps} />
            <UserPostFeed authorId={author.id} username={author.username} />
        </div>
    );
};

export default UserPage;
