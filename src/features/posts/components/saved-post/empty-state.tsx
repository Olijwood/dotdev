"use client";

import { BookmarkIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const EmptyState = () => {
    return (
        <div className="flex w-full max-w-4xl flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-card p-12 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-gray-100">
                <BookmarkIcon className="size-10 text-gray-400" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold">
                Your reading list is empty
            </h2>
            <p className="mt-2 max-w-md text-muted-foreground">
                Save interesting posts to read later by clicking the bookmark
                icon on any post.
            </p>
            <Link href="/" className="mt-8">
                <Button className="bg-blue-600 hover:bg-blue-700">
                    Browse posts
                </Button>
            </Link>
        </div>
    );
};
