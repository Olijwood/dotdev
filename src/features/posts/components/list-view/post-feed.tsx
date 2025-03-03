import { getPosts } from "../../server/db";
import { PostList } from "./post-list";

export const PostFeed = async () => {
    const posts = await getPosts();

    return <PostList posts={posts} />;
};
