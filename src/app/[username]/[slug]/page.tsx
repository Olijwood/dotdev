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
import Loading from "../loading";

const PostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;

    if (!slug) return notFound();

    const post = await getPostBySlug(slug);
    if (!post) return notFound();

    const {
        user: author,
        title,
        content,
        createdAt,
        id,
        reactions,
        bannerImgUrl,
        commentCount,
        saveCount,
    } = post;

    const reactionCounts = reactions.reduce(
        (acc, { type }) => {
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
    };

    return (
        <Suspense fallback={<Loading />}>
            <div className="flex size-full  max-w-6xl flex-col  sm:flex-row sm:gap-2">
                {/* Actions sidebar - hidden on mobile */}
                <div className="relative  hidden items-start sm:flex md:flex">
                    <PostToolbar
                        postId={id}
                        slug={slug}
                        counts={{ commentCount, saveCount }}
                    />
                </div>
                {/* Main content */}{" "}
                <div className=" h-fit min-w-0 flex-1  sm:mr-2 md:mr-0">
                    <PostContent post={contentPostProp} />
                    <CommentSection postId={id} />
                </div>
                {/* Author sidebar - hidden on mobile */}
                <div className="mr-2 hidden w-48 md:block lg:w-64">
                    <AuthorSidebar
                        author={author}
                        className="sticky space-y-2 "
                    />
                </div>
            </div>

            {/* Mobile actions - fixed to bottom */}
            <PostToolbar
                postId={id}
                slug={slug}
                counts={{ commentCount, saveCount }}
                isMobile
            />
        </Suspense>
    );
};

export default PostPage;
