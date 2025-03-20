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
            className={cn("bg-blue-600 w-full hover:bg-blue-700 ", className)}
        >
            {isFollowing ? "Following" : "Follow"}
        </Button>
    );
}

export function FollowButtonSkeleton() {
    return (
        <Button
            disabled
            className="bg-blue-600 w-full hover:bg-blue-700 cursor-not-allowed"
        >
            Follow
        </Button>
    );
}
