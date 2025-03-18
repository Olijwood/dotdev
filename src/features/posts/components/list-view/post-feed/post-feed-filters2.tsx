"use client";

import { SortByDropdown } from "@/components/ui/dropdown-menu";
import { TabLink } from "@/components/ui/link/nav-link";
import { cn } from "@/lib/utils";

export type PostSortName = "Top" | "Latest";
export type PostFilterName = "Discover" | "Following";

const authenticatedTabs: { name: PostFilterName; href: string }[] = [
    { name: "Discover", href: "/discover" },
    { name: "Following", href: "/following" },
];

const unauthenticatedTabs: { name: PostSortName; href: string }[] = [
    { name: "Latest", href: "/latest" },
    { name: "Top", href: "/top" },
];

type PostFeedFiltersProps = {
    page?: string;
    activeTab?: PostFilterName;
    activeSort?: PostSortName;
    isAuthenticated?: boolean;
    hidden?: boolean;
};

export function PostFeedFilter({
    page = "",
    activeTab = "Discover",
    activeSort = "Latest",
    isAuthenticated = false,
    hidden = false,
}: PostFeedFiltersProps) {
    const tabs = isAuthenticated ? authenticatedTabs : unauthenticatedTabs;
    return (
        <div
            className={cn(
                hidden
                    ? "!hidden"
                    : "min-h-fit no-scrollbar flex w-full max-w-3xl items-start overflow-x-auto  pl-1 md:w-2/3 lg:w-full",
            )}
        >
            {tabs.map((tab) => (
                <TabLink
                    key={tab.name}
                    href={`${page}${tab.href}`}
                    isActive={
                        isAuthenticated
                            ? activeTab === tab.name
                            : activeSort === tab.name
                    }
                >
                    {tab.name}
                </TabLink>
            ))}
            {isAuthenticated && (
                <SortByDropdown page={page} activeSort={activeSort} />
            )}
        </div>
    );
}
