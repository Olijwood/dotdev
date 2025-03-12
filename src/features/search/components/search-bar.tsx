"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type React from "react";

import { useState, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

import { cn } from "@/lib/utils";
import { suggestionIcons } from "../constants";
import { useClickOutside, useFetchSuggestions } from "../hooks";

type SearchBarProps = {
    placeholder?: string;
    poweredBy?: boolean;
    onSearch?: (query: string) => void;
    className?: string;
    id?: string;
    variant?: "header" | "large";
};

export function SearchBar({
    placeholder = "Search...",
    onSearch,
    className = "",
    id,
    variant = "header",
}: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const debouncedQuery = useDebounce(query, 200);

    const { suggestions, isLoading } = useFetchSuggestions(debouncedQuery);
    const searchParams = useSearchParams();
    const currentFilter = searchParams.get("filter");

    const filterParam = currentFilter ? `&filter=${currentFilter}` : "";

    useClickOutside(wrapperRef, () => setIsFocused(false));

    const handleSearch = () => {
        if (onSearch && query) {
            onSearch(query);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
            window.location.href = `/search?q=${encodeURIComponent(query)}${filterParam}`;
        }
    };

    const suggestionElements = useMemo(
        () =>
            suggestions.map((suggestion, index) => (
                <Link
                    href={`/search?q=${encodeURIComponent(suggestion.text)}${filterParam}`}
                    key={index}
                    className="flex items-center px-4 py-2 text-sm hover:bg-muted"
                    onClick={() => {
                        setQuery(suggestion.text);
                        setIsFocused(false);
                        if (onSearch) onSearch(suggestion.text);
                    }}
                >
                    {suggestionIcons[suggestion.type]}
                    <span>{suggestion.text}</span>
                </Link>
            )),
        [suggestions, filterParam, onSearch],
    );

    return (
        <div ref={wrapperRef} className={cn("relative", className)} id={id}>
            <div
                className={cn(
                    "flex items-center",
                    variant === "large" ? "w-full" : "",
                )}
            >
                <div className="absolute left-3 text-muted-foreground">
                    <Search size={18} />
                </div>
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onKeyDown={handleKeyDown}
                    className={cn(
                        "pl-9 pr-3 focus-visible:ring-blue-800",
                        variant === "large"
                            ? "w-full"
                            : "w-[240px] md:w-[300px]",
                        "border-muted bg-muted/50",
                    )}
                />
            </div>

            {isFocused && query.length > 1 && (
                <div className="absolute z-10 mt-1 w-full rounded-md border bg-background shadow-md">
                    {isLoading ? (
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                            Loading suggestions...
                        </div>
                    ) : suggestions.length > 0 ? (
                        suggestionElements
                    ) : (
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                            No suggestions found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
