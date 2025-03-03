"use client";

import { ReactionType } from "@prisma/client";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGFM from "remark-gfm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CrayonTag } from "@/components/ui/badge";
import { getDateString } from "@/lib/utils";

import { PostReactions } from "../../features/reactions/components/post-reactions";

type postContentPost = {
    id: string;
    author: {
        image: string | null;
        username: string | null;
        createdAt: Date;
    };
    title: string;
    content: string;
    bannerImgUrl: string | null | undefined;
    createdAt: Date;
    reactions: Record<ReactionType, number>;
};

type PostContentProps = {
    post: postContentPost;
};

export function PostContent({ post }: PostContentProps) {
    const { author, title, content, createdAt, reactions, bannerImgUrl } = post;
    const postBanner = bannerImgUrl || "/post-banner.png";
    const postedDate = getDateString(createdAt);
    return (
        <>
            {/* Banner Image */}
            {postBanner && (
                <div className="relative aspect-[2/1] overflow-hidden sm:mb-2  sm:rounded-lg">
                    <img
                        src={postBanner}
                        alt="RESTful API Banner"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 50vw"
                        className="h-auto max-w-full object-cover"
                    />
                </div>
            )}
            <article className="h-auto border border-gray-300 bg-white p-4 sm:mx-[1%] sm:rounded-lg md:mx-[2.5%]">
                {/* Author Info */}

                <div className="mb-4 flex items-center gap-3">
                    <Avatar className="size-10">
                        <AvatarImage
                            src={author.image || "/hacker.png"}
                            alt={`${author.username} avatar`}
                        />
                        <AvatarFallback>LC</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <Link href={`/${author.username}`}>
                            <span className="font-semibold hover:underline">
                                {author.username}
                            </span>
                        </Link>
                        <span className="text-xs text-muted-foreground">
                            Posted on {postedDate}
                        </span>
                    </div>
                </div>

                {/* Reactions */}
                <PostReactions className="mb-4" reactions={reactions} />

                {/* Title */}
                <h1 className="mb-4 text-3xl font-[900] leading-tight tracking-normal md:text-3xl lg:text-5xl">
                    {title}
                </h1>

                {/* Tags */}
                <div className="mb-4 flex flex-wrap gap-0.5 ">
                    {["webdev", "networking", "programming", "backend"].map(
                        (tag) => (
                            <CrayonTag key={tag} tag={tag} href={`/t/${tag}`} />
                        ),
                    )}
                </div>

                {/* Content */}
                <div>
                    {/* Banner Image */}
                    {postBanner && (
                        <div className="relative mb-6 aspect-[2/1] overflow-hidden rounded-lg">
                            <img
                                src={postBanner}
                                alt="RESTful API Banner"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover"
                            />
                        </div>
                    )}

                    <ReactMarkdown
                        className="markdown prose prose-slate max-w-none dark:prose-invert"
                        remarkPlugins={[remarkGFM, remarkBreaks]}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </article>
        </>
    );
}
