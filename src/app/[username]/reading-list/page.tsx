"use server";

import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SavedPostFeed } from "@/features/posts/components/saved-post";
import { currentUser } from "@/server/actions/auth";
import Loading from "../loading";

const ReadingListPage = async ({
    params,
}: {
    params: Promise<{ username: string }>;
}) => {
    const { username } = await params;
    const user = await currentUser();

    if (!user || user.username !== username) {
        return notFound();
    }

    return (
        <div className="w-full max-w-4xl gap-1 p-4 lg:gap-4 lg:py-8">
            <h1 className="text-center text-3xl font-bold">
                Your Reading List
            </h1>
            <Suspense fallback={<Loading />}>
                <SavedPostFeed />
            </Suspense>
        </div>
    );
};

export default ReadingListPage;
