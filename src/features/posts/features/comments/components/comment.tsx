"use client";

import { useState } from "react";
import { RenderMarkdown } from "../../markdown";
import { toggleCommentLike } from "../server/db";
import type { CommentType, ReplyType } from "../types";
import { Reply } from "./reply";
import { ReplyForm } from "./reply-form";
import { LikesBtn, RepliesBtn } from "./ui/button";
import { CommentMetadata, CommentUserImg } from "./ui/comment-user";

type CommentProps = {
    comment: CommentType;
};

export const Comment = ({ comment }: CommentProps) => {
    const [likes, setLikes] = useState<number>(comment.likes);
    const [liked, setLiked] = useState(comment.userLiked);
    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState(comment.replies || []);

    const handleLike = async () => {
        const result = await toggleCommentLike(comment.id);
        setLiked(result.liked);
        setLikes((prev) => prev + (result.liked ? 1 : -1));
    };

    const handleNewReply = (reply: ReplyType) => {
        setReplies((prev) => [...prev, reply]);
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <CommentUserImg
                    src={comment.user.image}
                    username={comment.user.username}
                />
                <div className="flex-1 space-y-2">
                    <CommentMetadata
                        username={comment.user?.username || "Guest"}
                        createdAt={comment.createdAt}
                    />
                    <RenderMarkdown content={comment.content} />
                    <div className="-ml-3 flex items-center gap-4">
                        <LikesBtn
                            nLikes={likes}
                            userLiked={liked}
                            handleClick={handleLike}
                        />
                        <RepliesBtn
                            nReplies={replies.length}
                            handleClick={() => setShowReplies((prev) => !prev)}
                        />
                    </div>
                </div>
            </div>
            {showReplies && (
                <>
                    <div className="ml-6 space-y-4 border-l-2 pl-4 sm:ml-10 md:ml-14 lg:ml-16">
                        {replies.map((reply) => (
                            <Reply key={reply.id} reply={reply} />
                        ))}
                    </div>
                    <div className="ml-6">
                        <ReplyForm
                            commentId={comment.id}
                            onNewReply={handleNewReply}
                        />
                    </div>
                </>
            )}
        </div>
    );
};
