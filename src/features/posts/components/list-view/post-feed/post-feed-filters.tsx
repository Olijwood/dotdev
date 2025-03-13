"use client";

import { TabLink } from "@/components/ui/link/nav-link";

export type PostFilterTabName = "Top" | "Latest";

export function PostFeedFilter({
    activeTab,
}: {
    activeTab: PostFilterTabName;
}) {
    return (
        <div className="min-h-fit no-scrollbar flex w-full max-w-3xl items-start overflow-x-auto  pl-1 md:w-2/3 lg:w-full">
            {["Latest", "Top"].map((tab) => (
                <TabLink
                    key={tab}
                    href={tab === "Latest" ? "/" : "/posts/top"}
                    isActive={activeTab === tab}
                >
                    {tab}
                </TabLink>
            ))}
        </div>
    );
}
