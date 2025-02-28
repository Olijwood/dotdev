"use client";

import { MessageCircleIcon, BookmarkIcon, PencilIcon } from "lucide-react";
import { HTMLAttributes, useState } from "react";
import { Toolbar } from "@/components/ui/toolbar";
import ReactionPopup from "@/features/posts/features/reactions/components/reaction-popup";
import { PostToolbarItem, PostToolbarItemProps } from "./toolbar-item";

type PostToolbarProps = HTMLAttributes<HTMLDivElement> & {
    postId: string;
    slug: string;
    counts: {
        commentCount: number;
        saveCount: number;
    };
    isMobile?: boolean;
    isAuthor?: boolean;
};

export const PostToolbar = ({
    postId,
    slug,
    counts,
    isMobile = false,
    isAuthor = false,
}: PostToolbarProps) => {
    const [saved, setSaved] = useState(false);
    const { commentCount, saveCount } = counts;
    const handleSaveToggle = () => {
        setSaved((prev) => !prev);
    };

    const postToolbarItems: PostToolbarItemProps[] = [
        {
            Icon: MessageCircleIcon,
            text: commentCount.toString(),
            tooltipText: "Comments",
        },
        {
            Icon: BookmarkIcon,
            text: saveCount.toString(),
            tooltipText: "Save",
            handleClick: handleSaveToggle,
            iconClassName: saved ? "fill-black" : "",
        },
    ];
    if (isAuthor) {
        postToolbarItems.push({
            Icon: PencilIcon,
            tooltipText: "Edit",
            href: `/update-post/${slug}`,
        });
    }
    return (
        <Toolbar
            isMobile={isMobile}
            className="sm:w-20 sm:border sm:border-gray-300"
        >
            <div className="bar-b">
                <ReactionPopup
                    postId={postId}
                    isMobile={isMobile}
                    isDetailView={true}
                />
            </div>
            {postToolbarItems.map((item, index) => (
                <PostToolbarItem key={index} {...item} />
            ))}
        </Toolbar>
    );
};
