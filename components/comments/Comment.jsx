import React, { useState, useEffect, useContext, useMemo } from "react";
import { collection, onSnapshot, doc, getDocs } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import {
  addReply,
  updateCommentCount,
  toggleLike,
  fetchReplies,
  basicUserData,
} from "@/lib/firestoreUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/lib/context";
import { Heart, MessageSquare } from "lucide-react";
import ReplyForm from "./ReplyForm";
import Reply from "./Reply";
import Image from "next/image";

export default function Comment({ comment, postPath }) {
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);
  const [liked, setLiked] = useState(false);
  const { user } = useContext(UserContext);

  // Memoized Firestore references

  useEffect(() => {
    // Listen for real-time updates to the comment
    const commentRef = doc(firestore, `${postPath}/comments/${comment.id}`);
    const unsubscribe = onSnapshot(commentRef, (docSnapshot) => {
      const updatedComment = docSnapshot.data();
      comment.likes = updatedComment.likes;
      comment.repliesCount = updatedComment.repliesCount;
    });

    return unsubscribe;
  }, [postPath, comment.id]);

  const handleShowReplies = async () => {
    if (!showReplies) {
      try {
        const fetchedReplies = await fetchReplies(
          `${postPath}/comments/${comment.id}`
        );

        setReplies(fetchedReplies);
        setShowReplies(true);
      } catch (error) {
        console.error("Error loading replies:", error);
      }
    } else {
      setShowReplies(false);
    }
  };

  useEffect(() => {
    const likesRef = collection(
      firestore,
      `${postPath}/comments/${comment.id}/likes`
    );
    const unsubscribeLikes = onSnapshot(likesRef, (snapshot) => {
      const userLike = snapshot.docs.find((doc) => doc.id === user?.uid);
      setLiked(userLike?.exists() ? userLike.data().liked : false);
    });

    return unsubscribeLikes;
  }, [postPath, comment.id, user?.uid]);

  const replyRef = useMemo(() => {
    return collection(firestore, `${postPath}/comments/${comment.id}/replies`);
  }, [postPath, comment.id]);

  const handleReplySubmit = async (replyData) => {
    replyData["user"] = basicUserData(user);

    addReply(`${postPath}/comments/${comment.id}`, replyData)
      .then(async () => {
        try {
          await updateCommentCount(`${postPath}`, 1, "commentCount");
          await updateCommentCount(
            `${postPath}/comments/${comment.id}`,
            1,
            "repliesCount"
          );
        } catch (error) {
          console.error("Error updating comment count:", error);
        }
      })
      .catch((error) => {
        console.error("Error adding reply:", error);
      });

    fetchReplies(`${postPath}/comments/${comment.id}`).then((replies) =>
      setReplies(replies)
    ); // Optionally fetch replies again after adding a reply
    setShowReplies(true);
  };

  const handleLikeToggle = async () => {
    console.log("Toggle like for comment:", comment.id);
    try {
      await toggleLike(`${postPath}/comments/${comment.id}`, user?.uid);
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  console.log("comment", comment);
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Avatar className="w-10 h-10">
          <Image
            src={comment.user?.photoURL || "/hacker.png"}
            width={100}
            height={100}
          />
          <AvatarFallback>{comment.user?.displayName[0] || "?"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{comment.user?.displayName}</span>
            <span className="text-sm text-muted-foreground">
              {`${new Date(comment.createdAt?.toDate()).toLocaleTimeString(
                "default",
                {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: false,
                }
              )} ${new Date(comment.createdAt?.toDate()).toLocaleDateString(
                "en-US",
                {
                  day: "numeric",
                  month: "2-digit",
                  year: "2-digit",
                }
              )}
            `}
            </span>
          </div>

          <p className="text-sm">{comment.content}</p>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleLikeToggle}
            >
              <Heart
                className={`w-4 h-4 ${
                  liked ? "fill-current text-red-500" : ""
                }`}
              />
              <span>{comment.likes || 0}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleShowReplies}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{comment.repliesCount || 0}</span>
            </Button>
          </div>
        </div>
      </div>

      {showReplies && (
        <>
          <div className="ml-6 sm:ml-10 md:ml-14 lg:ml-16 space-y-4 border-l-2 pl-4">
            {replies.map((reply) => (
              <Reply key={reply.id} reply={reply} />
            ))}
          </div>
          <div className="ml-6">
            <ReplyForm
              onSubmit={handleReplySubmit}
              onCancel={() => setShowReplies(false)}
            />
          </div>
        </>
      )}
    </div>
  );
}

// export default Comment;
