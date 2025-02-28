"use server";

import { redirect } from "next/navigation";
import { PostForm } from "@/features/posts/components/form";
import { currentUserId } from "@/server/actions/auth";

const CreatePostPage = async () => {
    const userId = await currentUserId();
    if (!userId) return redirect("/");
    return <PostForm userId={userId} />;
};

export default CreatePostPage;
