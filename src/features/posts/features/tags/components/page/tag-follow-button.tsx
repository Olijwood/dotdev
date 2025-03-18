"use client";

import { useTagToggleFollow } from "@/features/posts/hooks";
import { cn } from "@/lib/utils";

type TagFollowButtonProps = {
    tagId: string;
    className?: string;
};

export function TagFollowButton({ tagId, className }: TagFollowButtonProps) {
    const { isFollowing, isPending, handleToggleFollow } =
        useTagToggleFollow(tagId);
    return (
        <button
            onClick={handleToggleFollow}
            disabled={isPending}
            className={cn(
                "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium w-[105px] hover:bg-opacity-80 ",
                className,
            )}
        >
            {isFollowing ? "Following" : "Follow"}
        </button>
    );
}
