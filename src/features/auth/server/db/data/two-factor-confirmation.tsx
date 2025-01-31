import db from "@/lib/db";

export const createTwoFactorConfirmation = async (userId: string) => {
    await db.twoFactorConfirmation.create({
        data: {
            userId,
        },
    });
};
