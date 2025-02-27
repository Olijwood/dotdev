"use client";

import { useCallback, useEffect, useState } from "react";
import { getComments } from "../server/db";
import { CommentType } from "../types";

export const useComments = (postId: string) => {
    const [comments, setComments] = useState<CommentType[]>([]);

    const loadComments = useCallback(async () => {
        const data = await getComments(postId);
        setComments(data);
    }, [postId]);

    useEffect(() => {
        loadComments();
    }, [loadComments]);

    const handleNewComment = (comment: CommentType) => {
        setComments((prev) => [comment, ...prev]);
    };

    return {
        comments,
        handleNewComment,
    };
};
