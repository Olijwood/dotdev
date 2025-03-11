"use server";

import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import db from "@/lib/db";
import {
    getVerificationTokenByEmail,
    getPasswordResetTokenByEmail,
    getTwoFactorTokenByEmail,
    deleteTwoFactorTokenById,
    createTwoFactorToken,
} from "../server/db/data";

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);
    const exisitingToken = await getVerificationTokenByEmail(email);

    if (exisitingToken?.expires && exisitingToken.expires < new Date()) {
        return exisitingToken;
    } else if (exisitingToken) {
        await db.verificationToken.delete({
            where: { id: exisitingToken.id },
        });
    }

    const verificationToken = await db.verificationToken.create({
        data: {
            email,
            token,
            expires,
        },
    });

    return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const exisitingToken = await getPasswordResetTokenByEmail(email);

    if (exisitingToken) {
        await db.passwordResetToken.delete({
            where: { id: exisitingToken.id },
        });
    }

    const verificationToken = await db.passwordResetToken.create({
        data: {
            email,
            token,
            expires,
        },
    });
    return verificationToken;
};

export const generateTwoFactorToken = async (email: string) => {
    const token = crypto.randomInt(100_000, 1_000_000).toString();
    const expiresAt = new Date(new Date().getTime() + 300 * 1000);

    const exisitingToken = await getTwoFactorTokenByEmail(email);
    if (exisitingToken) {
        await deleteTwoFactorTokenById(exisitingToken.id);
    }

    const twoFactorToken = await createTwoFactorToken(email, token, expiresAt);

    return twoFactorToken;
};
