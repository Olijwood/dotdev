"use server";

import { ReactionType } from "@prisma/client";
import { notFound } from "next/navigation";
import {
    AuthorSidebar,
    PostContent,
} from "@/features/posts/components/detail-view";
import { PostToolbar } from "@/features/posts/components/toolbar";
import { CommentSection } from "@/features/posts/features/comments/components/comment-section";
import { getPostBySlug } from "@/features/posts/server/db";
import { Tag } from "@/features/posts/types";
import { currentUser } from "@/server/actions/auth";

type reaction = {
    type: ReactionType;
};

const getReactionCounts = (reactions: reaction[]) => {
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

    return reactionCounts;
};

export async function PostDetailView({ slug }: { slug: string }) {
    const user = await currentUser();

    const post = await getPostBySlug(slug);
    if (!post) return notFound();

    const {
        author,
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

    const reactionCounts = getReactionCounts(reactions);

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
        <>
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

                <div className=" h-fit min-w-0 space-y-2 flex-1 pb-14 sm:mr-2 sm:pb-2 md:mr-0">
                    <PostContent post={contentPostProp} />
                    <AuthorSidebar author={author} className="  md:hidden" />
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
        </>
    );
}
