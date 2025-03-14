import Image from "next/image";
import Link from "next/link";
import { SidebarHeading } from "./sidebar-heading";

export function RightSidebar() {
    return (
        <aside className="p-2 lg:col-span-1 order-3">
            <DiscussCard />
            <WhoToFollowCard />
        </aside>
    );
}

function DiscussCard() {
    return (
        <div className="border-b border-gray-300 p-4 ">
            <SidebarHeading>#discuss</SidebarHeading>
            <div className="space-y-4">
                <div>
                    <Link
                        href="/post/discuss-1"
                        className="text-gray-900 hover:text-blue-700 font-medium"
                    >
                        Build an International Phone Number Validator with React
                        + TypeScript
                    </Link>
                    <span className="ml-2 text-pink-600">💖</span>
                    <div className="mt-1 inline-block bg-yellow-200 text-xs px-2 py-0.5 rounded">
                        New
                    </div>
                </div>
            </div>
        </div>
    );
}

function WhoToFollowCard() {
    return (
        <div className="border-b border-gray-300 p-4">
            <SidebarHeading>Who to follow</SidebarHeading>
            <div className="space-y-4">
                <FollowSuggestion
                    name="SOVANNARO"
                    avatarUrl="/hacker.png?height=40&width=40"
                />
                <FollowSuggestion
                    name="Anthony Max"
                    avatarUrl="/hacker.png?height=40&width=40"
                />
                <FollowSuggestion
                    name="Andrew Baisden"
                    avatarUrl="/hacker.png?height=40&width=40"
                />
            </div>
        </div>
    );
}

type FollowSuggestionProps = {
    name: string;
    avatarUrl: string;
};

function FollowSuggestion({ name, avatarUrl }: FollowSuggestionProps) {
    return (
        <div className="flex items-center justify-start gap-2">
            <Image
                src={avatarUrl || "/hacker.png"}
                alt={name}
                width={36}
                height={36}
                className="rounded-full"
            />
            <div className="flex flex-col items-start gap-1 justify-center">
                <span className="text-sm font-medium">{name}</span>
                <button className="bg-teal-200 hover:bg-teal-300 px-2 py-1 rounded font-medium text-sm">
                    Follow
                </button>
            </div>
        </div>
    );
}
