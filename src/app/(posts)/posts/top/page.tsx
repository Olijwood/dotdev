import { TabLink } from "@/components/ui/link";
import { Main } from "@/components/ui/main";
import { PostFeed } from "@/features/posts/components/list-view";

export default function TopPostsPage() {
    return (
        <Main className=" scrollbar-y justify-start">
            <div className="mb-4 flex w-full flex-col items-center gap-4 sm:p-4  lg:py-8">
                <div className="no-scrollbar flex w-full max-w-3xl items-start overflow-x-auto border-b pl-1 md:w-2/3 lg:w-full">
                    <TabLink href="/">Latest</TabLink>
                    <TabLink href="/posts/top" isActive>
                        Top
                    </TabLink>
                </div>

                <PostFeed orderBy="top" />
                <p className=" text-gray-500">You have reached the end!</p>
            </div>
        </Main>
    );
}
