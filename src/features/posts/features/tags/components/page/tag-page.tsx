"use client";

import { PostList } from "@/features/posts/components/list-view";
import { PostListItem, Tag } from "@/features/posts/types";
import { Layout } from "./layout";
import { LeftSidebar, RightSidebar } from "./sidebar";
import { TagHeader } from "./tag-header";

export function TagPageComponent({
    tag,
    posts,
}: {
    tag: Tag;
    posts: PostListItem[];
}) {
    const { name, displayName, description, guidelines, about, aboutLink } =
        tag;

    return (
        <>
            <Layout
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
                <PostList
                    posts={posts}
                    className="overflow-y-auto no-scrollbar lg:!scrollbar-thin h-[74vh]  sm:rounded-lg sm:pr-1"
                />
            </Layout>
        </>
    );
}
