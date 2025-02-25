"use server";

import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PostForm } from "@/features/posts/components/form";
import { getPostForUpdate } from "@/features/posts/server/db";
import { currentUser } from "@/lib/auth";
import Loading from "../../loading";

export default async function UpdatePostPage({
    params,
}: {
    params: { slug: string };
}) {
    const { slug } = await params;
    const user = await currentUser();
    if (!user || !user.id) return redirect("/");

    const post = await getPostForUpdate(slug, user.id);
    if (!post) {
        redirect("/");
    }

    return (
        <Suspense fallback={<Loading />}>
            <PostForm post={post} userId={user.id} />
        </Suspense>
    );
}
