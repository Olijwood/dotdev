import { useContext, useMemo } from "react";
import { UserContext } from "@/lib/context";
import { addComment, basicUserData, updateCount } from "@/lib/firestoreUtils";
import CommentForm from "./CommentForm";
import Comment from "./Comment";

import { useComments } from "@/lib/commentsContext";

const handleAddComment = async (commentData, postPath, user) => {
  commentData["user"] = basicUserData(user);
  addComment(postPath, commentData)
    .then(async () => {
      try {
        await updateCount(postPath, 1, "commentCount");
      } catch (error) {
        console.error("Error updating comment count:", error);
      }
    })
    .catch((error) => {
      console.error("Error adding comment:", error);
    });
};

export default function CommentsSection({ postPath }) {
  const commentsMap = useComments();
  const comments = useMemo(
    () => Array.from(commentsMap.values()),
    [commentsMap]
  );
  const { user } = useContext(UserContext);

  return (
    <div className="space-y-4 max-w-3xl mx-2 p-2 mb-[40px]">
      <CommentForm
        onSubmit={(commentData) =>
          handleAddComment(commentData, postPath, user)
        }
      />
      <div className="space-y-6">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} postPath={postPath} />
        ))}
      </div>
    </div>
  );
}
