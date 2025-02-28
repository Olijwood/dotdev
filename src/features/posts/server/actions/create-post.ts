"use server";

import { z } from "zod";
import { CreatePostSchema } from "@/schemas";
import { currentUser } from "@/server/actions/auth";
import type { PostForCreate } from "../../types";
import { createPost } from "../db";

export const actionCreatePost = async (
    data: z.infer<typeof CreatePostSchema>,
) => {
    const validatedFields = CreatePostSchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: "Invalid input" };
    }

    const { title, slug, content, bannerImgUrl } = validatedFields.data;

    const user = await currentUser();

    if (!user || !user.id) {
        return { error: "Unauthorized" };
    }

    const createData: PostForCreate = {
        title,
        slug,
        content,
        userId: user.id,
    };
    if (bannerImgUrl) {
        createData.bannerImgUrl = bannerImgUrl;
    }

    const created = await createPost(createData);
    if (!created) {
        return { error: "Failed to create post" };
    }

    return { success: "Post created!" };
};
