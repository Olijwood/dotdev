"use client";

import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

type PostFormCardProps = {
    children: ReactNode;
};

export const PostFormCard = ({ children }: PostFormCardProps) => {
    return (
        <Card className="flex min-h-full w-full max-w-6xl flex-col self-center rounded-none sm:rounded-xl sm:!border sm:!border-gray-300 ">
            {children}
        </Card>
    );
};
