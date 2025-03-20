"use client";

import { ReactionType } from "@prisma/client";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGFM from "remark-gfm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDateString } from "@/lib/utils";

import { PostReactions } from "../../features/reactions/components/post-reactions";
import { Tag } from "../../types";
import PostTags from "../list-view/post-tags";

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
    tags: Tag[];
};

type PostContentProps = {
    post: postContentPost;
};

export function PostContent({ post }: PostContentProps) {
    const { author, title, content, createdAt, reactions, bannerImgUrl } = post;
    console.log(post);
    const postBanner = bannerImgUrl || "";
    const postedDate = getDateString(createdAt);
    const tags = post.tags || [];
    return (
        <>
            {/* Banner Image */}
            {postBanner && (
                <div className="relative flex aspect-[2/1] justify-center overflow-hidden sm:mb-2  sm:rounded-lg">
                    <img
                        src={postBanner}
                        alt="RESTful API Banner"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 50vw"
                        className="h-auto max-w-full object-cover"
                    />
                </div>
            )}
            <article className="h-auto border border-gray-300 bg-white p-4  sm:rounded-lg">
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
                    <PostTags tags={tags} />
                </div>

                {/* Content */}
                <div>
                    {/* Banner Image */}
                    {postBanner && (
                        <div className="relative mb-6 flex aspect-[2/1] justify-center overflow-hidden rounded-lg">
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

export function PostContentSkeleton() {
    return (
        <>
            <div className="relative bg-gray-200 flex aspect-[2/1] justify-center overflow-hidden sm:mb-2  sm:rounded-lg"></div>
            <article className="h-auto border border-gray-300 bg-white p-4  sm:rounded-lg">
                <div className="mb-4 flex items-center gap-3">
                    <div className="size-10 rounded-full bg-gray-200"></div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-transparent">
                            username
                        </span>
                        <span className="text-xs text-transparent">
                            Posted on Jan 1
                        </span>
                    </div>
                </div>

                <h1 className="mb-4 text-3xl font-[900] leading-tight tracking-normal md:text-3xl lg:text-5xl">
                    <span className="text-transparent">Title</span>
                </h1>

                <div className="mb-4 flex flex-wrap gap-0.5"></div>

                <div>
                    <div className="bg-gray-200 relative mb-6 flex aspect-[2/1] justify-center overflow-hidden rounded-lg"></div>
                    <div className="prose prose-slate max-w-none !text-transparent dark:prose-invert">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Commodi consectetur ipsum tempora necessitatibus non
                        mollitia qui a facere corrupti voluptatum recusandae
                        aperiam dolores doloremque officia, vero sed. Fugiat,
                        tempore aliquam. Lorem ipsum dolor sit, amet consectetur
                        adipisicing elit. Quos beatae nostrum libero assumenda
                        inventore dolores, placeat ducimus iusto, pariatur magni
                        itaque quis. Sapiente sequi perferendis similique beatae
                        quaerat nobis illo. Lorem ipsum dolor sit amet
                        consectetur, adipisicing elit. Ut velit modi assumenda
                        earum doloremque quos reiciendis saepe dolor illum minus
                        facilis sequi harum, ea id aperiam ducimus minima eaque.
                        Maxime? Lorem ipsum dolor sit amet consectetur
                        adipisicing elit. Repellat doloribus distinctio hic
                        minima ea adipisci delectus eaque possimus ipsam
                        sapiente ratione, magni at, id sed mollitia rem dolor,
                        beatae quos!
                    </div>
                </div>
            </article>
        </>
    );
}
