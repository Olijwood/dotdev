import { z } from "zod";

export const OnboardingSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be less than 30 characters"),
    bio: z.string().max(200, "Bio must be less than 200 characters").optional(),
    profileImage: z
        .string()
        .refine((val) => val === "" || val.startsWith("/uploads/")),
    followedUserIds: z.array(z.string()).optional(),
    selectedTagIds: z.array(z.string()).optional(),
});

export type OnboardingFormValues = z.infer<typeof OnboardingSchema>;
