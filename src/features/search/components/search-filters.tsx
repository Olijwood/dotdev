"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type SearchFiltersProps = {
    activeFilter?: string;
    query: string;
};

export function SearchFilters({
    activeFilter = "posts",
    query,
}: SearchFiltersProps) {
    const filters = [
        { label: "Posts", value: "posts" },
        { label: "People", value: "people" },
        { label: "Comments", value: "comments" },
    ];

    return (
        <div className="flex flex-col w-full md:w-48 md:min-w-48">
            <div className="md:hidden flex overflow-x-auto pb-2  border-b">
                {filters.map((filter) => (
                    <Link
                        key={filter.value}
                        href={`/search?q=${encodeURIComponent(query)}&filter=${filter.value}`}
                        className={cn(
                            "px-4 py-2 whitespace-nowrap",
                            activeFilter === filter.value
                                ? "font-bold text-primary"
                                : "text-muted-foreground",
                        )}
                    >
                        {filter.label}
                    </Link>
                ))}
            </div>

            <div className="hidden md:flex md:flex-col space-y-2">
                {filters.map((filter) => (
                    <Link
                        key={filter.value}
                        href={`/search?q=${encodeURIComponent(query)}&filter=${filter.value}`}
                        className={cn(
                            "px-4 py-2 rounded-md hover:bg-muted transition-colors",
                            activeFilter === filter.value
                                ? "font-bold text-primary bg-muted"
                                : "text-muted-foreground",
                        )}
                    >
                        {filter.label}
                    </Link>
                ))}
                {query && (
                    <div className="mt-4 px-4 text-sm text-muted-foreground">
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            My posts only
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
}
