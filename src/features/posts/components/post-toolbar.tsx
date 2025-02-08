"use client";

import { MessageCircleIcon, BookmarkIcon, PencilIcon } from "lucide-react";
import Link from "next/link";
import { HTMLAttributes, useState } from "react";
import { Toolbar } from "@/components/ui/toolbar";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import ReactionPopup from "../features/reactions/components/reaction-popup";

type PostToolbarProps = HTMLAttributes<HTMLDivElement> & {
    postId: string;
    isMobile?: boolean;
    isAuthor?: boolean;
};

export const PostToolbar = ({
    postId,
    isMobile = false,
    isAuthor = true,
}: PostToolbarProps) => {
    const [saved, setSaved] = useState(false);
    const post = {
        likeCount: 5,
        commentCount: 1,
        saveCount: 2,
        slug: "restful-api-design",
    };

    const handleSaveToggle = () => {
        setSaved((prev) => !prev);
    };
    return (
        <Toolbar isMobile={isMobile}>
            <div className="bar-b ">
                <ReactionPopup
                    postId={postId}
                    isMobile={isMobile}
                    isDetailView={true}
                />
            </div>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button className="bar-b">
                        <MessageCircleIcon className="bar-i" />
                        <span className="text-lg ">{post.commentCount}</span>
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Comments</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button className="bar-b" onClick={handleSaveToggle}>
                        <BookmarkIcon
                            className={cn("bar-i", saved && "fill-black")}
                        />
                        <span className="text-lg ">{post.saveCount}</span>
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Save</p>
                </TooltipContent>
            </Tooltip>
            {isAuthor && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href={`/admin/${post.slug}/edit`}
                            className="bar-b"
                        >
                            <button>
                                <PencilIcon className="bar-i" />
                            </button>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Edit</p>
                    </TooltipContent>
                </Tooltip>
            )}
        </Toolbar>
    );
};
