"use client";

import Link from "next/link";
import type React from "react"; // Added import for React
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, getDateString } from "@/lib/utils";

type PostSidebarProps = React.ComponentPropsWithoutRef<"div"> & {
    author: {
        username: string | null;
        image: string | null;
        createdAt: Date;
    };
    following?: boolean;
};

export function PostSidebar({
    author,
    following = false,
    className,
    ...props
}: PostSidebarProps) {
    const { username, image, createdAt } = author;
    const joinedDate = getDateString(createdAt, true);
    const [isFollowing, setIsFollowing] = useState(following);
    return (
        <div className={cn("space-y-6", className)} {...props}>
            <Card>
                <CardContent className="p-3">
                    <div className="flex flex-col items-center text-center">
                        <Avatar className="mb-4 size-16">
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
                        <p className="mb-4 justify-stretch text-start text-sm font-medium text-muted-foreground">
                            leapcell.io: serverless web hosting / async task /
                            redis
                        </p>
                        <Button
                            onClick={() => setIsFollowing(!isFollowing)}
                            className={cn(
                                "w-full hover:bg-opacity-80 ",
                                isFollowing && "bg-blue-600 hover:bg-blue-700",
                            )}
                        >
                            {isFollowing ? "Following" : "Follow"}
                        </Button>
                    </div>

                    <div className="mt-6 space-y-4 text-sm">
                        <div>
                            <div className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                                LOCATION
                            </div>
                            <div>California</div>
                        </div>
                        <div>
                            <div className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                                JOINED
                            </div>
                            <div>{joinedDate}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
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
                                className="block text-sm transition-colors hover:text-blue-600"
                            >
                                {title}
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
