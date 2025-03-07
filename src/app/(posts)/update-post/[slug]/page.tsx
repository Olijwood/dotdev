"use server";

import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PostForm } from "@/features/posts/components/form";
import { getPostForUpdate } from "@/features/posts/server/db";
import { currentUser } from "@/server/actions/auth";
import Loading from "../../loading";

export default async function UpdatePostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    if (!slug) return redirect("/");

    const user = await currentUser();
    if (!user || !user.id) return redirect("/");

    const post = await getPostForUpdate(slug, user.id);
    if (!post) return redirect("/");

    return (
        <Suspense fallback={<Loading />}>
            <PostForm post={post} userId={user.id} />
        </Suspense>
    );
}
