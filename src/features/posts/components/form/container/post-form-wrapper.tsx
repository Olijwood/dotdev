"use client";

import { ReactNode } from "react";
import { PostPreview, PostPreviewProps } from "..";
import { PostFormCard } from "./post-form-card";

type PostFormWrapperProps = {
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    isPreview: boolean;
    previewProps: PostPreviewProps;
    children: ReactNode;
};

export const PostFormWrapper = ({
    onSubmit,
    isPreview,
    previewProps,
    children,
}: PostFormWrapperProps) => {
    const { title, content, bannerImgUrl } = previewProps;
    return (
        <PostFormCard>
            {!isPreview ? (
                <form
                    onSubmit={onSubmit}
                    className="flex min-h-full w-full flex-1 flex-col"
                >
                    {children}
                </form>
            ) : (
                <PostPreview
                    title={title}
                    content={content}
                    bannerImgUrl={bannerImgUrl}
                />
            )}
        </PostFormCard>
    );
};
