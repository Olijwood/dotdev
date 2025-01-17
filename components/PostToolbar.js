import { useState, useEffect, useRef } from "react";
import {
  BookmarkIcon,
  MessageCircleIcon,
  SmileIcon,
  PencilIcon,
  Heart,
} from "lucide-react";
import ReactionPopup from "./ReactionPopup";
import Link from "next/link";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

export default function PostToolbar({ post, postRef, isAuthor }) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const windowCurrent = window;
      const checkScreenSize = () => {
        setIsSmallScreen(windowCurrent.innerWidth <= 900);
      };

      checkScreenSize();
      windowCurrent.addEventListener("resize", checkScreenSize);
      return () => windowCurrent.removeEventListener("resize", checkScreenSize);
    }
  }, []);

  return (
    <TooltipProvider>
      <div className={isSmallScreen ? "bbar-container" : "sidebar-container"}>
        <div className="relative">
          <ReactionPopup
            postRef={postRef}
            isListView={false}
            isSmallScreen={isSmallScreen}
          />
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <button className="bar-b">
              <MessageCircleIcon className="bar-i" />
              <span className="text-md ">{post.commentCount}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Comments</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button className="bar-b" onClick={() => setSaved(!saved)}>
              <BookmarkIcon className={`bar-i ${saved ? "fill-black" : ""}`} />
              <span className="text-md ">{post.saveCount}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save</p>
          </TooltipContent>
        </Tooltip>

        {isAuthor && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/admin/${post.slug}`}>
                <button className="bar-b">
                  <PencilIcon className="bar-i" />
                </button>
              </Link>
            </TooltipTrigger>
            <TooltipContent></TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
