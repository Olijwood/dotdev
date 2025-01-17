import { useState, useEffect, useCallback } from "react";
import { firestore, auth } from "@/lib/firebase";
import {
  increment,
  doc,
  getDoc,
  writeBatch,
  onSnapshot,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { set } from "react-hook-form";

const reactionsList = [
  { type: "heart", emoji: "❤️" },
  { type: "clap", emoji: "👏" },
  { type: "fire", emoji: "🔥" },
  { type: "thumbs up", emoji: "👍" },
];

export default function ReactionPopup({
  postRef,
  isListView = true,
  isSmallScreen = true,
}) {
  const [isHovering, setIsHovering] = useState(false);
  const [reactions, setReactions] = useState({});
  const [reactionCount, setReactionCount] = useState(0);
  const [hasHearted, setHasHearted] = useState(false);
  const [userReactions, setUserReactions] = useState({});
  // Fetch reactions in real-time
  useEffect(() => {
    if (!postRef) return;
    const unsubscribe = onSnapshot(postRef, async (document) => {
      const data = document.data();
      const reactionsData = data?.reactions || {};
      const reactionsCount = data?.reactionsCount || 0;

      const user = auth.currentUser;
      const reactionDocRef = doc(
        firestore,
        postRef.path,
        "reactions",
        user.uid
      );

      const reactionDocSnap = await getDoc(reactionDocRef);
      if (reactionDocSnap.exists()) {
        setHasHearted(reactionDocSnap.data().reactions?.heart || false);
        setUserReactions(reactionDocSnap.data().reactions || {});
      } // Set hasHearted based on the reaction document reactionDocSnap.data() : {});
      setReactions(reactionsData);
      setReactionCount(reactionsCount);
    });

    return unsubscribe;
  }, [postRef]);

  const toggleReaction = async (reactionType) => {
    const user = auth.currentUser;
    if (!user) {
      return; // Redirect if user is not authenticated
    }
    const batch = writeBatch(firestore);

    try {
      const reactionDocRef = doc(
        firestore,
        postRef.path,
        "reactions",
        user.uid
      );

      const reactionDocSnap = await getDoc(reactionDocRef);
      const currentReactions = reactionDocSnap.exists()
        ? reactionDocSnap.data().reactions || {}
        : {};

      const isReacted = currentReactions[reactionType] === true;

      const updatedReactions = {
        ...currentReactions,
        [reactionType]: !isReacted,
      };
      batch.set(
        reactionDocRef,
        {
          reactions: updatedReactions,
        },
        { merge: true }
      );

      const reactionIncrement = isReacted ? -1 : 1;
      batch.update(postRef, {
        [`reactions.${reactionType}`]: increment(reactionIncrement),
        reactionsCount: increment(reactionIncrement),
      });

      await batch.commit();
    } catch (error) {
      console.error("Error updating reactions:", error);
    }
  };

  return (
    <Popover open={isHovering} onOpenChange={setIsHovering}>
      <PopoverTrigger asChild>
        <button
          className="bar-b"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {reactionCount > 0 && isListView ? (
            <>
              <div className="flex -space-x-1 ">
                {Object.entries(reactions)
                  .filter(([_, count]) => count > 0)
                  .map(([type, count]) => (
                    <span key={type} className="text-sm">
                      {reactionsList.find((r) => r.type === type)?.emoji}{" "}
                    </span>
                  ))}
              </div>
              <span className="text-sm">{reactionCount}</span>
            </>
          ) : (
            <>
              <Heart
                className={
                  isListView
                    ? "w-4 h-4 flex"
                    : hasHearted
                    ? "bar-i fill-red-500"
                    : "bar-i"
                }
              />
              <span className={isListView ? "text-sm" : "text-md"}>
                {reactionCount}
              </span>
            </>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-2"
        align={isSmallScreen ? "start" : "center"}
        side={isSmallScreen ? "bottom" : "right"}
        sideOffset={isSmallScreen ? 8 : 8}
        alignOffset={isSmallScreen ? 0 : 8}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="grid grid-cols-4 gap-2">
          {reactionsList.map(({ type, emoji }) => (
            <Tooltip key={type}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={
                    userReactions?.[type]
                      ? "flex flex-col items-center p-2 h-auto bg-neutral-100 border-b-gray-500 border-b-2"
                      : "flex flex-col items-center p-2 h-auto"
                  }
                  onClick={() => {
                    toggleReaction(type);
                    // setIsHovering(false);
                  }}
                >
                  <span className="text-xl mb-1">{emoji}</span>
                  <span className="text-xs text-muted-foreground">
                    {reactions[type] || 0}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="capitalize">{type}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
