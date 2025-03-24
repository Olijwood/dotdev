"use client";

import { Check } from "lucide-react";
import { Tag } from "./types";

type TagSelectionProps = {
    availableTags: Tag[];
    selectedTags: string[];
    setSelectedTags: (tags: string[]) => void;
};

export function TagSelection({
    availableTags,
    selectedTags,
    setSelectedTags,
}: TagSelectionProps) {
    const toggleTag = (tagId: string) => {
        if (selectedTags.includes(tagId)) {
            setSelectedTags(selectedTags.filter((id) => id !== tagId));
        } else {
            setSelectedTags([...selectedTags, tagId]);
        }
    };

    return (
        <div className="p-6 sm:p-12">
            <div className="space-y-2 mb-4">
                <h1 className="text-[3rem] font-black text-[#090909] leading-tight">
                    What are you interested in?
                </h1>
                <p className="text-[#404040] text-xl leading-relaxed">
                    Follow tags to customize your feed
                </p>
                <p className="text-sm text-gray-600">
                    {selectedTags.length} tags selected
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availableTags.map((tag) => (
                    <TagSelect
                        key={tag.id}
                        tag={tag}
                        selectedTags={selectedTags}
                        toggleTag={toggleTag}
                    />
                ))}
            </div>
        </div>
    );
}

type TagSelectProps = {
    tag: Tag;
    selectedTags: string[];
    toggleTag: (tagId: string) => void;
};

export const TagSelect = ({ tag, selectedTags, toggleTag }: TagSelectProps) => {
    return (
        <div
            key={tag.id}
            className={`border rounded-lg p-4 relative cursor-pointer ${
                selectedTags.includes(tag.id)
                    ? "bg-[#f0f5ff] ring-[#2f3ab2] ring-2"
                    : "border-gray-200"
            }`}
            onClick={() => toggleTag(tag.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    toggleTag(tag.id);
                }
            }}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold">#{tag.name}</h3>
                    <p className="text-sm text-gray-500">
                        {tag.postCount.toLocaleString()} posts
                    </p>
                </div>
                <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        selectedTags.includes(tag.id)
                            ? "bg-[#3b49df] text-white"
                            : "border border-gray-300"
                    }`}
                >
                    {selectedTags.includes(tag.id) && (
                        <Check className="w-4 h-4" />
                    )}
                </div>
            </div>
        </div>
    );
};
