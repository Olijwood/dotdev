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
import ReactionPopup from "../features/reactions/components/reaction-popup";

type PostActionsProps = {
    postId: string;
    slug: string;
    commentCount?: number;
    minutesToRead?: number;
    isAdmin?: boolean;
};

const PostActions = ({
    postId = "jdisand",
    slug,
    commentCount = 0,
    minutesToRead = 0,
    isAdmin = false,
}: PostActionsProps) => {
    const [saved, setSaved] = useState(false);
    const isAuthor = true;

    return (
        <TooltipProvider>
            <div className="flex items-center gap-2 border-t p-2">
                <ReactionPopup postId={postId} />

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

                <div className="ml-auto flex items-center">
                    {minutesToRead && !isAdmin
                        ? minutesToRead > 0 && (
                              <span className="text-sm text-muted-foreground">
                                  {minutesToRead} min read
                              </span>
                          )
                        : ""}

                    {isAdmin ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm">
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
                                <Link href={`/admin/${slug}`}>
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
                                onClick={() => setSaved(!saved)}
                                className="flex items-center gap-1"
                            >
                                <BookmarkIcon
                                    className={cn(
                                        "size-4 fill-none hover:fill-gray-900",
                                        saved ? "fill-black" : "",
                                    )}
                                />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{saved ? "Saved" : "Save"}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </TooltipProvider>
    );
};

export { PostActions };
