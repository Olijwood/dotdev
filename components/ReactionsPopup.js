import { useState, useEffect } from "react";
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

const reactionsList = [
  { type: "heart", emoji: "❤️" },
  { type: "clap", emoji: "👏" },
  { type: "fire", emoji: "🔥" },
  { type: "thumbs up", emoji: "👍" },
];

export default function ReactionsPopup({ postRef }) {
  const [isHovering, setIsHovering] = useState(false);
  const [reactions, setReactions] = useState({});
  const [reactionCount, setReactionCount] = useState(0);

  // Fetch reactions in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(postRef, (doc) => {
      const data = doc.data();
      const reactionsData = data?.reactions || {};
      // Calculate'total reactions
      //   const totalReactions = Object.values(reactionsData).reduce(
      //     (sum, count) => sum + count,
      //     0
      //   );
      const reactionsCount = data?.reactionsCount || 0;

      setReactions(reactionsData);
      setReactionCount(reactionsCount);
    });

    return () => unsubscribe();
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
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={() => {
            toggleReaction("heart");
          }}
        >
          {reactionCount > 0 ? (
            <>
              <div className="flex -space-x-1">
                {Object.entries(reactions)
                  .filter(([_, count]) => count > 0)
                  .map(([type, count]) => (
                    <span key={type} className="text-sm">
                      {reactionsList.find((r) => r.type === type)?.emoji}{" "}
                    </span>
                  ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {reactionCount}
              </span>
            </>
          ) : (
            <Heart className="h-4 w-4" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-2"
        align="start"
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
                  className="flex flex-col items-center p-2 h-auto"
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
