"use client";

import { ReactionType } from "@prisma/client";
import { redirect } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { REACT_PLEASE_LOGIN_WARN } from "@/features/auth/constants";
import { getReactionsByPost, toggleReaction } from "../server/db";
import { UserReaction } from "../types";

export const useReactions = (
    postId: string,
    userId: string | null | undefined,
) => {
    const [reactions, setReactions] = useState<UserReaction[]>([]);
    const [, startTransition] = useTransition();

    const loadReactions = useCallback(async () => {
        const data = await getReactionsByPost(postId);
        setReactions(data);
    }, [postId]);

    useEffect(() => {
        loadReactions();
    }, [loadReactions]);

    const handleReactionToggle = useCallback(
        async (type: ReactionType) => {
            if (!userId) {
                redirect(
                    `/login?warning=${REACT_PLEASE_LOGIN_WARN.URL_QUERY_PARAM}`,
                );
            }

            if (!Object.values(ReactionType).includes(type)) {
                console.error("Invalid reaction type:", type);
                return;
            }

            startTransition(async () => {
                try {
                    console.log("userId:", userId);
                    if (!userId) {
                        console.error("User ID required.");
                        redirect("/login");
                    }
                    const result = await toggleReaction(postId, userId, type);
                    if (result.added) {
                        setReactions((prev) => [
                            ...prev,
                            { postId, userId, type },
                        ]);
                    } else {
                        setReactions((prev) =>
                            prev.filter(
                                (r) =>
                                    !(r.type === type && r.userId === userId),
                            ),
                        );
                    }
                } catch (error) {
                    console.error("Error toggling reaction:", error);
                }
            });
        },
        [userId, postId],
    );

    return {
        reactions,
        loadReactions,
        handleReactionToggle,
        userId,
    };
};
