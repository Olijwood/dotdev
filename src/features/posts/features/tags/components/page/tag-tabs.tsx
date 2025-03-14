"use client";

import { cn } from "@/lib/utils";

type TabOption = "Relevant" | "Latest" | "Top";

type TagTabsProps = {
    activeTab: TabOption;
    onTabChange: (tab: TabOption) => void;
    className?: string;
};

export function TagTabs({ activeTab, onTabChange, className }: TagTabsProps) {
    return (
        <div
            className={cn(
                "border-b flex justify-between items-center",
                className,
            )}
        >
            <TabButton
                label="Latest"
                activeTab={activeTab}
                onClick={() => onTabChange("Latest")}
            />
            <TabButton
                label="Top"
                activeTab={activeTab}
                onClick={() => onTabChange("Top")}
            />
        </div>
    );
}

type TabButtonProps = {
    label: string;
    activeTab: TabOption;
    onClick: () => void;
};

function TabButton({ label, activeTab, onClick }: TabButtonProps) {
    const isActive = activeTab === label;

    return (
        <button
            className={`px-4 py-3 ${
                isActive
                    ? "border-b-2 border-black font-medium"
                    : "text-gray-600 hover:text-gray-900 hover:font-bold"
            }`}
            onClick={onClick}
        >
            {label}
        </button>
    );
}

function SkeletonTabButton({ label }: { label: string }) {
    return (
        <div className="px-4 py-3 text-gray-600 hover:text-gray-900 hover:font-bold">
            <span className=" h-6 w-16 block">{label}</span>
        </div>
    );
}

export function SkeletonTagTabs({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "border-b flex justify-between items-center",
                className,
            )}
        >
            <SkeletonTabButton label="Latest" />
            <SkeletonTabButton label="Top" />
        </div>
    );
}
