"use server";

import { AuthError } from "next-auth";
import * as z from "zod";
import { LOGIN_STATUS } from "@/features/auth/constants";
import {
    sendTwoFactorTokenEmail,
    sendVerificationEmail,
} from "@/features/auth/lib/mail";
import {
    generateTwoFactorToken,
    generateVerificationToken,
} from "@/features/auth/lib/token";
import { signIn } from "@/lib/auth";
import {
    deleteTwoFactorConfirmationById,
    getTwoFactorConfirmationByUserId,
} from "@/server/db/user";
import { verifyPassword } from "@/server/utils";
import { LoginSchema } from "../../../../schemas";
import {
    createTwoFactorConfirmation,
    deleteTwoFactorTokenById,
    getTwoFactorTokenByEmail,
    getUserByEmail,
} from "../db/data";

const login = async (data: z.infer<typeof LoginSchema>) => {
    const validatedData = LoginSchema.safeParse(data);

    if (!validatedData.success) {
        return { error: LOGIN_STATUS.INPUT_ERR };
    }

    const { email, password, code } = validatedData.data;

    const existingUser = await getUserByEmail(email);
    if (!existingUser || !existingUser.password)
        return { error: LOGIN_STATUS.CRED_ERR };

    const passwordsMatch = await verifyPassword(
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

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
            // TODO: Verify code
            const twoFactorToken = await getTwoFactorTokenByEmail(
                existingUser.email,
            );
            if (!twoFactorToken) {
                return { error: LOGIN_STATUS.TOKEN_ERR };
            }
            if (twoFactorToken.token !== code) {
                return { error: LOGIN_STATUS.TOKEN_ERR };
            }

            const hasExpired = new Date(twoFactorToken.expiresAt) < new Date();

            if (hasExpired) {
                return { error: LOGIN_STATUS.CODE_EXP_ERR };
            }
            await deleteTwoFactorTokenById(twoFactorToken.id);

            const existingConfirmation = await getTwoFactorConfirmationByUserId(
                existingUser.id,
            );
            if (existingConfirmation) {
                await deleteTwoFactorConfirmationById(existingConfirmation.id);
            }
            await createTwoFactorConfirmation(existingUser.id);
        } else {
            const twoFactorToken = await generateTwoFactorToken(
                existingUser.email,
            );
            await sendTwoFactorTokenEmail(
                twoFactorToken.email,
                twoFactorToken.token,
            );

            return { twoFactor: true };
        }
    }
    try {
        await signIn("credentials", {
            email: existingUser.email,
            password,
            redirect: false,
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

export { login };
