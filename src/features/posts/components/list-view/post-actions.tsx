"use client";

import {
    BookmarkIcon,
    MessageCircle,
    PencilIcon,
    Trash2Icon,
} from "lucide-react";
import Link from "next/link";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import ReactionPopup from "../../features/reactions/components/reaction-popup";
import { useDeletePost } from "../../hooks";
import { toggleSavePostAction } from "../../server/actions";

type PostActionsProps = {
    postId: string;
    slug: string;
    commentCount?: number;
    minutesToRead?: number;
    isAuthor?: boolean;
    isSaved?: boolean;
};

const PostActions = ({
    postId,
    slug,
    commentCount = 0,
    minutesToRead = 0,
    isAuthor = false,
    isSaved: initialIsSaved = false,
}: PostActionsProps) => {
    const [isSaved, setIsSaved] = useState(initialIsSaved);
    const [isSaving, setIsSaving] = useState(false);
    const { modal, openModal } = useDeletePost(postId);

    const handleToggleSave = async () => {
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

    return (
        <TooltipProvider>
            <div className="flex items-center gap-2 border-t p-2 pl-4">
                <ReactionPopup postId={postId} isDetailView={false} />

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <MessageCircle className="size-4" />
                            <span className="text-sm text-muted-foreground">
                                {commentCount}
                            </span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Comments</p>
                    </TooltipContent>
                </Tooltip>

                <div className="ml-auto flex  items-center">
                    {minutesToRead && !isAuthor
                        ? minutesToRead > 0 && (
                              <span className="pt-0.5 text-xs text-muted-foreground">
                                  {minutesToRead} min read
                              </span>
                          )
                        : ""}

                    {isAuthor ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={openModal}
                                    aria-label="Delete post"
                                >
                                    <Trash2Icon className="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Delete</p>
                            </TooltipContent>
                        </Tooltip>
                    ) : null}

                    {isAuthor ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href={`/update-post/${slug}`}
                                    aria-label="Update post"
                                >
                                    <Button variant="ghost" size="sm">
                                        <PencilIcon className="size-4" />
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Edit</p>
                            </TooltipContent>
                        </Tooltip>
                    ) : null}

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleToggleSave}
                                disabled={isSaving}
                                className="flex items-center gap-1"
                            >
                                <BookmarkIcon
                                    className={cn(
                                        "size-4 fill-none hover:fill-gray-900",
                                        isSaved ? "fill-black" : "",
                                    )}
                                />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{isSaved ? "Saved" : "Save"}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
            {modal}
        </TooltipProvider>
    );
};

export { PostActions };
