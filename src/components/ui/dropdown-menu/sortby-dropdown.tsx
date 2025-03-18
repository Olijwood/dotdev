"use client";

import { Ellipsis } from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type SortByDropdownProps = {
    page?: string;
    activeSort?: "Latest" | "Top";
};

export const SortByDropdown = ({
    page = "",
    activeSort = "Latest",
}: SortByDropdownProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="ml-auto mr-2 mt-0.5">
                    <Ellipsis className="size-6" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="px-1.5 py-1.5 mt-0 items-center !w-full flex flex-col  text-neutral-800"
                align="end"
                forceMount
            >
                <Link
                    href={`${page}/latest`}
                    className={cn(
                        "w-full text-center rounded-lg",
                        activeSort === "Latest" && "bg-muted underline",
                    )}
                >
                    <DropdownMenuItem className="w-full hover:bg-muted/50">
                        <span className="w-full">Latest</span>
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link
                    href={`${page}/top`}
                    className={cn(
                        "w-full text-center rounded-lg",
                        activeSort === "Top" && "bg-muted underline",
                    )}
                >
                    <DropdownMenuItem className="w-full hover:bg-muted/50">
                        <span className="w-full">Top</span>
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
