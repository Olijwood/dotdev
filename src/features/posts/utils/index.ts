export * from "./markdown";

export const getWordCount = (content: string) => {
    return content.trim().split(/\s+/g).length;
};

export function getMinutesToRead(wordCount: number) {
    return Math.round(wordCount / 100 + 1);
}
