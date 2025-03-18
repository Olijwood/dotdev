"use client";

import { FollowButton } from "../../detail-view/follow-button";

type Props = {
    user: {
        id: string;
        username: string;
        name?: string;
        photoURL?: string;
    };
};
export const UserProfileCard = ({ user }: Props) => {
    return (
        <div className="flex w-full flex-col items-center gap-1 self-center rounded-lg py-3 text-center align-middle md:w-2/3 lg:w-full">
            <img
                src={user.photoURL || "/hacker.png"}
                alt={`${user.username} Profile Pic`}
                className="size-24 max-h-[150px] max-w-[150px] rounded-full"
                width={150}
                height={150}
            />
            <p className="text-lg text-muted-foreground">
                <i>@{user.username}</i>
            </p>
            <h1 className="text-2xl font-bold">{user.name || user.username}</h1>
            <FollowButton followingId={user.id} className="w-2/3" />
        </div>
    );
};
