import { PostToolbarSkeleton } from "../toolbar";
import { AuthorSidebarSkeleton } from "./author-sidebar";
import { PostContentSkeleton } from "./post-content";

export const PostDetailSkeleton = () => {
    return (
        <>
            <div className="flex size-full  max-w-6xl flex-col  sm:flex-row sm:gap-2">
                <div className="relative  hidden items-start sm:flex md:flex">
                    <PostToolbarSkeleton />
                </div>

                <div className=" h-fit min-w-0 flex-1 pb-14 sm:mr-2 sm:pb-2 md:mr-0">
                    <PostContentSkeleton />
                    <AuthorSidebarSkeleton className="md:hidden" />
                </div>

                <div className="mr-2 hidden w-48 md:block lg:w-64">
                    <AuthorSidebarSkeleton />
                </div>
            </div>

            <PostToolbarSkeleton isMobile />
        </>
    );
};
