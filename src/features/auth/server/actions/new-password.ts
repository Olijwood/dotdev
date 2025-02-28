"use server";

import { z } from "zod";
import { NewPasswordSchema } from "@/schemas";
import { getUserByEmail } from "@/server/db/user";
import { hashPassword } from "@/server/utils";
import { NEW_PASSWORD_STATUS } from "../../constants";
import {
    deletePasswordResetTokenById,
    getPasswordResetTokenByToken,
    updateUserPassword,
} from "../db/data";

export const newPassword = async (
    values: z.infer<typeof NewPasswordSchema>,
    token?: string | null,
) => {
    if (!token) {
        return { error: NEW_PASSWORD_STATUS.TOKEN_ERR };
    }

    const validatedFields = NewPasswordSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: NEW_PASSWORD_STATUS.INPUT_ERR };
    }

    const { password, passwordConfirmation } = validatedFields.data;

    if (password !== passwordConfirmation) {
        return { error: NEW_PASSWORD_STATUS.PASSWORD_ERR };
    }

    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
        return { error: NEW_PASSWORD_STATUS.TOKEN_ERR };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: NEW_PASSWORD_STATUS.TOKEN_ERR };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
        return { error: NEW_PASSWORD_STATUS.CRED_ERR };
    }

    const hashedPassword = await hashPassword(password);

    await updateUserPassword(existingUser.id, hashedPassword);

    await deletePasswordResetTokenById(existingToken.id);

    return { success: NEW_PASSWORD_STATUS.SUCCESS };
};
