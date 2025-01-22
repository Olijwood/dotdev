import React, { useContext, memo } from "react";
import { toggleLike } from "@/lib/firestoreUtils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import Image from "next/image";
import { UserContext } from "@/lib/context";

const Reply = memo(
  function Reply({ reply, replyPath }) {
    const { user } = useContext(UserContext);
    const liked = reply.likedBy?.[user?.uid] || false;

    const handleLikeToggle = async () => {
      if (!user) return;
      try {
        await toggleLike(`${replyPath}`, user.uid, liked);
      } catch (error) {
        console.error("Error toggling like for reply:", error);
      }
    };

    return (
      <div className="flex items-start gap-4">
        <Avatar className="w-8 h-8">
          <Image
            src={reply.user?.photoURL || "/hacker.png"}
            width={100}
            height={100}
            alt={`${reply.user?.displayName} profile picture`}
          />
          <AvatarFallback>{reply.user?.displayName[0] || "?"}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{reply.user?.displayName}</span>
            <span className="text-sm text-muted-foreground">
              {`${new Date(reply.createdAt).toLocaleTimeString("default", {
                hour: "numeric",
                minute: "2-digit",
                hour12: false,
              })} ${new Date(reply.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "2-digit",
                year: "2-digit",
              })}
            `}
            </span>
          </div>
          <p className="text-sm">{reply.content}</p>
          <button
            className="flex items-center gap-1 mt-2 text-sm"
            onClick={handleLikeToggle}
          >
            <Heart
              className={`w-4 h-4 ${liked ? "fill-current text-red-500" : ""}`}
            />
            <span>{reply.likes || 0}</span>
          </button>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.reply.likes === nextProps.reply.likes &&
      prevProps.reply.createdAt === nextProps.reply.createdAt
    );
  }
);

export default Reply;
