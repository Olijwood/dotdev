"use client";

import { ReactNode } from "react";

type SidebarContainerProps = {
    children: ReactNode;
};

export const SidebarContainer = ({ children }: SidebarContainerProps) => {
    return (
        <div className="relative hidden h-full sm:-ml-2 sm:flex sm:flex-col">
            {children}
        </div>
    );
};
