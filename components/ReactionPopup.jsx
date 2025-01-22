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

    useEffect(() => {
        if (!postRef) return;

        const unsubscribe = onSnapshot(postRef, (document) => {
            const data = document.data();
            setReactions(data?.reactions || {});
            setReactionCount(data?.reactionCount || 0);

            const user = auth.currentUser;
            if (!user || !postRef.path) return;

            const reactionsDocRef = doc(
                firestore,
                postRef.path,
                "reactions",
                user.uid
            );
            getDoc(reactionsDocRef)
                .then((reactionsDocSnap) => {
                    if (reactionsDocSnap.exists()) {
                        setHasHearted(
                            reactionsDocSnap.data().reactions?.heart || false
                        );
                        setUserReactions(
                            reactionsDocSnap.data().reactions || {}
                        );
                    }
                })
                .catch(console.error);
        });

        return () => unsubscribe();
    }, [postRef]);

    const toggleReaction = useCallback(
        async (reactionType) => {
            const user = auth.currentUser;
            if (!user) return;

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

            const batch = writeBatch(firestore);
            batch.set(
                reactionDocRef,
                {
                    reactions: {
                        ...currentReactions,
                        [reactionType]: !isReacted,
                    },
                },
                { merge: true }
            );
            batch.update(postRef, {
                [`reactions.${reactionType}`]: increment(isReacted ? -1 : 1),
                reactionCount: increment(isReacted ? -1 : 1),
            });

            await batch.commit().catch(console.error);
        },
        [postRef]
    );

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
                            <div className="flex -space-x-1">
                                {Object.entries(reactions)
                                    .filter(([_, count]) => count > 0)
                                    .map(([type]) => (
                                        <span key={type} className="text-sm">
                                            {
                                                reactionsList.find(
                                                    (r) => r.type === type
                                                )?.emoji
                                            }{" "}
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
                                        ? "w-4 h-4 flex self-center"
                                        : hasHearted
                                        ? "bar-i fill-red-500"
                                        : "bar-i"
                                }
                            />
                            <span
                                className={isListView ? "text-sm" : "text-md"}
                            >
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
                sideOffset={10}
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
                                    className={`flex flex-col items-center p-2 h-auto ${
                                        userReactions[type]
                                            ? "bg-neutral-100 border-b-gray-500 border-b-2"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        toggleReaction(type);
                                    }}
                                >
                                    <span className="text-xl mb-1">
                                        {emoji}
                                    </span>
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
