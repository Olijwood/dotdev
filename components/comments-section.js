import { useState } from "react";
import { CommentForm } from "./comment-form";
import { Comment } from "./comment";

export function CommentsSection({ initialComments = [], user }) {
  const [comments, setComments] = useState(initialComments);

  const handleNewComment = (commentData) => {
    const newComment = {
      id: Date.now().toString(),
      ...commentData,
      likes: 0,
      replies: [],
    };
    setComments([newComment, ...comments]);
  };

  const handleReply = (commentId, replyData) => {
    const newReply = {
      id: Date.now().toString(),
      ...replyData,
      likes: 0,
      replies: [],
    };

    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        }
        return comment;
      })
    );
  };

  const handleLike = (commentId) => {
    const getUpdatedComment = (comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: (comment.likes || 0) + 1,
        };
      }

      return {
        ...comment,
        replies: comment.replies?.map(getUpdatedComment),
      };
    };

    setComments(comments.map(getUpdatedComment));
  };

  return (
    <div className="space-y-4 max-w-3xl mx-2 p-2 mb-[40px]">
      <CommentForm onSubmit={handleNewComment} user={user} />
      <div className="space-y-6">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onReply={handleReply}
            onLike={handleLike}
            user={user}
          />
        ))}
      </div>
    </div>
  );
}
