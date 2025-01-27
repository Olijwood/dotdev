"use server";

import { VERIFICATION_STATUS } from "@/constants/status-messages";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import db from "@/lib/db";

export const newVerification = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
        return { error: VERIFICATION_STATUS.TOKEN_ERR };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: VERIFICATION_STATUS.TOKEN_ERR };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
        return { error: VERIFICATION_STATUS.CRED_ERR };
    }

    await db.user.update({
        where: { id: existingUser.id },
        data: {
            emailVerified: new Date(),
            email: existingToken.email,
        },
    });

    await db.verificationToken.delete({
        where: { id: existingToken.id },
    });

    return { success: VERIFICATION_STATUS.EMAIL_VER_SUCCESS };
};
