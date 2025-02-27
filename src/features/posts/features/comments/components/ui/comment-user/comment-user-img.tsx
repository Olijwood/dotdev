"use client";

type CommentUserImgProps = {
    src: string | null | undefined;
    username: string | null | undefined;
};

export const CommentUserImg = ({ src, username }: CommentUserImgProps) => {
    return (
        <img
            src={src || "/hacker.png"}
            className="size-8 rounded-full"
            alt={username || "Anonymous"}
        />
    );
};
