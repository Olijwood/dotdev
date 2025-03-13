"use server";

import { ReactionType } from "@prisma/client";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
    AuthorSidebar,
    PostContent,
} from "@/features/posts/components/detail-view";
import { PostToolbar } from "@/features/posts/components/toolbar";
import { CommentSection } from "@/features/posts/features/comments/components/comment-section";
import { getPostBySlug } from "@/features/posts/server/db";
import { Tag } from "@/features/posts/types";
import { currentUser } from "@/server/actions/auth";
import Loading from "../loading";

const PostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    const user = await currentUser();

    if (!slug) return notFound();

    const post = await getPostBySlug(slug);
    if (!post) return notFound();

    const {
        user: author,
        title,
        content,
        createdAt,
        id,
        reactions = [],
        bannerImgUrl,
        commentCount,
        saveCount,
        isSaved,
    } = post;

    const isAuthor = user?.username === author.username;

    const reactionCounts = reactions.reduce(
        (
            acc: Record<ReactionType, number>,
            { type }: { type: ReactionType },
        ) => {
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        },
        {} as Record<ReactionType, number>,
    );

    const contentPostProp = {
        id,
        bannerImgUrl,
        author,
        title,
        content,
        createdAt,
        reactions: reactionCounts,
        tags: post.tags as Tag[],
    };

    return (
        <Suspense fallback={<Loading />}>
            <div className="flex size-full  max-w-6xl flex-col  sm:flex-row sm:gap-2">
                <div className="relative  hidden items-start sm:flex md:flex">
                    <PostToolbar
                        postId={id}
                        slug={slug}
                        isAuthor={isAuthor}
                        reactionCounts={reactionCounts}
                        commentCount={commentCount}
                        saveCount={saveCount}
                        isSaved={isSaved}
                    />
                </div>

                <div className=" h-fit min-w-0 flex-1 pb-14 sm:mr-2 sm:pb-2 md:mr-0">
                    <PostContent post={contentPostProp} />
                    <CommentSection postId={id} />
                </div>

                <div className="mr-2 hidden w-48 md:block lg:w-64">
                    <AuthorSidebar author={author} />
                </div>
            </div>

            <PostToolbar
                postId={id}
                slug={slug}
                isAuthor={isAuthor}
                reactionCounts={reactionCounts}
                commentCount={commentCount}
                saveCount={saveCount}
                isSaved={isSaved}
                isMobile
            />
        </Suspense>
    );
};

export default PostPage;
