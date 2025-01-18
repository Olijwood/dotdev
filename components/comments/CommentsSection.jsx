import { useContext, useState, useEffect } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { UserContext } from "@/lib/context";
import {
  addComment,
  addReply,
  basicUserData,
  updateCommentCount,
} from "@/lib/firestoreUtils";
import CommentForm from "./CommentForm";
import Comment from "./Comment";

export default function CommentsSection({ postPath }) {
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const commentsRef = collection(firestore, `${postPath}/comments`);
    const commentsQuery = query(commentsRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      const fetchedComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(fetchedComments);
    });

    return unsubscribe;
  }, [postPath]);

  const handleAddComment = async (commentData) => {
    commentData["user"] = basicUserData(user);
    addComment(postPath, commentData)
      .then(async () => {
        try {
          await updateCommentCount(postPath, 1, "commentCount");
        } catch (error) {
          console.error("Error updating comment count:", error);
        }
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
      });
  };

  console.log("Rendering comments section");
  return (
    <div className="space-y-4 max-w-3xl mx-2 p-2 mb-[40px]">
      <CommentForm onSubmit={handleAddComment} />
      <div className="space-y-6">
        {comments?.map((comment) => (
          <Comment key={comment.id} comment={comment} postPath={postPath} />
        ))}
      </div>
    </div>
  );
}
