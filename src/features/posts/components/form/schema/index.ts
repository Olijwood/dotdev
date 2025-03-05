import * as z from "zod";

export const PostFormSchema = z.object({
    title: z
        .string()
        .min(4, {
            message: "Title is too short",
        })
        .max(100, {
            message: "Title is too long",
        }),
    slug: z.string(),
    content: z
        .string()
        .min(20, {
            message: "Content is too short",
        })
        .max(10000, {
            message: "Content is too long",
        }),
    published: z.boolean(),
    bannerImgUrl: z.string().optional().or(z.literal("")),
});

export type PostFormValues = z.infer<typeof PostFormSchema>;
