"use client";

import Link from "next/link";
import type React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardContent } from "@/components/ui/card";
import { cn, getDateString } from "@/lib/utils";
import { FollowButton } from "./follow-button";

type AuthorSidebarProps = React.ComponentPropsWithoutRef<"div"> & {
    author: {
        id: string;
        username: string | null;
        image: string | null;
        createdAt: Date;
    };
    following?: boolean;
};

export function AuthorSidebar({
    author,
    className,
    ...props
}: AuthorSidebarProps) {
    const { id: authorId, username, image, createdAt } = author;
    const joinedDate = getDateString(createdAt, true);
    const description =
        "leapcell.io: serverless web hosting / async task / microservices";
    return (
        <div className={cn("space-y-6 ", className)} {...props}>
            <div className="mt-0 h-auto rounded-none border border-t-0 sm:border-t border-gray-300 bg-white p-2  sm:my-2 sm:rounded-lg md:my-0 ">
                <CardContent className="p-2 md:p-4">
                    <div className="flex flex-col items-center text-center">
                        <Avatar className="mb-2 size-16">
                            <AvatarImage
                                src={image || "/hacker.png"}
                                alt={`${username} avatar`}
                            />
                            <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                        <Link href={`/${username}`}>
                            <h2 className="mb-1 cursor-pointer text-lg font-semibold hover:underline">
                                {username}
                            </h2>
                        </Link>
                        {description && (
                            <p className="mb-4 justify-stretch text-start text-xs font-normal text-muted-foreground">
                                {description}
                            </p>
                        )}
                        <FollowButton followingId={authorId} />
                    </div>

                    <div className="mt-4 space-y-3 text-xs font-semibold">
                        <div>
                            <div className="mb-0.5 font-normal uppercase tracking-wide text-muted-foreground">
                                LOCATION
                            </div>
                            <div>California</div>
                        </div>
                        <div>
                            <div className="mb-0.5 font-normal uppercase tracking-wide text-muted-foreground">
                                JOINED
                            </div>
                            <div>{joinedDate}</div>
                        </div>
                    </div>
                </CardContent>
            </div>

            <div className="mt-0 h-auto rounded-none border border-t-0 sm:border-t border-gray-300 bg-white p-2  sm:my-2 sm:rounded-lg">
                <CardContent className="p-2 md:p-4">
                    <h3 className="mb-4 font-semibold">More from {username}</h3>
                    <div className="space-y-4">
                        {[
                            "Understanding Network Interfaces: Loopback, Local IPs, and Public IPs",
                            "What Happens When Redis Runs Out of Memory?",
                            "Which Authentication to Use? A Comparison of 4 Popular Approaches",
                        ].map((title) => (
                            <Link
                                key={title}
                                href={`/${username}/title`}
                                className="block text-xs transition-colors hover:text-blue-600"
                            >
                                {title}
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </div>
        </div>
    );
}
