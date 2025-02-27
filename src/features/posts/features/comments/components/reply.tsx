"use client";

import { useState } from "react";
import { RenderMarkdown } from "../../markdown";
import { toggleReplyLike } from "../server/db";
import type { ReplyType } from "../types";
import { LikesBtn } from "./ui/button";
import { CommentUserImg, CommentMetadata } from "./ui/comment-user/";

type ReplyProps = {
    reply: ReplyType;
};

export const Reply = ({ reply }: ReplyProps) => {
    const [likes, setLikes] = useState(reply.likes);
    const [userLiked, setUserLiked] = useState(reply.userLiked);
    const { user, content, createdAt } = reply;

    const handleLike = async () => {
        const result = await toggleReplyLike(reply.id);
        setUserLiked(result.liked);
        setLikes((prev) => prev + (result.liked ? 1 : -1));
    };

    return (
        <div className="flex items-start gap-4">
            <CommentUserImg src={user.image} username={user.username} />
            <div className="flex-1">
                <CommentMetadata
                    username={user.username}
                    createdAt={createdAt}
                />
                <RenderMarkdown content={content} />
                <LikesBtn
                    nLikes={likes}
                    userLiked={userLiked}
                    handleClick={handleLike}
                />
            </div>
        </div>
    );
};
