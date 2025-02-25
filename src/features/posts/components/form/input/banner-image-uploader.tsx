"use client";

import { ImagePlus, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useImageUpload } from "@/hooks";

type ImageUploaderProps = {
    userId?: string;
    postId?: string;
    onUploadSuccess: (url: string) => void;
    initialUrl?: string;
    label?: string;
};

export function ImageUploader({
    userId,
    postId,
    onUploadSuccess,
    initialUrl = "",
    label = "Add Image",
}: ImageUploaderProps) {
    const { imageUrl, fileInputRef, handleUpload, handleRemove } =
        useImageUpload(initialUrl);

    const handleImageUpload = async () => {
        const url = await handleUpload(userId, postId);
        if (url) onUploadSuccess(url);
    };

    return (
        <div className="flex items-center gap-4">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageUpload}
                accept="image/png, image/jpeg, image/gif"
            />

            {imageUrl && (
                <div className="relative">
                    <img
                        src={imageUrl}
                        alt="Preview"
                        className="h-16 w-28 rounded-md border border-gray-300 object-cover"
                    />
                    <button
                        type="button"
                        className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow-md"
                        onClick={handleRemove}
                    >
                        <XCircle className="size-4 text-red-500" />
                    </button>
                </div>
            )}

            <Button
                type="button"
                variant="outline"
                className="w-fit"
                onClick={() => fileInputRef.current?.click()}
            >
                <ImagePlus className="mr-2 size-4" />
                {imageUrl ? "Replace Image" : label}
            </Button>
        </div>
    );
}
