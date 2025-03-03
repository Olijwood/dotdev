"use client";

import { useState, useCallback } from "react";
import { toggleSavePostAction } from "../server/actions";
import { isPostSaved } from "../server/db";

export function useSavePost(postId: string) {
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState<boolean | null>(null);

    const checkSavedStatus = useCallback(async () => {
        try {
            const saved = await isPostSaved(postId);
            setIsSaved(saved);
        } catch (error) {
            console.error("Error checking saved status:", error);
        }
    }, [postId]);

    const toggleSave = async () => {
        if (isSaving) return;

        try {
            setIsSaving(true);
            const result = await toggleSavePostAction(postId);
            setIsSaved(result.saved);
        } catch (error) {
            console.error("Error toggling saved post:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return {
        isSaved,
        isSaving,
        toggleSave,
        checkSavedStatus,
    };
}
