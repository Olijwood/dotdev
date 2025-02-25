"use server";

import { z } from "zod";
import { currentUser } from "@/lib/auth";
import { UpdatePostSchema } from "@/schemas";
import { updatePost } from "../db";

export const actionUpdatePost = async (
    id: string,
    data: z.infer<typeof UpdatePostSchema>,
) => {
    const validatedFields = UpdatePostSchema.safeParse(data);

    if (!validatedFields.success) {
        console.log(validatedFields.error);
        return { error: "Invalid input" };
    }

    const { title, slug, content, published, bannerImgUrl } =
        validatedFields.data;

    const user = await currentUser();

    if (!user || !user.id) {
        return { error: "Unauthorized" };
    }

    const updateData = {
        title,
        slug,
        content,
        published,
        bannerImgUrl,
    };

    const updated = await updatePost(id, updateData);
    if (!updated) {
        return { error: "Failed to update post" };
    }

    return { success: "Post updated!" };
};

export const actionUpdatePostPublished = async (
    postId: string,
    published: boolean,
) => {
    console.log("actions published", published);

    const user = await currentUser();

    if (!user || !user.id) {
        return { error: "Unauthorized" };
    }

    const updated = await updatePost(postId, { published: published });
    if (!updated) {
        return { error: "Failed to update post" };
    }
    return { success: `Post ${published ? "published" : "unpublished"}!` };
};
