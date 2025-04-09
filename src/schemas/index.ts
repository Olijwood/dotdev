import { UserRole } from "@prisma/client";
import * as z from "zod";

const RegisterSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
    name: z.string().min(1, {
        message: "Name is required",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters long",
    }),
    passwordConfirmation: z.string().min(6, {
        message: "Password must be at least 6 characters long",
    }),
});

const LoginSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
    password: z.string().min(1, {
        message: "Please enter a valid password",
    }),
    code: z.optional(z.string()),
});

const ResetPasswordSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
});

const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Password must be at least 6 characters long",
    }),
    passwordConfirmation: z.string().min(6, {
        message: "Password must be at least 6 characters long",
    }),
});

const SettingsSchema = z
    .object({
        name: z.optional(z.string()),
        username: z.optional(z.string()),
        isTwoFactorEnabled: z.optional(z.boolean()),
        role: z.enum([UserRole.ADMIN, UserRole.USER]),
        email: z.optional(z.string().email()),
        password: z
            .string()
            .optional()
            .transform((val) => (val === "" ? undefined : val))
            .refine((val) => !val || val.length >= 6, {
                message: "Password too short",
            }),

        newPassword: z
            .string()
            .optional()
            .transform((val) => (val === "" ? undefined : val))
            .refine((val) => !val || val.length >= 6, {
                message: "Password too short",
            }),
    })
    .refine((data) => !data.password || data.newPassword, {
        message: "New password is required if changing password.",
        path: ["newPassword"],
    })
    .refine((data) => !data.newPassword || data.password, {
        message: "Current password is required if setting a new password.",
        path: ["password"],
    });

export const SettingsProfileSchema = z
    .object({
        name: z.optional(z.string()),
        email: z.optional(z.string().email()),
        displayEmailOnProfile: z.optional(z.boolean()),
        username: z.optional(z.string()),
        bio: z.optional(z.string().max(100)),
        website: z.optional(z.string().max(100)),
        image: z.optional(z.string().max(100)),
        githubUrl: z.optional(z.string().max(100)),
        location: z.optional(z.string().max(100)),
        work: z.optional(z.string().max(100)),
        education: z.optional(z.string().max(100)),
        pronouns: z.optional(z.string().max(7)),
        brandColour: z.optional(z.string().max(100)),
        currentlyLearning: z.optional(z.string().max(200)),
        currentlyHackingOn: z.optional(z.string().max(200)),
        availableFor: z.optional(z.string().max(200)),
        skillsLanguages: z.optional(z.string().max(200)),
        isTwoFactorEnabled: z.optional(z.boolean()),
        password: z
            .string()
            .optional()
            .transform((val) => (val === "" ? undefined : val))
            .refine((val) => !val || val.length >= 6, {
                message: "Password too short",
            }),

        newPassword: z
            .string()
            .optional()
            .transform((val) => (val === "" ? undefined : val))
            .refine((val) => !val || val.length >= 6, {
                message: "Password too short",
            }),
    })
    .refine((data) => !data.password || data.newPassword, {
        message: "New password is required if changing password.",
        path: ["newPassword"],
    })
    .refine((data) => !data.newPassword || data.password, {
        message: "Current password is required if setting a new password.",
        path: ["password"],
    });

export type SettingsProfileFormValues = z.infer<typeof SettingsProfileSchema>;

const CreatePostSchema = z.object({
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
        .min(10, {
            message: "Content is too short",
        })
        .max(10000, {
            message: "Content is too long",
        }),
    bannerImgUrl: z.string().optional().or(z.literal("")),
    tags: z.array(z.string()).optional().default([]),
});

const UpdatePostSchema = z.object({
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
        .min(10, {
            message: "Content is too short",
        })
        .max(10000, {
            message: "Content is too long",
        }),
    published: z.boolean(),
    bannerImgUrl: z.string().optional().or(z.literal("")),
    tags: z.array(z.string()).optional().default([]),
});

export {
    RegisterSchema,
    LoginSchema,
    ResetPasswordSchema,
    NewPasswordSchema,
    SettingsSchema,
    CreatePostSchema,
    UpdatePostSchema,
};
