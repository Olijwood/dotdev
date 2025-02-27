"use client";

import { useComments } from "../hooks";
import { Comment } from "./comment";
import { CommentForm } from "./comment-form";

type CommentsSectionProps = {
    postId: string;
};

export const CommentSection = ({ postId }: CommentsSectionProps) => {
    const { comments, handleNewComment } = useComments(postId);

    return (
        <div className="mt-0 h-auto rounded-none border border-t-0 border-gray-300 bg-white p-4 sm:mx-[1%] sm:my-2 sm:rounded-lg md:mx-[2.5%]">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
                Latest comments
            </h2>

            <CommentForm postId={postId} onNewComment={handleNewComment} />

            <div className="mt-8 space-y-6">
                {comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} />
                ))}
            </div>
        </div>
    );
};
