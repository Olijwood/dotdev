import Link from "next/link";
import PostActions from "./PostActions";

export default function PostFeed({ posts, isAdmin = false }) {
    return (
        <div className="flex flex-col w-full items-stretch self-center max-w-4xl">
            {posts
                ? posts.map((post) => (
                      <PostItem post={post} key={post.slug} isAdmin={isAdmin} />
                  ))
                : null}
        </div>
    );
}

function PostItem({ post, isAdmin = false }) {
    const wordCount = post?.content.trim().split(/\s+/g).length;
    const minutesToRead = (wordCount / 100 + 1).toFixed(0);
    return (
        <div className="w-full flex flex-col align-center py-3">
            <div className="rounded-lg border border-gray-300 bg-card ">
                <div className="p-4">
                    <Link href={`/${post.username}`}>
                        <h3>By @{post.username}</h3>
                    </Link>
                    <Link href={`/${post.username}/${post.slug}`}>
                        <strong>
                            <h1>{post.title}</h1>
                        </strong>
                    </Link>
                </div>
                <PostActions
                    postUid={post.uid}
                    slug={post.slug}
                    saveCount={post.saveCount}
                    minutesToRead={minutesToRead}
                    isAdmin={isAdmin}
                />
            </div>
        </div>
    );
}
