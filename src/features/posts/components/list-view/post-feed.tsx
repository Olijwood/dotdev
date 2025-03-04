import { Suspense } from "react";
import { Loader } from "@/components/ui/loader";
import { getPosts } from "../../server/db";
import { PostList } from "./post-list";

export const PostFeed = async () => {
    const posts = await getPosts();

    if (posts.length === 0) {
        return (
            <p className="text-center text-muted-foreground">
                No posts available.
            </p>
        );
    }

    return (
        <Suspense fallback={<Loader size="xl" />}>
            <PostList posts={posts} />
        </Suspense>
    );
};
