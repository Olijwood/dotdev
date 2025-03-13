import { Suspense } from "react";
import Loading from "@/components/ui/loading";
import { PostFeedFilter, PostFilterTabName } from "./post-feed-filters";

export function PostFeedWrapper({
    activeTab = "Latest",
    isFiltersVisible = true,
    showEndMessage = true,
    children,
}: {
    activeTab?: PostFilterTabName;
    isFiltersVisible?: boolean;
    showEndMessage?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className=" h-full flex w-full flex-col items-center gap-4 py-2 sm:p-4 ">
            {isFiltersVisible && <PostFeedFilter activeTab={activeTab} />}
            <Suspense fallback={<Loading />}>{children}</Suspense>
            {showEndMessage && (
                <p className=" text-gray-500">You have reached the end!</p>
            )}
        </div>
    );
}
