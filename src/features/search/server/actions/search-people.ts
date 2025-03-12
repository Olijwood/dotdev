"use server";

import { searchPeople } from "../db/search-people";

export async function searchPeopleAction({
    query,
    sort = "relevant",
}: {
    query: string;
    sort?: string;
}) {
    try {
        if (!query || query.length < 2) {
            return {
                success: true,
                people: [],
            };
        }

        const people = await searchPeople(query, sort);
        return { success: true, people };
    } catch (error) {
        console.error("Error searching people:", error);
        return { success: false, error: "Failed to search people", people: [] };
    }
}
