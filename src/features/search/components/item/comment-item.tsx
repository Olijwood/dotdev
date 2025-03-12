"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getDateString } from "@/lib/utils";

type CommentItemProps = {
    comment: {
        id: string;
        content: string;
        createdAt: Date;
        postId: string;
        postTitle: string;
        postSlug: string;
        username: string;
        userImage: string;
        likes: number;
    };
};

export function CommentItem({ comment }: CommentItemProps) {
    const timeAgo = getDateString(comment.createdAt);

    // Truncate content if it's too long
    const truncatedContent =
        comment.content.length > 200
            ? `${comment.content.slice(0, 200)}...`
            : comment.content;

    return (
        <div className="py-4 border-b border-border last:border-0">
            <div className="flex items-center gap-2 mb-2">
                <Link href={`/user/${comment.username}`} className="shrink-0">
                    <Image
                        src={comment.userImage || "/hacker.png"}
                        alt={comment.username}
                        width={24}
                        height={24}
                        className="rounded-full"
                    />
                </Link>

                <Link
                    href={`/user/${comment.username}`}
                    className="font-medium hover:text-primary"
                >
                    {comment.username}
                </Link>

                <span className="text-muted-foreground text-sm">
                    commented {timeAgo}
                </span>

                <span className="text-muted-foreground">•</span>

                <Link
                    href={`/posts/${comment.postSlug}`}
                    className="text-sm text-muted-foreground hover:text-primary truncate"
                >
                    on: {comment.postTitle}
                </Link>
            </div>

            <div className="pl-8 border-l-2 border-muted ml-3 py-2">
                <p className="text-sm mb-2">{truncatedContent}</p>

                <div className="flex items-center text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <Heart size={14} className="mr-1 text-red-500" />
                        <span>{comment.likes}</span>
                    </div>

                    <Link
                        href={`/posts/${comment.postSlug}#comment-${comment.id}`}
                        className="ml-auto text-xs text-primary hover:underline"
                    >
                        View in context →
                    </Link>
                </div>
            </div>
        </div>
    );
}
