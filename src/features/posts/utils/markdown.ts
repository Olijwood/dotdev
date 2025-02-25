export const markdownSyntax = {
    bold: "**",
    italic: "*",
    link: "[",
    orderedList: "1.",
    unorderedList: "-",
    heading: "# ",
    quote: "> ",
    code: "`",
    codeBlock: "```",
    image: "![](",
};

export const insertMarkdown = (
    text: string,
    syntax: string,
    selectionStart: number,
    selectionEnd: number,
) => {
    const before = text.substring(0, selectionStart);
    const selectedText = text.substring(selectionStart, selectionEnd);
    const after = text.substring(selectionEnd);

    let newText = before + syntax + selectedText + syntax + after;
    let cursorPosition = selectionStart + syntax.length;

    if (syntax === markdownSyntax.link) {
        newText = before + syntax + selectedText + "](" + ")" + after;
        cursorPosition =
            selectionStart + syntax.length + selectedText.length + 2;
    } else if (syntax === markdownSyntax.image) {
        newText = before + syntax + selectedText + ")" + after;
        cursorPosition =
            selectionStart + syntax.length + selectedText.length + 1;
    }

    return { text: newText, cursorPosition };
};
