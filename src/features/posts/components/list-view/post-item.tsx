"use client";

import Link from "next/link";
import { useCurrentUsername } from "@/hooks/auth";
import { getDateString } from "@/lib/utils";
import { getMinutesToRead, getWordCount } from "../../utils";
import { PostActions } from "./post-actions";
import PostMetadata from "./post-metadata";
import PostTags from "./post-tags";

type PostItemProps = {
    post: {
        id: string;
        title: string;
        slug: string;
        content: string;
        username: string;
        createdAt: Date;
        userImage: string;
        bannerImgUrl: string;
        commentCount: number;
        reactionCount: number;
        isSaved?: boolean;
    };
};

const PostItem = ({ post }: PostItemProps) => {
    const wordCount = getWordCount(post?.content);
    const username = useCurrentUsername();
    const isAuthor = username === post.username;
    const date = getDateString(post.createdAt);
    const minutesToRead = getMinutesToRead(wordCount);
    const authorProps = {
        username: post.username,

        userImg: post.userImage,
    };

    const tags = ["webdev", "accessibility", "html"];
    return (
        <div className="flex w-full flex-col align-middle md:w-2/3 lg:w-full">
            <article className="rounded-lg border border-gray-300 bg-card ">
                {post.bannerImgUrl && (
                    <div className="overflow-hidden">
                        <img
                            src={post.bannerImgUrl || "/placeholder.svg"}
                            alt={post.title}
                            width={400}
                            height={200}
                            className="w-full rounded-t-lg object-cover"
                        />
                    </div>
                )}
                <div className="p-3 pb-2">
                    <PostMetadata author={authorProps} date={date} />
                    <div className="pl-12">
                        <h2 className="mt-2 text-3xl font-bold leading-tight">
                            <Link
                                href={`/posts/${post.id}`}
                                className="hover:text-blue-600"
                            >
                                {post.title}
                            </Link>
                        </h2>

                        <PostTags tags={tags} />
                    </div>
                </div>
                <PostActions
                    postId={post.id}
                    slug={post.slug}
                    commentCount={post.commentCount}
                    minutesToRead={minutesToRead}
                    isAuthor={isAuthor}
                    isSaved={post.isSaved}
                />
            </article>
        </div>
    );
};

export { PostItem };
