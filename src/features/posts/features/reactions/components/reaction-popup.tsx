"use client";

import { ReactionType } from "@prisma/client";
import { Heart } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCurrentUserId } from "@/hooks/auth";
import { cn } from "@/lib/utils";
import { reactionsList } from "../constants";
import { useReactions } from "../hooks";

type ReactionPopupProps = {
    postId: string;
    isListView?: boolean;
    isSmallScreen?: boolean;
};

const ReactionPopup = ({
    postId,
    isListView = true,
    isSmallScreen = true,
}: ReactionPopupProps) => {
    const userId = useCurrentUserId();
    const [isHovering, setIsHovering] = useState(false);
    const { reactions, loadReactions, handleReactionToggle } = useReactions(
        postId,
        userId,
    );

    const uniqueReactionTypes = useMemo(
        () => Array.from(new Set(reactions.map((r) => r.type))),
        [reactions],
    );

    const reactionCounts = useMemo(() => {
        return reactions.reduce(
            (acc, reaction) => {
                acc[reaction.type] = (acc[reaction.type] || 0) + 1;
                return acc;
            },
            {} as Record<ReactionType, number>,
        );
    }, [reactions]);

    return (
        <Popover
            open={isHovering}
            onOpenChange={(open) => {
                setIsHovering(open);
                if (open) {
                    loadReactions();
                }
            }}
        >
            <PopoverTrigger asChild>
                <button
                    className="bar-b"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    {reactions.length > 0 && isListView ? (
                        <>
                            <div className="flex -space-x-1">
                                {uniqueReactionTypes.map((type) => (
                                    <span
                                        key={`emoji-${type}`}
                                        className="text-sm"
                                    >
                                        {
                                            reactionsList.find(
                                                (r) => r.type === type,
                                            )?.emoji
                                        }{" "}
                                    </span>
                                ))}
                            </div>
                            <span className="text-sm">{reactions.length}</span>
                        </>
                    ) : (
                        <>
                            <Heart className="flex size-4 self-center" />
                            <span className="text-sm">{reactions.length}</span>
                        </>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent
                className="w-full p-2"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                align={isSmallScreen ? "start" : "center"}
                side={isSmallScreen ? "bottom" : "right"}
                sideOffset={-1}
            >
                <div className="grid grid-cols-4 gap-2">
                    {reactionsList.map(({ type, emoji }) => {
                        const isReacted = reactions.some(
                            (r) => r.type === type && r.userId === userId,
                        );
                        return (
                            <Tooltip key={`popover-${type}`}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={cn(
                                            "flex h-auto flex-col items-center p-2",
                                            isReacted
                                                ? "bg-neutral-100 border-b-gray-500 border-b-2"
                                                : "bg-transparent border-none",
                                        )}
                                        onClick={() =>
                                            handleReactionToggle(type)
                                        }
                                    >
                                        <span className="mb-1 text-xl">
                                            {emoji}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {reactionCounts[type] || 0}
                                        </span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                    <p className="capitalize">{type}</p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default ReactionPopup;
