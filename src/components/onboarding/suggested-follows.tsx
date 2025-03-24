"use client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Person } from "./types";

type SuggestedFollowsProps = {
    suggestedPeople: Person[];
    followedUsers: string[];
    setFollowedUsers: (users: string[]) => void;
};

export function SuggestedFollows({
    suggestedPeople,
    followedUsers,
    setFollowedUsers,
}: SuggestedFollowsProps) {
    // Mock data for suggested follows

    const toggleFollow = (userId: string) => {
        if (followedUsers.includes(userId)) {
            setFollowedUsers(followedUsers.filter((id) => id !== userId));
        } else {
            setFollowedUsers([...followedUsers, userId]);
        }
    };

    const selectAll = () => {
        setFollowedUsers(suggestedPeople.map((person) => person.id));
    };

    const deselectAll = () => {
        setFollowedUsers([]);
    };

    return (
        <div className="p-6 sm:p-12">
            <div className="space-y-2 mb-4">
                <h1 className="text-[3rem] font-black text-[#090909] leading-tight">
                    Suggested follows
                </h1>
                <p className="text-[#404040] text-xl leading-relaxed">
                    Kickstart your community
                </p>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                    <span>
                        You&apos;re{" "}
                        {followedUsers.length > 0
                            ? "following"
                            : "not following anyone"}{" "}
                        {followedUsers.length > 0
                            ? `${followedUsers.length} ${followedUsers.length === 1 ? "person" : "people"}`
                            : ""}
                    </span>
                    <span>-</span>
                    {followedUsers.length === 0 ? (
                        <button
                            onClick={selectAll}
                            className="text-[#3b49df] hover:underline"
                        >
                            Select all {suggestedPeople.length}
                        </button>
                    ) : (
                        <button
                            onClick={deselectAll}
                            className="text-[#3b49df] hover:underline"
                        >
                            Deselect all
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-0 ">
                {suggestedPeople.map((person) => (
                    <div
                        key={person.id}
                        className={`p-4 ${followedUsers.includes(person.id) ? "bg-[#f0f5ff]" : ""}`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="size-11">
                                    <AvatarImage
                                        src={person.image}
                                        alt={person.name}
                                        className=""
                                    />
                                    <AvatarFallback>
                                        {person.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold">
                                        {person.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {person.bio}
                                    </p>
                                </div>
                            </div>
                            <button
                                className={
                                    followedUsers.includes(person.id)
                                        ? "bg-transparent hover:bg-gray-50 border border-gray-300 text-black font-semibold py-2 px-4 rounded-md"
                                        : "bg-[#3b49df] hover:bg-[#2f3ab2] text-white py-2 px-4 rounded-md"
                                }
                                onClick={() => toggleFollow(person.id)}
                            >
                                {followedUsers.includes(person.id)
                                    ? "Following"
                                    : "Follow"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
