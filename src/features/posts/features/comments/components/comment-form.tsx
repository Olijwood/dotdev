"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCurrentUserInfo } from "@/hooks/auth";
import { cn } from "@/lib/utils";
import { MarkdownToolbar, RenderMarkdown } from "../../markdown";
import { addComment } from "../server/db";
import type { CommentType } from "../types";
import { CommentUserImg } from "./ui/comment-user";

type CommentFormProps = {
    postId: string;
    onNewComment: (comment: CommentType) => void;
};

export const CommentForm = ({ postId, onNewComment }: CommentFormProps) => {
    const [content, setContent] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const { username, image } = useCurrentUserInfo();

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        const newComment = await addComment(postId, content);
        onNewComment(newComment);
        setContent("");
    };

    const updateTextareaHeight = useCallback(() => {
        if (textareaRef.current) {
            const textarea = textareaRef.current;

            // Reset height to get proper scrollHeight
            textarea.style.height = hasInteracted ? "127px" : "72px";

            // If content exceeds initial height, grow up to max height
            if (hasInteracted && textarea.scrollHeight > 127) {
                textarea.style.height = `${Math.min(textarea.scrollHeight, 370)}px`;
            }
        }
    }, [hasInteracted]);

    // Update height on content change
    useEffect(() => {
        updateTextareaHeight();
    }, [updateTextareaHeight]);

    return (
        <div className="flex gap-4 ">
            <CommentUserImg src={image} username={username} />

            <div className="flex-1">
                <form onSubmit={handleSubmit}>
                    <div
                        className={`rounded-lg border transition-all duration-200 ${isFocused ? "border-primary" : "border-input"}`}
                    >
                        {isPreview ? (
                            <div
                                className={cn(
                                    "scrollbar-y prose prose-sm max-w-none px-3 py-0",
                                    hasInteracted
                                        ? "max-h-[370px] min-h-[127px]"
                                        : "h-[72px]",
                                )}
                            >
                                <RenderMarkdown
                                    content={content || "Nothing to preview!"}
                                />
                            </div>
                        ) : (
                            <>
                                <textarea
                                    ref={textareaRef}
                                    className="scrollbar-thin w-full resize-none rounded-lg px-3 py-2 focus:outline-none"
                                    placeholder="Add to the discussion"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    onFocus={() => {
                                        setIsFocused(true);
                                        if (!hasInteracted)
                                            setHasInteracted(true);
                                    }}
                                    onBlur={() => setIsFocused(false)}
                                    style={{
                                        minHeight: hasInteracted
                                            ? "127px"
                                            : "72px",
                                        maxHeight: "370px",
                                    }}
                                />
                                {hasInteracted && (
                                    <MarkdownToolbar
                                        textareaRef={textareaRef}
                                        content={content}
                                        setContent={setContent}
                                        className="border-b-0 border-t"
                                    />
                                )}
                            </>
                        )}
                    </div>
                    {hasInteracted && (
                        <div className="mt-4 flex gap-2">
                            <Button
                                type="submit"
                                className="bg-[#3B49DF] hover:bg-[#2F3AB2] hover:text-white"
                            >
                                Submit
                            </Button>
                            <Button
                                variant="secondary"
                                type="button"
                                onClick={() => setIsPreview(!isPreview)}
                                className="hover:bg-gray-200"
                            >
                                {isPreview ? "Continue editing" : "Preview"}
                            </Button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};
