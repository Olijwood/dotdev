import { getPosts } from "../../server/db";
import { PostItem } from "./post-item";

export const PostFeed = async () => {
    const posts = await getPosts();

    return (
        <div className="flex w-full max-w-4xl flex-col items-center self-center">
            {posts.map((post) => (
                <PostItem post={post} key={post.slug} />
            ))}
        </div>
    );
};
