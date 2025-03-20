"use server";

import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
    PostDetailSkeleton,
    PostDetailView,
} from "@/features/posts/components/detail-view";

export default async function PostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    if (!slug) return notFound();

    return (
        <main className="scrollbar-y flex h-[var(--main-height)] flex-col items-center bg-muted sm:py-3 ">
            <Suspense fallback={<PostDetailSkeleton />}>
                <PostDetailView slug={slug} />
            </Suspense>
        </main>
    );
}
