"use client";

import { Loader } from "@/components/ui/loader";

export default function Loading() {
    return (
        <div className="bg-muted flex size-full flex-col items-center justify-center">
            <Loader size="xl" />;
        </div>
    );
}
