"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToggleFollow } from "../../hooks";

type FollowButtonProps = {
    followingId: string;
    className?: string;
};

export function FollowButton({ followingId, className }: FollowButtonProps) {
    const { isFollowing, isPending, handleToggleFollow } =
        useToggleFollow(followingId);
    return (
        <Button
            onClick={handleToggleFollow}
            disabled={isPending}
            className={cn(
                "w-full hover:bg-opacity-80 ",
                className,
                isFollowing ? "bg-blue-600 hover:bg-blue-700" : "",
            )}
        >
            {isFollowing ? "Following" : "Follow"}
        </Button>
    );
}
