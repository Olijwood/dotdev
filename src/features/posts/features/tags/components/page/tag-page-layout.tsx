"use client";

import { Menu } from "lucide-react";
import type React from "react";

import { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { SkeletonPostList } from "@/features/posts/components/list-view";
import { SkeletonLeftSidebar, SkeletonRightSidebar } from "./sidebar";
import { SkeletonTagHeader } from "./tag-header";
import { SkeletonTagTabs, TagTabs } from "./tag-tabs";

type LayoutProps = {
    children: React.ReactNode;
    leftSidebar: React.ReactNode;
    rightSidebar: React.ReactNode;
    tagHeader: React.ReactNode;
};

export function TagPageLayout({
    children,
    leftSidebar,
    rightSidebar,
    tagHeader,
}: LayoutProps) {
    const [leftOpen, setLeftOpen] = useState(false);
    const [rightOpen, setRightOpen] = useState(false);

    const [activeTab, setActiveTab] = useState<"Relevant" | "Latest" | "Top">(
        "Latest",
    );

    return (
        <>
            {tagHeader}
            <div className="flex-1 ">
                <div className="max-w-7xl mx-auto ">
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                        <div className="hidden md:block md:col-span-1 xl:col-span-1">
                            {leftSidebar}
                        </div>

                        <main className="md:col-span-2 h-full xl:col-span-3 flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <Sheet
                                    open={leftOpen}
                                    onOpenChange={setLeftOpen}
                                >
                                    <SheetTrigger asChild>
                                        <button className="p-2 md:hidden">
                                            <Menu className="h-5 w-5" />
                                            <span className="sr-only">
                                                Open left sidebar
                                            </span>
                                        </button>
                                    </SheetTrigger>
                                    <SheetContent
                                        side="left"
                                        className="w-80 p-0"
                                    >
                                        <SheetTitle></SheetTitle>
                                        {leftSidebar}
                                    </SheetContent>
                                </Sheet>

                                <TagTabs
                                    activeTab={activeTab}
                                    onTabChange={setActiveTab}
                                    className="justify-center flex flex-1 md:ml-7 lg:ml-0"
                                />

                                <Sheet
                                    open={rightOpen}
                                    onOpenChange={setRightOpen}
                                >
                                    <SheetTrigger asChild>
                                        <button className="p-2 lg:hidden">
                                            <Menu className="h-5 w-5" />
                                            <span className="sr-only">
                                                Open right sidebar
                                            </span>
                                        </button>
                                    </SheetTrigger>
                                    <SheetContent
                                        side="right"
                                        className="w-80 p-0"
                                    >
                                        <SheetTitle></SheetTitle>
                                        {rightSidebar}
                                    </SheetContent>
                                </Sheet>
                            </div>
                            <div className="flex-1 overflow-y-hidden">
                                {children}
                            </div>
                        </main>

                        <div className="hidden lg:block lg:col-span-1">
                            {rightSidebar}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export function SkeletonTagPageLayout() {
    return (
        <div className="relative flex size-full flex-col items-center justify-center">
            <SkeletonTagHeader />
            <div className="flex-1">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                        <div className="hidden md:block md:col-span-1 xl:col-span-1">
                            <SkeletonLeftSidebar />
                        </div>

                        <main className="md:col-span-2 h-full xl:col-span-3 flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <button className="p-2 md:hidden">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">
                                        Open right sidebar
                                    </span>
                                </button>
                                <SkeletonTagTabs className="justify-center flex flex-1 md:ml-7 lg:ml-0" />

                                <button className="p-2 lg:hidden">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">
                                        Open right sidebar
                                    </span>
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-hidden">
                                <SkeletonPostList />
                            </div>
                        </main>

                        <div className="hidden lg:block lg:col-span-1">
                            <SkeletonRightSidebar />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
