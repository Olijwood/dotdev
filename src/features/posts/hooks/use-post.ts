"use client";

import { Post } from "@prisma/client";
import { useCallback, useEffect, useState, useTransition } from "react";
import { getPostBySlug } from "../server/db";

export const usePost = (slug: string) => {
    const [post, setPost] = useState<Post | null>(null);
    const [, startTransition] = useTransition();

    const loadPost = useCallback(async () => {
        startTransition(async () => {
            try {
                const data = await getPostBySlug(slug);
                setPost(data);
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        });
    }, [slug]);

    useEffect(() => {
        loadPost();
    }, [loadPost]);

    return post;
};
