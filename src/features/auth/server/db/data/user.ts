import { Prisma } from "@prisma/client";
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

const updateUserPassword = async (id: string, password: string) => {
    try {
        const user = await db.user.update({
            where: { id },
            data: {
                password,
            },
        });
        return user;
    } catch (error) {
        logError("updateUserPassword", error);
    }
};

const generateUniqueUsername = async (email: string): Promise<string> => {
    const baseUsername = email.split("@")[0].toLowerCase().replaceAll(".", "");
    let username = baseUsername;
    let counter = 1;

    while (await db.user.findUnique({ where: { username } })) {
        username = `${baseUsername}${Math.floor(1000 + Math.random() * 9000)}`; // Random 4-digit number
        counter++;
        if (counter > 10) {
            throw new Error("Could not generate a unique username");
        }
    }

    return username;
};

const getUserByUsername = async (username: string) => {
    try {
        const user = await db.user.findUnique({
            where: { username },
        });
        return user;
    } catch (error) {
        logError("getUserByUsername", error);
    }
};

type UserProfileQuery = {
    id: string;
    username: string | null;
    name: string;
    image: string | null;
    bio: string | null;
    email: string;
    displayEmailOnProfile: boolean;
    createdAt: Date;
    brandColour: string | null;
    location: string | null;
    website: string | null;
    githubUrl: string | null;
    work: string | null;
    skillsLanguages: string | null;
    currentlyLearning: string | null;
    currentlyHackingOn: string | null;
    availableFor: string | null;

    postCount: number;
    tagFollowCount: number;
    commentCount: number;
};

export async function getUserProfileInfoByUsername(username: string) {
    const result = await db.$queryRaw<Array<UserProfileQuery>>(Prisma.sql`
        SELECT
            u.id,
            u.username,
            u.name,
            u.image,
            u.bio,
            u.email,
            u."displayEmailOnProfile",
            u."createdAt",
            u."brandColour",
            u."location",
            u."website",
            u."githubUrl",
            u."work",
            u."skillsLanguages",
            u."currentlyLearning",
            u."currentlyHackingOn",
            u."availableFor",

            -- Count of published posts
            (SELECT COUNT(*) FROM "Post" p WHERE p."userId" = u.id AND p.published = true) AS "postCount",

            -- Count of tags followed
            (SELECT COUNT(*) FROM "TagFollow" tf WHERE tf."userId" = u.id) AS "tagFollowCount",

            -- Count of comments made
            (SELECT COUNT(*) FROM "Comment" c WHERE c."userId" = u.id) AS "commentCount"

        FROM "User" u
        WHERE u.username = ${username}
        LIMIT 1;
    `);

    if (!result || result.length === 0) return null;

    return result[0];
}

export const oldGetUserProfileInfoByUsername = async (username: string) => {
    try {
        const user = await db.user.findUnique({
            select: {
                id: true,
                username: true,
                name: true,
                image: true,
                bio: true,
                email: true,
                displayEmailOnProfile: true,
                createdAt: true,
                brandColour: true,
                location: true,
                website: true,
                githubUrl: true,
                work: true,
                skillsLanguages: true,
                currentlyLearning: true,
                currentlyHackingOn: true,
                availableFor: true,
            },
            where: { username },
        });
        return user;
    } catch (error) {
        logError("getUserIdByUsername", error);
    }
};

const createUser = async (
    name: string,
    email: string,
    username: string,
    password: string,
) => {
    await db.user.create({
        data: {
            name,
            email,
            username,
            password,
        },
    });
};

export {
    getAccountByUserId,
    getUserById,
    getUserByEmail,
    updateUserPassword,
    createUser,
    generateUniqueUsername,
    getUserByUsername,
};
