"use client";

import Link from "next/link";
import { useCurrentUsername } from "@/hooks/auth";
import { getMinutesToRead, getWordCount } from "../../utils";
import { PostActions } from "./post-actions";

type PostItemProps = {
    post: {
        id: string;
        title: string;
        slug: string;
        content: string;
        username: string;
        image: string;
        commentCount: number;
        reactionCount: number;
        isSaved?: boolean;
    };
};

const PostItem = ({ post }: PostItemProps) => {
    const wordCount = getWordCount(post?.content);
    const username = useCurrentUsername();
    const isAuthor = username === post.username;

    const minutesToRead = getMinutesToRead(wordCount);
    return (
        <div className="flex w-full flex-col py-3 align-middle  md:w-2/3 lg:w-full">
            <div className="rounded-lg border border-gray-300 bg-card  ">
                <div className="p-4">
                    <Link href={`/${post.username}/${post.slug}`}>
                        <strong>
                            <h1 className="text-xl font-bold hover:underline">
                                {post.title}
                            </h1>
                        </strong>
                    </Link>

                    <h3 className="text-sm">
                        <Link
                            href={`/${post.username}`}
                            className="font-semibold text-muted-foreground hover:underline"
                        >
                            By @{post.username}
                        </Link>
                    </h3>
                </div>
                <PostActions
                    postId={post.id}
                    slug={post.slug}
                    commentCount={post.commentCount}
                    minutesToRead={minutesToRead}
                    isAuthor={isAuthor}
                    isSaved={post.isSaved}
                />
            </div>
        </div>
    );
};

export { PostItem };
