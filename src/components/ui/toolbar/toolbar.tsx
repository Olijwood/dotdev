"use client";

import { cn } from "@/lib/utils";
import { TooltipProvider } from "../tooltip";

type ToolbarProps = {
    isMobile?: boolean;
    isEdit?: boolean;
    className?: string;
    children: React.ReactNode;
};

const sContainers = { bottom: "bbar-container", side: "sidebar-container" };
const eContainers = { bottom: "e-bbar-container", side: "e-sidebar-container" };

const Toolbar = ({ isMobile, isEdit, children, className }: ToolbarProps) => {
    return (
        <TooltipProvider>
            <div
                className={cn(
                    !isEdit &&
                        (isMobile ? sContainers.bottom : sContainers.side),
                    isEdit &&
                        (isMobile ? eContainers.bottom : eContainers.side),
                    className,
                )}
            >
                {children}
            </div>
        </TooltipProvider>
    );
};

export { Toolbar };
