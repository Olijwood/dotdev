"use client";

import { getDateString } from "@/lib/utils";

type CommentMetadataProps = {
    username: string | null;
    createdAt: Date;
};

export const CommentMetadata = ({
    username,
    createdAt,
}: CommentMetadataProps) => {
    return (
        <div className="flex items-center gap-2">
            <span className="font-semibold">{username || "Guest"}</span>
            <span className="text-sm text-gray-500">
                {getDateString(createdAt)}
            </span>
        </div>
    );
};
