"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type TabLinkProps = {
    href: string;
    isActive?: boolean;
    children: React.ReactNode;
};

export function TabLink({ href, isActive, children }: TabLinkProps) {
    return (
        <Link
            href={href}
            className={cn(
                "px-4 py-3 text-lg ",
                isActive
                    ? "text-black font-bold border-b-2 border-black"
                    : "text-gray-600 font-medium",
            )}
        >
            {children}
        </Link>
    );
}
