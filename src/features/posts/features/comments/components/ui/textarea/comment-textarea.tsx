"use client";

import { Textarea } from "@/components/ui/textarea";

type CommentTextareaProps = {
    content: string;
    handleChange: (content: string) => void;
    placeholder: string;
};

export const CommentTextarea = ({
    content,
    handleChange,
    placeholder,
}: CommentTextareaProps) => {
    return (
        <Textarea
            value={content}
            onChange={(e) => handleChange(e.target.value)}
            className="scrollbar-thin h-auto min-h-[76px] w-full rounded border p-2 focus:outline-gray-300"
            placeholder={placeholder}
        />
    );
};
