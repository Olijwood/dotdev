"use client";

import { cn } from "@/lib/utils";
// import { cn } from "@/lib/utils";
import { TooltipProvider } from "../tooltip";

type ToolbarProps = {
    isMobile?: boolean;
    className?: string;
    children: React.ReactNode;
};

const Toolbar = ({ isMobile, children, className }: ToolbarProps) => {
    return (
        <TooltipProvider>
            <div
                className={cn(
                    isMobile ? "bbar-container" : "sidebar-container",
                    className,
                )}
            >
                {children}
            </div>
        </TooltipProvider>
    );
};

export { Toolbar };
