"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import * as z from "zod";
import { LOGIN_STATUS } from "@/features/auth/constants";
import { sendVerificationEmail } from "@/features/auth/lib/mail";
import { generateVerificationToken } from "@/features/auth/lib/token";
import { signIn } from "@/lib/auth";
import { LoginSchema } from "../../../../schemas";
import { getUserByEmail } from "../db/data";

export const login = async (data: z.infer<typeof LoginSchema>) => {
    const validatedData = LoginSchema.safeParse(data);

    if (!validatedData.success) {
        return { error: LOGIN_STATUS.INPUT_ERR };
    }

    const { email, password } = validatedData.data;

    const existingUser = await getUserByEmail(email);
    if (!existingUser || !existingUser.password)
        return { error: LOGIN_STATUS.CRED_ERR };

    const passwordsMatch = await bcrypt.compare(
        password,
        existingUser.password,
    );
    if (!passwordsMatch) return { error: LOGIN_STATUS.CRED_ERR };

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(
            existingUser.email,
        );
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        );
        return { success: LOGIN_STATUS.EMAIL_CHECK_SUCCESS };
    }

    try {
        await signIn("credentials", {
            email: existingUser.email,
            password,
            redirectTo: "/",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: LOGIN_STATUS.CRED_ERR };
                default:
                    return { error: LOGIN_STATUS.EMAIL_CHECK_SUCCESS };
            }
        }
        throw error;
    }
    return { success: LOGIN_STATUS.SUCCESS };
};
