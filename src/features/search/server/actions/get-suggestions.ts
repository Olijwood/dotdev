"use server";

import { getSearchSuggestions } from "../db/search-suggestions";

export async function getSearchSuggestionsAction(query: string) {
    try {
        const suggestions = await getSearchSuggestions(query);
        return { success: true, suggestions };
    } catch (error) {
        console.error("Error fetching search suggestions:", error);
        return {
            success: false,
            error: "Failed to fetch suggestions",
            suggestions: [],
        };
    }
}
