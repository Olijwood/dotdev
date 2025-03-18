import { Suspense } from "react";
import Loading from "@/components/ui/loading";
import { checkIfCurrentUser } from "@/server/actions/auth";
import {
    PostFeedFilter,
    PostFilterName,
    PostSortName,
} from "./post-feed-filters2";

export async function PostFeedWrapper({
    page = "",
    activeTab = "Discover",
    activeSort = "Latest",
    showEndMessage = true,
    isDropdown = true,
    hidden = false,
    children,
}: {
    page?: string;
    activeTab?: PostFilterName;
    activeSort?: PostSortName;
    isDropdown?: boolean;
    hidden?: boolean;
    showEndMessage?: boolean;
    children: React.ReactNode;
}) {
    const isUser = await checkIfCurrentUser();
    return (
        <div className=" h-full flex w-full flex-col items-center gap-4 py-2 sm:p-4 ">
            <PostFeedFilter
                page={page}
                activeTab={activeTab}
                activeSort={activeSort}
                isAuthenticated={isUser && isDropdown}
                hidden={hidden}
            />
            <Suspense fallback={<Loading />}>{children}</Suspense>
            {showEndMessage && (
                <p className=" text-gray-500">You have reached the end!</p>
            )}
        </div>
    );
}
