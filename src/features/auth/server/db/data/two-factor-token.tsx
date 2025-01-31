import db from "@/lib/db";

export const getTwoFactorTokenByEmail = async (email: string) => {
    try {
        const twoFactorToken = await db.twoFactorToken.findFirst({
            where: { email },
        });
        return twoFactorToken;
    } catch {
        return null;
    }
};

export const getTwoFactorTokenByToken = async (token: string) => {
    try {
        const twoFactorToken = await db.twoFactorToken.findUnique({
            where: { token },
        });
        return twoFactorToken;
    } catch {
        return null;
    }
};

export const deleteTwoFactorTokenById = async (id: string) => {
    await db.twoFactorToken.delete({
        where: { id },
    });
};

export const createTwoFactorToken = async (
    email: string,
    token: string,
    expiresAt: Date,
) => {
    const twoFactorToken = await db.twoFactorToken.create({
        data: {
            email,
            token,
            expiresAt,
        },
    });
    return twoFactorToken;
};
