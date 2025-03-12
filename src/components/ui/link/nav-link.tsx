"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type TabLinkProps = {
    href: string;
    isActive?: boolean;
    children: React.ReactNode;
    className?: string;
};

export function TabLink({ href, isActive, children, className }: TabLinkProps) {
    return (
        <Link
            href={href}
            className={cn(
                "px-2 text-lg",
                className,
                isActive
                    ? "text-black font-bold border-b-2 border-black"
                    : "text-gray-600 font-medium",
            )}
        >
            {children}
        </Link>
    );
}
