"use server";

import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SkeletonPostList } from "@/features/posts/components/list-view";
import { getTagByName } from "@/features/posts/server/db/tags";
import { TagPostFeed } from "../tag-post-feed";
import { LeftSidebar, RightSidebar } from "./sidebar";
import { TagHeader } from "./tag-header";
import { SkeletonTagPageLayout, TagPageLayout } from "./tag-page-layout";

export async function TagPageComponent({ tagName }: { tagName: string }) {
    const tag = await getTagByName(tagName);
    if (!tag) return redirect("/");

    const { name, displayName, description, guidelines, about, aboutLink } =
        tag;

    return (
        <Suspense fallback={<SkeletonTagPageLayout />}>
            <TagPageLayout
                leftSidebar={
                    <LeftSidebar
                        name={name}
                        guidelines={guidelines}
                        about={about}
                        aboutLink={aboutLink}
                    />
                }
                rightSidebar={<RightSidebar />}
                tagHeader={
                    <TagHeader
                        title={displayName || name}
                        description={description || ""}
                    />
                }
            >
                <Suspense fallback={<SkeletonPostList />}>
                    <TagPostFeed tagName={tagName} />
                </Suspense>
            </TagPageLayout>
        </Suspense>
    );
}
