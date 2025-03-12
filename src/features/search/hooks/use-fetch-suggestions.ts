"use client";

import { useEffect, useRef, useState } from "react";
import { getSearchSuggestionsAction } from "@/features/search/server/actions";
import { type SearchSuggestion } from "@/features/search/server/db/search-suggestions";

export const useFetchSuggestions = (query: string) => {
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const isFirstLoad = useRef(true);

    useEffect(() => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            if (isFirstLoad.current || suggestions.length === 0) {
                setIsLoading(true);
            }

            try {
                const result = await getSearchSuggestionsAction(query);
                if (result.success) {
                    setSuggestions(result.suggestions);
                }
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            } finally {
                setIsLoading(false);
                isFirstLoad.current = false;
            }
        };

        fetchSuggestions();
    }, [query, suggestions.length]);

    return { suggestions, isLoading };
};
