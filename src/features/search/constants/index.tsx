"use client";

import { FileText, MessageSquare, User } from "lucide-react";
import type { JSX } from "react";
import { type SearchSuggestion } from "@/features/search/server/db/search-suggestions";

export const suggestionIcons: Record<SearchSuggestion["type"], JSX.Element> = {
    post: <FileText size={16} className="mr-2 text-blue-500" />,
    user: <User size={16} className="mr-2 text-green-500" />,
    comment: <MessageSquare size={16} className="mr-2 text-orange-500" />,
};
