"use server";

import * as z from "zod";
import { RESET_PASSWORD_STATUS } from "@/features/auth/constants";
import { sendPasswordResetEmail } from "@/features/auth/lib/mail";
import { generatePasswordResetToken } from "@/features/auth/lib/token";
import { getUserByEmail } from "@/features/auth/server/db/data";
import { ResetPasswordSchema } from "@/schemas";

export const resetPassword = async (
    data: z.infer<typeof ResetPasswordSchema>,
) => {
    const validatedFields = ResetPasswordSchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: RESET_PASSWORD_STATUS.INPUT_ERR };
    }

    const { email } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        return { error: RESET_PASSWORD_STATUS.ERROR };
    }

    // TODO: Generate token & send email
    const pwResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(pwResetToken.email, pwResetToken.token);

    return { success: RESET_PASSWORD_STATUS.SUCCESS };
};
