"use client";

import { X } from "lucide-react";
import {
    useState,
    useRef,
    type KeyboardEvent,
    useMemo,
    useEffect,
} from "react";
import { getAllTags } from "@/features/posts/server/db/tags";
import type { Tag } from "@/features/posts/types";
import { useClickOutside } from "@/hooks";
import { cn } from "@/lib/utils";

type TagInputProps = {
    maxTags?: number;
    onChange?: (tags: string[]) => void;
    initialTags?: string[];
};

export function TagInput({
    maxTags = 4,
    onChange,
    initialTags = [],
}: TagInputProps) {
    const [tags, setTags] = useState<string[]>(initialTags);
    const [inputValue, setInputValue] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [hoveredTag, setHoveredTag] = useState<string | null>(null);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const getTagColor = (tagName: string) =>
        availableTags.find((t) => t.name === tagName)?.color || "text-gray-600";
    const getTagBadge = (tagName: string) =>
        availableTags.find((t) => t.name === tagName)?.badge || "";
    useEffect(() => {
        const fetchTags = async () => {
            setIsLoading(true);
            try {
                const data = await getAllTags();
                setAvailableTags(data);
            } catch (error) {
                console.error("Error fetching tags:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTags();
    }, []);

    const handleAddTag = (tag: string) => {
        const formattedTag = tag.trim().toLowerCase().replace(/\s+/g, "");

        if (
            formattedTag &&
            !tags.includes(formattedTag) &&
            tags.length < maxTags
        ) {
            const newTags = [...tags, formattedTag];
            setTags(newTags);
            setInputValue("");
            onChange?.(newTags);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        if (value.length > 0) {
            setShowDropdown(true);
        }
    };

    const handleRemoveTag = (index: number) => {
        const newTags = tags.filter((_, i) => i !== index);
        setTags(newTags);
        onChange?.(newTags);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue) {
            e.preventDefault();
            handleAddTag(inputValue);
        } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
            handleRemoveTag(tags.length - 1);
        } else if (e.key === "Escape") {
            setShowDropdown(false);
        }
    };

    useClickOutside(containerRef, () => setShowDropdown(false));

    const filteredTags = useMemo(() => {
        return availableTags.filter((tag) => {
            if (tags.includes(tag.name)) return false;

            if (inputValue) {
                return tag.name
                    .toLowerCase()
                    .includes(inputValue.toLowerCase());
            }

            return true;
        });
    }, [inputValue, tags, availableTags]);

    return (
        <div ref={containerRef} className="relative w-full">
            <div
                role="button"
                tabIndex={0}
                className="flex flex-wrap items-center gap-2 min-h-10   "
                onClick={() => inputRef.current?.focus()}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        inputRef.current?.focus();
                    }
                }}
            >
                {tags.map((tag, index) => (
                    <TagItem
                        key={index}
                        tag={tag}
                        onRemove={() => handleRemoveTag(index)}
                        tagColor={getTagColor(tag)}
                        tagBadge={getTagBadge(tag)}
                    />
                ))}

                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        setShowDropdown(true);
                    }}
                    placeholder={
                        tags.length === 0
                            ? "Add up to 4 tags..."
                            : "Add another..."
                    }
                    className={cn(
                        "flex-grow outline-none p-1 text-gray-700 min-w-[120px] focus:outline-none focus:ring-1 focus:rounded-lg focus:ring-blue-500",
                        tags.length >= maxTags && "hidden",
                    )}
                    disabled={tags.length >= maxTags}
                />
            </div>

            {showDropdown && (
                <TagInputDropdown
                    filteredTags={filteredTags}
                    hoveredTag={hoveredTag}
                    setHoveredTag={setHoveredTag}
                    handleTagClick={handleAddTag}
                    inputValue={inputValue}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
}

type TagItemProps = {
    tag: string;
    onRemove: () => void;
    tagColor?: string;
    tagBadge?: string;
};

const TagItem = ({ tag, onRemove, tagColor, tagBadge }: TagItemProps) => {
    return (
        <div className="flex items-center bg-gray-100 rounded-md px-2 py-1 text-sm">
            <span className={tagColor}>#&nbsp;</span>
            <span className="mr-1">{tag}</span>
            {tagBadge && (
                <span className="bg-yellow-100 text-yellow-800 text-xs px-1 rounded mr-1">
                    {tagBadge}
                </span>
            )}
            <button
                type="button"
                onClick={onRemove}
                className="text-gray-500 hover:text-gray-700"
            >
                <X size={16} />
            </button>
        </div>
    );
};

type TagInputDropdownProps = {
    filteredTags: Tag[];
    hoveredTag: string | null;
    setHoveredTag: React.Dispatch<React.SetStateAction<string | null>>;
    handleTagClick: (tag: string) => void;
    inputValue: string;
    isLoading: boolean;
};

const TagInputDropdown = ({
    filteredTags,
    hoveredTag,
    setHoveredTag,
    handleTagClick,
    inputValue,
    isLoading,
}: TagInputDropdownProps) => {
    if (isLoading) {
        return (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg p-4 text-gray-500">
                Loading tags...
            </div>
        );
    }
    if (filteredTags.length === 0 && inputValue) {
        return (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg p-4 text-gray-500">
                No tags found matching: {inputValue}
            </div>
        );
    }

    return (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
            <div className="p-2 border-b border-gray-200 font-medium text-gray-700">
                {inputValue ? "Search results" : "Top tags"}
            </div>
            {filteredTags.map((tag: Tag) => (
                <button
                    key={tag.name}
                    type="button"
                    className={`p-2 w-full text-left ${hoveredTag === tag.name ? "bg-gray-100" : ""}`}
                    onClick={() => handleTagClick(tag.name)}
                    onMouseEnter={() => setHoveredTag(tag.name)}
                    onMouseLeave={() => setHoveredTag(null)}
                >
                    <div className="font-medium text-gray-800">
                        <span className={tag.color}>#&nbsp;</span>
                        <span>{tag.name}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                        {tag.description}
                    </div>
                </button>
            ))}
        </div>
    );
};
