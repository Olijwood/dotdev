import Link from "next/link";
import ReactMarkdown from "react-markdown";

// UI component for main post content
export default function PostContent({ post }) {
  const createdAt =
    typeof post?.createdAt === "number"
      ? new Date(post.createdAt)
      : post.createdAt.toDate();
  const dateStr = createdAt.toLocaleString("default", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="card">
      <strong>
        <h1>{post?.title}</h1>
      </strong>
      <span className="text-sm text-gray-500">
        Written by{" "}
        <Link href={`/${post.username}/`} className="text-info">
          @{post.username}
        </Link>{" "}
        on {dateStr}
      </span>
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </div>
  );
}
