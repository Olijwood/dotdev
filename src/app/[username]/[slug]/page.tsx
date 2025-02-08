import { ReactionType } from "@prisma/client";
import { notFound } from "next/navigation";
import { PostContent } from "@/features/posts/components/post-content";
import { PostSidebar } from "@/features/posts/components/post-sidebar";
import { PostToolbar } from "@/features/posts/components/post-toolbar";
import { getPostBySlug } from "@/features/posts/server/db";

const PostPage = async ({ params }: { params: { slug: string } }) => {
    const { slug } = await params;

    if (!slug) return notFound();

    const post = await getPostBySlug(slug);

    if (!post) return notFound();
    const { user: author, title, content, createdAt, id, reactions } = post;

    const reactionCounts = reactions.reduce(
        (acc, { type }) => {
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        },
        {} as Record<ReactionType, number>,
    );

    const contentPostProp = {
        id,
        author,
        title,
        content,
        createdAt,
        reactions: reactionCounts,
    };

    return (
        <>
            <div className="flex w-full max-w-6xl flex-col justify-stretch sm:flex-row sm:gap-3">
                {/* Actions sidebar - hidden on mobile */}
                <div className="hidden w-16 sm:flex">
                    {/* <PostToolbar className="sticky top-12" /> */}
                    <PostToolbar postId={id} />
                </div>
                {/* Main content */}{" "}
                <div className="flex-1">
                    <PostContent post={contentPostProp} />
                </div>
                {/* Author sidebar - hidden on mobile */}
                <div className="mr-2 hidden w-48 sm:block lg:w-64">
                    <PostSidebar
                        author={author}
                        className="sticky space-y-4 "
                    />
                </div>
            </div>

            {/* Mobile actions - fixed to bottom */}
            {/* <PostToolbar
                className="fixed inset-x-0 bottom-0 border-t bg-white md:hidden"
                isMobile
            /> */}
            <PostToolbar
                postId={id}
                isMobile
                // className="fixed inset-x-0 bottom-0 border-t bg-white sm:hidden"
            />
        </>
    );
};

export default PostPage;
