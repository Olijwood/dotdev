import { getPosts } from "../server/db";
import { PostItem } from "./post-item";

const PostFeed = async ({ isAdmin = false }) => {
    const posts = await getPosts();

    return (
        <div className="flex w-full max-w-4xl flex-col items-stretch self-center">
            {posts.map((post) => (
                <PostItem post={post} key={post.slug} isAdmin={isAdmin} />
            ))}
        </div>
    );
};

export default PostFeed;
