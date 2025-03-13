import { TabLink } from "@/components/ui/link";
import { Main } from "@/components/ui/main";
import { PostFeed } from "@/features/posts/components/list-view";

export default function Home({}) {
    return (
        <Main className=" scrollbar-y justify-start">
            <div className="mb-4 flex w-full flex-col items-center gap-4 py-2 sm:p-4 lg:py-8">
                <div className="no-scrollbar flex w-full max-w-3xl items-start overflow-x-auto border-b pl-1  lg:w-full">
                    <TabLink href="/" isActive>
                        Latest
                    </TabLink>
                    <TabLink href="/posts/top">Top</TabLink>
                </div>

                <PostFeed />
                <p className=" text-gray-500">You have reached the end!</p>
            </div>
        </Main>
    );
}
