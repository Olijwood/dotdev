"use client";

import { ImageIcon, MoreHorizontal } from "lucide-react";
import { RefObject, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipTrigger,
    TooltipProvider,
    TooltipContent,
} from "@/components/ui/tooltip";
import { useImageUpload } from "@/hooks";
import { useCurrentUserId } from "@/hooks/auth";
import { cn } from "@/lib/utils";
import { markdownSyntax, insertMarkdown } from "./constants";

type MarkdownToolbarProps = {
    textareaRef: RefObject<HTMLTextAreaElement | null>;
    content: string;
    setContent: (string: string) => void;
    className?: string;
};

export function MarkdownToolbar({
    textareaRef,
    content,
    setContent,
    className = "",
}: MarkdownToolbarProps) {
    const userId = useCurrentUserId();
    const [overflowItems, setOverflowItems] = useState<string[]>([]);
    const { fileInputRef, handleUpload } = useImageUpload();

    const handleMarkdownAction = (syntax: string) => {
        if (!textareaRef) return;
        const textarea = textareaRef.current;
        if (!textarea) return;

        const { selectionStart, selectionEnd } = textarea;
        const { text, cursorPosition } = insertMarkdown(
            content,
            syntax,
            selectionStart,
            selectionEnd,
        );

        setContent(text);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(cursorPosition, cursorPosition);
        }, 0);
    };

    const handleImageUpload = async () => {
        const url = await handleUpload(userId);
        if (textareaRef.current) {
            const textarea = textareaRef.current;
            const { selectionStart, selectionEnd } = textarea;
            const markdownImage = `![](${url})`;

            // Insert markdown at cursor position
            const newText =
                content.substring(0, selectionStart) +
                markdownImage +
                content.substring(selectionEnd);

            setContent(newText);

            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(2, 2);
            }, 0);
        }
    };

    // Handle resizing to move buttons into dropdown if space is limited
    useEffect(() => {
        const handleResize = () => {
            const toolbar = document.getElementById("markdown-toolbar");
            if (!toolbar) return;

            const maxVisibleButtons = Math.floor(toolbar.clientWidth / 40);
            setOverflowItems(
                Object.keys(markdownSyntax).slice(maxVisibleButtons),
            );
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <TooltipProvider>
            <div
                id="markdown-toolbar"
                className={cn(
                    "flex items-center gap-1 border-b p-1",
                    className,
                )}
            >
                {Object.entries(markdownSyntax)
                    .filter(([label]) => !overflowItems.includes(label))
                    .map(([label, { icon, tooltip }]) => (
                        <Tooltip key={label}>
                            <TooltipTrigger asChild>
                                <Button
                                    key={label}
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="p-1"
                                    onClick={() => handleMarkdownAction(label)}
                                >
                                    {icon}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                side="bottom"
                                className="border border-gray-200 bg-gray-50"
                            >
                                <p className="text-xs text-black ">{tooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}

                {/* Image Upload Button */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="p-1"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <ImageIcon className="size-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent
                        side="bottom"
                        className="border border-gray-200 bg-gray-50"
                    >
                        <p className="text-xs text-black ">Insert Image</p>
                    </TooltipContent>
                </Tooltip>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/png, image/jpeg, image/gif"
                    className="hidden"
                />

                {overflowItems.length > 0 && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                type="button"
                                size="sm"
                                className="ml-auto p-1"
                            >
                                <MoreHorizontal className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {overflowItems.map((label) => (
                                <DropdownMenuItem
                                    key={label}
                                    onClick={() => handleMarkdownAction(label)}
                                >
                                    {markdownSyntax[label].icon}{" "}
                                    {markdownSyntax[label].tooltip}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </TooltipProvider>
    );
}
