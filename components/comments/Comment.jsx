import React, { useState, useEffect, useContext, useMemo, memo } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import {
  addReply,
  updateCount,
  toggleLike,
  replyToJSON,
  basicUserData,
} from "@/lib/firestoreUtils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/lib/context";
import { Heart, MessageSquare } from "lucide-react";
import ReplyForm from "./ReplyForm";
import Reply from "./Reply";
import Image from "next/image";

const Comment = memo(
  function Comment({ comment, postPath }) {
    const [replies, setReplies] = useState([]);
    const [showReplies, setShowReplies] = useState(false);
    const { user } = useContext(UserContext);

    const commentPath = `${postPath}/comments/${comment.id}`;
    const liked = useMemo(
      () => comment.likedBy?.[user?.uid] || false,
      [comment.likedBy, user?.uid]
    );

    const handleShowReplies = () => {
      setShowReplies((prev) => !prev);
    };

    const handleReplySubmit = async (replyData) => {
      replyData["user"] = basicUserData(user);
      try {
        await Promise.all([
          [
            addReply(commentPath, replyData),
            updateCount(commentPath, 1, "repliesCount"),
          ],
        ]);
      } catch (error) {
        console.error("Error adding reply:", error);
      }
    };

    useEffect(() => {
      if (!showReplies) return;
      const repliesRef = query(
        collection(firestore, `${commentPath}/replies`),
        orderBy("createdAt", "asc")
      );

      const unsubscribe = onSnapshot(repliesRef, (snapshot) => {
        const fetchedReplies = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...replyToJSON(doc),
        }));
        setReplies(fetchedReplies);
      });

      return unsubscribe;
    }, [commentPath, showReplies]);

    const handleLikeToggle = async () => {
      try {
        await toggleLike(commentPath, user?.uid, liked);
      } catch (error) {
        console.error("Error liking comment:", error);
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <Avatar className="w-10 h-10">
            <Image
              src={comment.user?.photoURL || "/hacker.png"}
              width={100}
              height={100}
              alt={`${comment.user?.displayName} Profile Pic`}
            />
            <AvatarFallback>
              {comment.user?.displayName[0] || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{comment.user?.displayName}</span>
              <span className="text-sm text-muted-foreground">
                {`${new Date(comment.createdAt).toLocaleTimeString("default", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: false,
                })} ${new Date(comment.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "2-digit",
                  year: "2-digit",
                })}
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
                <Reply
                  key={reply.id}
                  reply={reply}
                  replyPath={`${commentPath}/replies/${reply.id}`}
                />
              ))}
            </div>
            <div className="ml-6">
              <ReplyForm
                onSubmit={(replyData) => {
                  handleReplySubmit(replyData, commentPath, user);
                }}
                onCancel={() => setShowReplies(false)}
              />
            </div>
          </>
        )}
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.comment.likes === nextProps.comment.likes &&
    prevProps.comment.repliesCount === nextProps.comment.repliesCount
);

export default Comment;
