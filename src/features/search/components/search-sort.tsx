"use client";

import { useSearchParams } from "next/navigation";
import { TabLink } from "@/components/ui/link/nav-link";
import { cn } from "@/lib/utils";

type SearchSortProps = {
    activeSort?: string;
};

const sortOptions = [
    { label: "Relevant", value: "relevant" },
    { label: "Recent", value: "recent" },
    { label: "Popular", value: "popular" },
] as const;

export function SearchSort({ activeSort = "relevant" }: SearchSortProps) {
    const searchParams = useSearchParams();
    const q = searchParams?.get("q") || "";
    const filter = searchParams?.get("filter") || "posts";

    return (
        <div className="flex space-x-2 ml-3">
            {sortOptions.map((option) => (
                <TabLink
                    key={option.value}
                    href={`/search?q=${encodeURIComponent(q)}&filter=${filter}&sort=${option.value}`}
                    isActive={activeSort === option.value}
                    className={cn(
                        "text-sm py-2 !pl-1 md:text-xl",
                        option.value === activeSort ? "py-0.5 my-1.5" : "py-2",
                    )}
                >
                    {option.label}
                </TabLink>
            ))}
        </div>
    );
}
