"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare } from "lucide-react";
import { useState } from "react";
import { CommentForm } from "./comment-form";

export function Comment({
  comment,
  onReply,
  onLike,
  user,
  activeReplyFormId,
  setActiveReplyFormId,
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [liked, setLiked] = useState(false);
  const isReplyFormActive = activeReplyFormId === comment.id;

  const handleLike = () => {
    setLiked(!liked);
    onLike?.(comment.id);
  };

  const handleReplyClick = () => {
    if (isReplyFormActive) {
      setActiveReplyFormId(null);
    } else {
      setActiveReplyFormId(comment.id);
    }
  };

  const handleReply = (replyData) => {
    onReply?.(comment.id, replyData);
    // setShowReplyForm(false);
    setActiveReplyFormId(null);
  };

  const handleCloseReplies = () => {
    setShowReplyForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={comment.user.photoURL} />
          <AvatarFallback>{comment.user.displayName[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{comment.user.displayName}</span>
            <span className="text-sm text-muted-foreground">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm">{comment.content}</p>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleLike}
            >
              <Heart
                className={`w-4 h-4 ${
                  liked ? "fill-current text-red-500" : ""
                }`}
              />
              <span>{comment.likes || 0}</span>
            </Button>
            {onReply && (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                onClick={handleReplyClick}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{comment.replies?.length || 0}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
      {isReplyFormActive && (
        <div className="ml-6">
          <CommentForm
            onSubmit={handleReply}
            placeholder="Write a reply..."
            user={user}
          />
        </div>
      )}
      {comment.replies?.length > 0 && (
        <div className="ml-6 sm:ml-10 md:ml-14 lg:ml-16 space-y-4 border-l-2 pl-4">
          {comment.replies.map((reply) => (
            <Comment
              id={reply.id}
              key={reply.id}
              comment={reply}
              onLike={onLike}
              user={user}
              onReply={null}
              activeReplyFormId={activeReplyFormId}
              setActiveReplyFormId={setActiveReplyFormId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
