"use server";

import { redirect } from "next/navigation";
import { Suspense } from "react";
import {
    SkeletonTagPageLayout,
    TagPageComponent,
} from "@/features/posts/features/tags/components/page";

export type TagPageProps = {
    params: Promise<{ tagName: string }>;
};

export default async function TagPage({ params }: TagPageProps) {
    const { tagName } = await params;
    if (!tagName) return redirect("/");
    return (
        <Suspense fallback={<SkeletonTagPageLayout />}>
            <TagPageComponent tagName={tagName} />
        </Suspense>
    );
}
