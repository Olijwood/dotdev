"use client";

import { useEffect, useState, useTransition } from "react";
import {
    checkIsFollowing,
    tagCheckIsFollowing,
    toggleFollowAction,
    toggleTagFollowAction,
} from "../server/db/follow";

export function useToggleFollow(followingId: string) {
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const fetchFollowStatus = async () => {
            try {
                const following = await checkIsFollowing(followingId);
                setIsFollowing(following);
            } catch (error) {
                console.error("Error checking following status:", error);
            }
        };

        fetchFollowStatus();
    }, [followingId]);

    const handleToggleFollow = () => {
        const previousState = isFollowing;
        setIsFollowing(!isFollowing);

        startTransition(async () => {
            try {
                const result = await toggleFollowAction(followingId);

                if (result.error) {
                    setIsFollowing(previousState);
                } else {
                    if (result.following) {
                        setIsFollowing(result.following);
                    }
                }
            } catch (error) {
                console.error("Hook Error toggling follow:", error);
                setIsFollowing(previousState);
            }
        });
    };

    return {
        isFollowing,
        isPending,
        handleToggleFollow,
    };
}

export function useTagToggleFollow(tagId: string) {
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const fetchFollowStatus = async () => {
            try {
                const following = await tagCheckIsFollowing(tagId);
                setIsFollowing(following);
            } catch (error) {
                console.error("Error checking following status:", error);
            }
        };

        fetchFollowStatus();
    }, [tagId]);

    const handleToggleFollow = () => {
        const previousState = isFollowing;
        setIsFollowing(!isFollowing);

        startTransition(async () => {
            try {
                const result = await toggleTagFollowAction(tagId);

                if (result.error) {
                    setIsFollowing(previousState);
                } else {
                    if (result.following) {
                        setIsFollowing(result.following);
                    }
                }
            } catch (error) {
                console.error("Hook Error toggling follow:", error);
                setIsFollowing(previousState);
            }
        });
    };

    return {
        isFollowing,
        isPending,
        handleToggleFollow,
    };
}
