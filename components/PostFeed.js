import Link from "next/link";
import PostActions from "./PostActions";

export default function PostFeed({ posts, admin }) {
  return posts
    ? posts.map((post) => (
        <PostItem post={post} key={post.slug} admin={admin} />
      ))
    : null;
}

function PostItem({ post, admin = false }) {
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);
  return (
    <div className="max-w-3xl mx-auto p-3">
      <div className="rounded-lg border bg-card">
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
          commentCount={0}
          minutesToRead={minutesToRead}
        />
      </div>
    </div>
  );
}
