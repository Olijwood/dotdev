import { Prisma } from "@prisma/client";
import { Person } from "@/components/onboarding/types";
import db from "@/lib/db";
import { logError } from "@/lib/logger";

const getAccountByUserId = async (userId: string) => {
    try {
        const account = await db.account.findFirst({
            where: {
                userId,
            },
        });
        return account;
    } catch (error) {
        logError("getAccountByUser", error);
    }
};

const getUserExistsById = async (id: string) => {
    try {
        const user = await db.user.findUnique({
            select: { id: true },
            where: { id },
        });
        return !!user;
    } catch (error) {
        logError("getUserExistsById", error);
    }
};

const getUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({
            where: { id },
        });
        return user;
    } catch (error) {
        logError("getUserById", error);
    }
};
const getUserByEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({
            where: { email },
        });
        return user;
    } catch (error) {
        logError("getUserByEmail", error);
    }
};

const getTwoFactorConfirmationByUserId = async (userId: string) => {
    try {
        const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique(
            { where: { userId } },
        );
        return twoFactorConfirmation;
    } catch {
        return null;
    }
};

const deleteTwoFactorConfirmationById = async (id: string) => {
    await db.twoFactorConfirmation.delete({
        where: { id },
    });
};

export const getOnboardingSuggestedPeople = async (userId: string) => {
    const result = await db.$queryRaw<Array<Person>>(Prisma.sql`
        SELECT 
            id, 
            username,
            name, 
            bio,
            image
        FROM "User"
        WHERE id != ${userId}
        ORDER BY RANDOM()
        LIMIT 20
   `);
    if (!result || result.length === 0) {
        return [];
    }
    const users = result.map((user) => {
        return {
            id: user.id,
            name: user.name,
            username: user.username || "",
            bio: user.bio || "",
            image: user.image || "",
        };
    });
    return users;
};
export {
    getAccountByUserId,
    getUserById,
    getUserExistsById,
    getUserByEmail,
    getTwoFactorConfirmationByUserId,
    deleteTwoFactorConfirmationById,
};
