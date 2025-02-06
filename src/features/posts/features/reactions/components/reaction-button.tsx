"use client";

import { ReactionType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type ReactionButtonProps = {
    type: ReactionType;
    emoji: string;
    isReacted: boolean;
    reactionCount: number;
    handleClick: () => void;
};

export const ReactionButton = ({
    type,
    emoji,
    isReacted,
    reactionCount,
    handleClick,
}: ReactionButtonProps) => (
    <Tooltip key={`popover-${type}`}>
        <TooltipTrigger asChild>
            <Button
                variant="ghost"
                size="sm"
                className={cn(
                    "flex h-auto flex-col items-center p-2 transition-all",
                    isReacted
                        ? "bg-neutral-100 border-b-gray-500 border-b-2"
                        : "bg-transparent border-none",
                )}
                onClick={handleClick}
            >
                <span className="mb-1 text-xl">{emoji}</span>
                <span className="text-xs text-muted-foreground">
                    {reactionCount}
                </span>
            </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
            <p className="capitalize">{type}</p>
        </TooltipContent>
    </Tooltip>
);
