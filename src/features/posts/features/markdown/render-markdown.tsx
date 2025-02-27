"use client";

import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGFM from "remark-gfm";

const RenderMarkdown = ({
    content,
}: {
    content: string | null | undefined;
}) => {
    return (
        <ReactMarkdown
            className="prose prose-slate  max-w-none dark:prose-invert"
            remarkPlugins={[remarkGFM, remarkBreaks]}
        >
            {content}
        </ReactMarkdown>
    );
};

export { RenderMarkdown };
