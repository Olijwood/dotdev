import ReactionPopup from "./ReactionPopup";
import { useState } from "react";
import { BookmarkIcon, MessageCircle, Heart, PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getUserWithUsername,
  firestore,
  postToJSON,
  auth,
} from "@/lib/firebase";
import { getDoc, doc } from "firebase/firestore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export default function PostActions({
  postUid,
  slug,
  commentCount = 0,
  minutesToRead = 0,
}) {
  const [saved, setSaved] = useState(false);
  const postRef = doc(firestore, `users/${postUid}/posts/${slug}`);
  const isAuthor = auth.currentUser?.uid === postUid;
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 p-2 border-t">
        <ReactionPopup postRef={postRef} />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm text-muted-foreground">
                {commentCount}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Comments</p>
          </TooltipContent>
        </Tooltip>

        <div className="ml-auto">
          {minutesToRead
            ? minutesToRead > 0 && (
                <span className="text-sm text-muted-foreground mr-2">
                  {minutesToRead} min read
                </span>
              )
            : ""}
          {isAuthor ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/admin/${slug}`}>
                  <Button variant="ghost" size="sm">
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit</p>
              </TooltipContent>
            </Tooltip>
          ) : null}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSaved(!saved)}
                className={saved ? "text-primary" : ""}
              >
                <BookmarkIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{saved ? "Saved" : "Save"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
