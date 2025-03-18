import { Suspense } from "react";
import { SkeletonPostList } from "../post-list";
import {
    PostFeedFilter,
    PostFilterName,
    PostSortName,
} from "./post-feed-filters2";

export function PostFeedWrapper({
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
    return (
        <div className=" h-full flex w-full flex-col items-center gap-4 py-2 sm:p-4 ">
            <PostFeedFilter
                page={page}
                activeTab={activeTab}
                activeSort={activeSort}
                isDropdown={isDropdown}
                hidden={hidden}
            />
            <Suspense fallback={<SkeletonPostList />}>{children}</Suspense>
            {showEndMessage && (
                <p className=" text-gray-500">You have reached the end!</p>
            )}
        </div>
    );
}
