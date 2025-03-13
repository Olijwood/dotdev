"use server";

import { notFound } from "next/navigation";
import { Suspense } from "react";
import Loading from "@/components/ui/loading";
import {
    PostFeedWrapper,
    SavedPostFeed,
} from "@/features/posts/components/list-view";
import { currentUser } from "@/server/actions/auth";

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
        <PostFeedWrapper isFiltersVisible={false}>
            <h1 className="text-center text-3xl font-bold">
                Your Reading List
            </h1>
            <Suspense fallback={<Loading />}>
                <SavedPostFeed />
            </Suspense>
        </PostFeedWrapper>
    );
};

export default ReadingListPage;
