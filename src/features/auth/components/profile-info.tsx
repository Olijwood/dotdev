"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type ProfileInfoUser = {
    username: string;
    skillsLanguages: string | null;
    currentlyLearning: string | null;
    currentlyHackingOn: string | null;
    availableFor: string | null;
    postCount: number;
    tagFollowCount: number;
    commentCount: number;
};

type ProfileInfoProps = {
    user: ProfileInfoUser;
};

export function ProfileInfo({ user }: ProfileInfoProps) {
    const [showMoreInfo, setShowMoreInfo] = useState(false);

    const infoItems = [
        {
            title: "Skills/Languages",
            content: user.skillsLanguages,
        },
        {
            title: "Currently learning",
            content: user.currentlyLearning,
        },
        {
            title: "Currently hacking on",
            content: user.currentlyHackingOn,
            isLink: true,
        },
        {
            title: "Available for",
            content: user.availableFor,
        },
    ];

    return (
        <div>
            {/* Mobile view */}
            <div className="md:hidden mt-3 mb-2">
                <div className="flex">
                    <Button
                        variant="outline"
                        className="w-[98%] mx-auto border border-gray-300"
                        onClick={() => setShowMoreInfo(!showMoreInfo)}
                    >
                        {showMoreInfo
                            ? "Hide info about @" + user.username
                            : "More info about @" + user.username}
                    </Button>
                </div>
                {showMoreInfo && (
                    <div className="mt-4 space-y-4">
                        {infoItems.map(
                            (item) =>
                                item.content && (
                                    <InfoCard
                                        key={item.title}
                                        title={item.title}
                                        content={item.content}
                                        isLink={item.isLink}
                                    />
                                ),
                        )}
                        <ProfileInfoStats
                            postCount={user.postCount}
                            tagFollowCount={user.tagFollowCount}
                            commentCount={user.commentCount}
                        />
                    </div>
                )}
            </div>

            {/* Desktop view */}
            <div className="hidden md:block">
                <div className="space-y-4 mt-4">
                    {infoItems.map(
                        (item) =>
                            item.content && (
                                <InfoCard
                                    key={item.title}
                                    title={item.title}
                                    content={item.content}
                                    isLink={item.isLink}
                                />
                            ),
                    )}
                    <ProfileInfoStats
                        postCount={user.postCount}
                        tagFollowCount={user.tagFollowCount}
                        commentCount={user.commentCount}
                    />
                </div>
            </div>
        </div>
    );
}
export function ProfileInfoSkelton() {
    const infoItems = [
        {
            title: "Skills/Languages",
            content: " ",
        },
        {
            title: "Currently learning",
            content: " ",
        },
        {
            title: "Currently hacking on",
            content: " ",
            isLink: true,
        },
        {
            title: "Available for",
            content: " ",
        },
    ];

    return (
        <div>
            {/* Mobile view */}
            <div className="md:hidden mt-3 mb-2">
                <div className="flex">
                    <Button
                        variant="outline"
                        className="w-[98%] mx-auto border border-gray-300"
                    >
                        More info about @_ndeyefatoudiop
                    </Button>
                </div>
            </div>
            {/* Desktop view */}
            <div className="hidden md:block">
                <div className="space-y-4 mt-4">
                    {infoItems.map(
                        (item) =>
                            item.content && (
                                <InfoCard
                                    key={item.title}
                                    title={item.title}
                                    content={item.content}
                                    isLink={item.isLink}
                                />
                            ),
                    )}
                    <ProfileInfoStats
                        postCount={0}
                        tagFollowCount={0}
                        commentCount={0}
                    />
                </div>
            </div>
        </div>
    );
}

type InfoCardProps = {
    title: string;
    content: string;
    isLink?: boolean;
};

function InfoCard({ title, content, isLink = false }: InfoCardProps) {
    return (
        <div className="border border-gray-300 rounded-lg p-4 bg-white">
            <h3 className="font-bold mb-2">{title}</h3>
            <Separator className="my-2" />
            <div className="text-gray-700 break-words">
                {isLink ? (
                    <a
                        href={content}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {content}
                    </a>
                ) : (
                    content
                )}
            </div>
        </div>
    );
}

type ProfileInfoStatsProps = {
    postCount: number;
    tagFollowCount: number;
    commentCount: number;
};

function ProfileInfoStats({
    postCount,
    tagFollowCount,
    commentCount,
}: ProfileInfoStatsProps) {
    return (
        <div className="border border-gray-300 rounded-lg p-4 bg-white space-y-2">
            <InfoStat icon="📄" text={`${postCount} posts published`} />
            <InfoStat icon="💬" text={`${commentCount} comments written`} />
            <InfoStat icon="️️#️⃣" text={`${tagFollowCount} tags followed`} />
        </div>
    );
}

function InfoStat({ icon, text }: { icon: string; text: string }) {
    return (
        <div className="flex items-center gap-2">
            <span>{icon}</span>
            <span className="text-gray-700">{text}</span>
        </div>
    );
}
