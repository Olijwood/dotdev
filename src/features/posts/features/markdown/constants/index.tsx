import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Link,
    StrikethroughIcon,
    CodeSquare,
    MinusIcon,
    Heading2,
    Quote,
} from "lucide-react";
import type { markdownSyntaxItem } from "../types";

export const markdownSyntax: Record<string, markdownSyntaxItem> = {
    // Common Formatting
    bold: {
        prefix: "**",
        suffix: "**",
        type: "wrap",
        icon: <Bold className="size-4" />,
        tooltip: "Bold (Ctrl+B)",
    },
    italic: {
        prefix: "*",
        suffix: "*",
        type: "wrap",
        icon: <Italic className="size-4" />,
        tooltip: "Italic (Ctrl+I)",
    },
    strikethrough: {
        prefix: "~~",
        suffix: "~~",
        type: "wrap",
        icon: <StrikethroughIcon className="size-4" />,
        tooltip: "Strikethrough",
    },

    // Lists
    unorderedList: {
        prefix: "- ",
        suffix: "",
        type: "prefix",
        icon: <List className="size-4" />,
        tooltip: "Unordered List",
    },
    orderedList: {
        prefix: "1. ",
        suffix: "",
        type: "prefix",
        icon: <ListOrdered className="size-4" />,
        tooltip: "Ordered List",
    },

    // Links & Media
    link: {
        prefix: "[",
        suffix: "]()",
        type: "link",
        icon: <Link className="size-4" />,
        tooltip: "Insert Link",
    },

    // Structural Elements
    heading: {
        prefix: "## ",
        suffix: "",
        type: "prefix",
        icon: <Heading2 className="size-4" />,
        tooltip: "Heading 2",
    },
    quote: {
        prefix: "> ",
        suffix: "",
        type: "prefix",
        icon: <Quote className="size-4" />,
        tooltip: "Quote",
    },
    divider: {
        prefix: "---",
        suffix: "",
        type: "block",
        icon: <MinusIcon className="size-4" />,
        tooltip: "Divider",
    },
    codeBlock: {
        prefix: "```\n",
        suffix: "\n```",
        type: "block",
        icon: <CodeSquare className="size-4" />,
        tooltip: "Code Block",
    },
};

export const insertMarkdown = (
    content: string,
    label: string,
    selectionStart: number,
    selectionEnd: number,
) => {
    const syntax = markdownSyntax[label];
    if (!syntax) return { text: content, cursorPosition: selectionStart };

    const before = content.substring(0, selectionStart);
    const selectedText = content.substring(selectionStart, selectionEnd) || "";
    const after = content.substring(selectionEnd);

    const wrapText = (
        before: string,
        text: string,
        after: string,
        prefix: string,
        suffix: string,
    ) => ({
        text: before + prefix + text + suffix + after,
        cursorPosition: before.length + prefix.length,
    });

    const prefixText = (
        before: string,
        text: string,
        after: string,
        prefix: string,
    ) => ({
        text: before + prefix + text + after,
        cursorPosition: before.length + prefix.length,
    });

    const blockText = (
        before: string,
        text: string,
        after: string,
        prefix: string,
        suffix: string,
    ) => ({
        text: before + `\n${prefix}${text}${suffix}\n` + after,
        cursorPosition: before.length + prefix.length + 1,
    });

    if (syntax.type === "wrap")
        return wrapText(
            before,
            selectedText,
            after,
            syntax.prefix,
            syntax.suffix,
        );
    if (syntax.type === "prefix")
        return prefixText(before, selectedText, after, syntax.prefix);
    if (syntax.type === "block")
        return blockText(
            before,
            selectedText,
            after,
            syntax.prefix,
            syntax.suffix,
        );
    if (syntax.type === "link") {
        const result = wrapText(
            before,
            selectedText || "text",
            after,
            syntax.prefix,
            syntax.suffix,
        );
        result.cursorPosition = result.text.length - 1;
        return result;
    }

    return { text: content, cursorPosition: selectionStart };
};
