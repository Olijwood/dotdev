import { Main } from "@/components/ui/main";
import { PostFeed } from "@/features/posts/components/list-view";

export default function Home() {
    return (
        <Main className=" scrollbar-y justify-start">
            <div className="mb-4 flex w-full flex-col items-center gap-4 sm:p-4 lg:py-8">
                <div className="no-scrollbar flex w-full max-w-3xl items-start overflow-x-auto border-b pl-1 md:w-2/3 lg:w-full">
                    <div className="border-b-2 border-black px-4 py-3 text-lg font-bold">
                        Latest
                    </div>

                    <div className="px-4 py-3 text-lg font-medium text-gray-600">
                        Top
                    </div>
                </div>

                <PostFeed />
                <p className=" text-gray-500">You have reached the end!</p>
            </div>
        </Main>
    );
}
