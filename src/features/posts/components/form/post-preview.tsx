"use client";

import Image from "next/image";
import { RenderMarkdown } from "@/features/posts/features/markdown";

export type PostPreviewProps = {
    title: string;
    content: string | null | undefined;
    bannerImgUrl: string | null | undefined;
};

export const PostPreview = ({
    title,
    content,
    bannerImgUrl,
}: PostPreviewProps) => {
    return (
        <div className=" scrollbar-thin flex max-h-[calc(100vh-5rem)] min-h-full flex-1 flex-col gap-2  overflow-y-auto p-3 ">
            {bannerImgUrl && (
                <Image
                    src={bannerImgUrl}
                    alt="RESTful API Banner"
                    width={300}
                    height={150}
                    className="mx-auto mb-2 rounded-lg object-contain"
                    style={{ width: "auto", height: "auto" }}
                    priority
                />
            )}
            <h1 className="text-center text-5xl font-extrabold">{title}</h1>
            <RenderMarkdown content={content} />
        </div>
    );
};
