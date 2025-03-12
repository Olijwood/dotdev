"use client";

import { useSearchParams } from "next/navigation";
import { TabLink } from "@/components/ui/link/nav-link";

type SearchSortProps = {
    activeSort?: string;
};

export function SearchSort({ activeSort = "relevant" }: SearchSortProps) {
    const searchParams = useSearchParams();
    const q = searchParams?.get("q") || "";
    const filter = searchParams?.get("filter") || "posts";

    const sortOptions = [
        { label: "Most Relevant", value: "relevant" },
        { label: "Recent", value: "recent" },
        { label: "Popular", value: "popular" },
    ];

    return (
        <div className="flex space-x-4 py-1">
            {sortOptions.map((option) => (
                <TabLink
                    key={option.value}
                    href={`/search?q=${encodeURIComponent(q)}&filter=${filter}&sort=${option.value}`}
                    isActive={activeSort === option.value}
                    className="text-sm py-2"
                >
                    {option.label}
                </TabLink>
            ))}
        </div>
    );
}
