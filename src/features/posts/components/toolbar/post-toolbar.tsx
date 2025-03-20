"use client";

import { ReactionType } from "@prisma/client";
import {
    MessageCircleIcon,
    BookmarkIcon,
    PencilIcon,
    HeartIcon,
} from "lucide-react";
import { HTMLAttributes, useState } from "react";
import { Toolbar } from "@/components/ui/toolbar/toolbar";
import ReactionPopup from "@/features/posts/features/reactions/components/reaction-popup";
import { toggleSavePostAction } from "@/features/posts/server/actions";
import {
    PostToolbarItem,
    PostToolbarItemProps,
    PostToolbarItemSkeleton,
    PostToolbarItemSkeletonProps,
} from "./toolbar-item";

type PostToolbarProps = HTMLAttributes<HTMLDivElement> & {
    postId: string;
    slug: string;
    reactionCounts?: Partial<Record<ReactionType, number>>;
    saveCount: number;
    commentCount: number;
    isMobile?: boolean;
    isAuthor?: boolean;
    isSaved?: boolean;
};

export const PostToolbar = ({
    postId,
    slug,
    saveCount,
    commentCount,
    isMobile = false,
    isAuthor = false,
    isSaved: initialIsSaved = false,
}: PostToolbarProps) => {
    const [isSaved, setIsSaved] = useState(initialIsSaved);
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveToggle = async () => {
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

    const postToolbarItems: PostToolbarItemProps[] = [
        {
            Icon: MessageCircleIcon,
            text: commentCount.toString(),
            tooltipText: "Comments",
        },
        {
            Icon: BookmarkIcon,
            tooltipText: isSaved ? "Saved" : "Save",
            handleClick: handleSaveToggle,
            iconClassName: isSaved ? "fill-black" : "",
            text: saveCount.toString(),
            disabled: isSaving,
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
                <ReactionPopup postId={postId} isDetailView={true} />
            </div>
            {postToolbarItems.map((item, index) => (
                <PostToolbarItem key={index} {...item} />
            ))}
        </Toolbar>
    );
};

export const PostToolbarSkeleton = ({ isMobile }: { isMobile?: boolean }) => {
    const postToolbarItems: PostToolbarItemSkeletonProps[] = [
        {
            Icon: HeartIcon,
            text: "0",
        },
        {
            Icon: MessageCircleIcon,
            text: "0",
        },
        {
            Icon: BookmarkIcon,
            text: "0",
        },
    ];
    return (
        <Toolbar
            isMobile={isMobile}
            className="sm:w-20 sm:border sm:border-gray-300"
        >
            {postToolbarItems.map((item, index) => (
                <PostToolbarItemSkeleton key={index} {...item} />
            ))}
        </Toolbar>
    );
};
