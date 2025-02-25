"use client";

import { ReactNode } from "react";

type PostFormContainerProps = {
    children: ReactNode;
};

export const PostFormContainer = ({ children }: PostFormContainerProps) => {
    return (
        <div className="flex h-[var(--main-height)] w-full justify-center bg-gray-200 pb-10 sm:mt-0 sm:flex-row sm:items-start sm:gap-2 sm:p-2">
            {children}
        </div>
    );
};
