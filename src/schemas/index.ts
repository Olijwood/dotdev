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
        isTwoFactorEnabled: z.optional(z.boolean()),
        role: z.enum([UserRole.ADMIN, UserRole.USER]),
        email: z.optional(z.string().email()),
        password: z.optional(
            z.string().min(6, { message: "Password too short" }),
        ),
        newPassword: z.optional(
            z.string().min(6, { message: "Password too short" }),
        ),
    })
    .refine(
        (data) => {
            if (data.password && !data.newPassword) {
                return false;
            }

            return true;
        },
        { message: "New password is required!", path: ["newPassword"] },
    )
    .refine(
        (data) => {
            if (!data.password && data.newPassword) {
                return false;
            }

            return true;
        },
        { message: "Password is required!", path: ["Password"] },
    );

export {
    RegisterSchema,
    LoginSchema,
    ResetPasswordSchema,
    NewPasswordSchema,
    SettingsSchema,
};
