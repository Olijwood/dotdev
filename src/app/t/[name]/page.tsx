"use server";

import { Suspense } from "react";
import Loading from "@/components/ui/loading";
import { TagPageComponent } from "@/features/posts/features/tags/components/page";
import { getPostsByTagName } from "@/features/posts/server/db";
import { getTagByName } from "@/features/posts/server/db/tags";
import { PostListItem } from "@/features/posts/types";

export type TagPageProps = {
    params: Promise<{ name: string }>;
};

export default async function TagPage({ params }: TagPageProps) {
    const { name } = await params;
    if (!name) return null;
    const tag = await getTagByName(name);
    if (!tag) return null;
    const posts = await getPostsByTagName(name);

    if (!posts) {
        return (
            <div>
                <p className="text-center text-muted-foreground">
                    No posts available.
                </p>
            </div>
        );
    }

    return (
        <Suspense fallback={<Loading />}>
            <TagPageComponent posts={posts as PostListItem[]} tag={tag} />
        </Suspense>
    );
}
