"use client";

import Image from "next/image";
import Link from "next/link";
import { getDateString } from "@/lib/utils";

type PersonItemProps = {
    person: {
        id: string;
        username: string;
        name: string;
        image: string;
        joinedAt: Date;
        postCount: number;
    };
};

export function PersonItem({ person }: PersonItemProps) {
    console.log("person,", person);
    const joinedDate = getDateString(new Date(person.joinedAt));

    return (
        <div className="flex items-start gap-4 py-4 border-b border-border last:border-0">
            <Link href={`/user/${person.username}`} className="shrink-0">
                <Image
                    src={person.image || "/hacker.png"}
                    alt={person.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                />
            </Link>

            <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <Link
                        href={`/user/${person.username}`}
                        className="font-semibold text-lg hover:text-primary truncate"
                    >
                        {person.name}
                    </Link>
                    <span className="text-muted-foreground text-sm">
                        @{person.username}
                    </span>
                </div>

                <div className="mt-1 text-sm text-muted-foreground">
                    <span>Joined {joinedDate}</span>
                    <span className="mx-2">•</span>
                    <span>
                        {person.postCount}{" "}
                        {person.postCount === 1 ? "post" : "posts"}
                    </span>
                </div>

                <div className="mt-3">
                    <Link
                        href={`/user/${person.username}`}
                        className="inline-flex items-center justify-center px-4 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-sm font-medium transition-colors"
                    >
                        View profile
                    </Link>
                </div>
            </div>
        </div>
    );
}
