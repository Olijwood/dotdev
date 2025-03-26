"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { uploadImage, deleteImage, uploadProfileImage } from "@/server/actions";
import { updateUserProfilePic } from "@/server/db/user";

export function useImageUpload(initialUrl: string = "") {
    const [imageUrl, setImageUrl] = useState<string | null>(initialUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setImageUrl(initialUrl);
    }, [initialUrl]);

    const handleUpload = async (userId?: string, postId?: string) => {
        if (!fileInputRef.current?.files?.[0]) return;
        const file = fileInputRef.current.files[0];

        if (file.size > 2 * 1024 * 1024) {
            toast.error("File too large. Please upload a smaller image.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        if (userId) formData.append("userId", userId);
        if (postId) formData.append("postId", postId);

        try {
            if (imageUrl) {
                const response = await deleteImage(imageUrl);
                if (response.error) toast.error(response.error);
            }

            const result = await uploadImage(formData);
            if (result.error) throw new Error(result.error);
            if (!result.imageUrl) throw new Error("No image URL returned.");

            setImageUrl(result.imageUrl);
            toast.success("Image uploaded successfully!");
            return result.imageUrl;
        } catch (error) {
            toast.error("Upload failed. Please try again.");
            console.error("Image upload failed:", error);
            return null;
        }
    };

    const handleRemove = async () => {
        if (!imageUrl) return;
        await deleteImage(imageUrl);
        setImageUrl(null);
        toast.success("Image removed successfully.");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return {
        imageUrl,
        fileInputRef,
        handleUpload,
        handleRemove,
    };
}

export function useProfileImageUpload() {
    const [imageUrl, setImageUrl] = useState<string | null>();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async () => {
        if (!fileInputRef.current?.files?.[0]) return;
        const file = fileInputRef.current.files[0];

        if (file.size > 2 * 1024 * 1024) {
            toast.error("File too large. Please upload a smaller image.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await uploadProfileImage(formData);
            if (result.error) throw new Error(result.error);
            if (!result.imageUrl) throw new Error("No image URL returned.");
            const dbResult = await updateUserProfilePic(result.imageUrl);
            if (dbResult.error) {
                throw new Error(dbResult.message);
            }

            setImageUrl(result.imageUrl);

            toast.success("Image uploaded successfully!");
            return result.imageUrl;
        } catch {
            toast.error("Upload failed. Please try again.");
            return null;
        }
    };

    const handleRemove = async () => {
        if (!imageUrl) return;
        await deleteImage(imageUrl);
        setImageUrl(null);
        toast.success("Image removed successfully.");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return {
        imageUrl,
        fileInputRef,
        handleUpload,
        handleRemove,
    };
}
