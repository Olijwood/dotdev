"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LikesBtnProps = {
    nLikes: number;
    userLiked: boolean;
    handleClick: () => void;
};

export const LikesBtn = ({ nLikes, userLiked, handleClick }: LikesBtnProps) => {
    return (
        <Button
            variant="ghost"
            type="button"
            size="sm"
            className={cn("flex items-center gap-1 ", userLiked && "bg-red-50")}
            onClick={handleClick}
        >
            <Heart
                className={cn(
                    "size-4",
                    userLiked && "fill-current text-red-500",
                )}
            />
            <span className="text-gray-500">{nLikes}</span>
        </Button>
    );
};
