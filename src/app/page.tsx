import { Main } from "@/components/ui/main";
import { PostFeed } from "@/features/posts/components/list-view";

export default function Home() {
    return (
        <Main className=" scrollbar-y justify-start">
            <div className=" flex w-full flex-col items-center gap-1 p-4 lg:gap-4 lg:py-8">
                <h1 className="text-3xl font-bold ">All Posts</h1>
                <PostFeed />
                <p className="mt-2 text-gray-500">You have reached the end!</p>
            </div>
        </Main>
    );
}
