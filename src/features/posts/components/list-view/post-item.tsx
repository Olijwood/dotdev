"use client";

import Link from "next/link";
import type { PostListItem } from "@/features/posts/types";
import { useCurrentUsername } from "@/hooks/auth";
import { cn, getDateString } from "@/lib/utils";
import { getMinutesToRead, getWordCount } from "../../utils";
import { PostActions } from "./post-actions";
import PostMetadata from "./post-metadata";
import PostTags from "./post-tags";

type PostItemProps = {
    post: PostListItem;
    containerCn?: string;
};

const PostItem = ({ post, containerCn = "" }: PostItemProps) => {
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
        <div
            className={cn(
                "flex w-full flex-col align-middle lg:w-full",
                containerCn,
            )}
        >
            <article className="sm:rounded-lg sm:border border-gray-300 bg-card ">
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
                        <h2 className="mt-2 text-2xl md:text-3xl md font-bold leading-tight">
                            <Link
                                href={`/posts/${post.slug}`}
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
