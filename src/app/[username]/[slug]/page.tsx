import { ReactionType } from "@prisma/client";
import { notFound } from "next/navigation";
import { PostContent } from "@/features/posts/components/post-content";
import { PostSidebar } from "@/features/posts/components/post-sidebar";
import { PostActions } from "@/features/posts/components/post-toolbar";
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
            <div className="flex w-full max-w-7xl flex-col justify-stretch md:flex-row md:gap-3">
                {/* Actions sidebar - hidden on mobile */}
                <div className="ml-3 hidden w-16 md:block">
                    <PostActions className="sticky top-12" />
                </div>

                {/* Main content */}
                <div className="flex-1">
                    <PostContent post={contentPostProp} />
                </div>

                {/* Author sidebar - hidden on mobile */}
                <div className="hidden w-64 md:block">
                    <PostSidebar
                        author={author}
                        className="sticky space-y-4 "
                    />
                </div>
            </div>

            {/* Mobile actions - fixed to bottom */}
            <PostActions
                className="fixed inset-x-0 bottom-0 border-t bg-white md:hidden"
                isMobile
            />
        </>
    );
};

export default PostPage;
