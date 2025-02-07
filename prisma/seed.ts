import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Create Users
    const user1 = await prisma.user.upsert({
        where: { email: "user1@example.com" },
        update: {},
        create: {
            name: "User One",
            email: "user1@example.com",
            username: "userone",
            password: "hashedpassword1",
            role: "USER",
        },
    });

    const user2 = await prisma.user.upsert({
        where: { email: "user2@example.com" },
        update: {},
        create: {
            name: "User Two",
            email: "user2@example.com",
            username: "usertwo",
            password: "hashedpassword2",
            role: "USER",
        },
    });

    const user3 = await prisma.user.upsert({
        where: { email: "user3@example.com" },
        update: {},
        create: {
            name: "User Three",
            email: "user3@example.com",
            username: "userthree",
            password: "hashedpassword3",
            role: "USER",
        },
    });

    const user4 = await prisma.user.upsert({
        where: { email: "user4@example.com" },
        update: {},
        create: {
            name: "User Four",
            email: "user4@example.com",
            username: "userfour",
            password: "hashedpassword4",
            role: "USER",
        },
    });

    const user5 = await prisma.user.upsert({
        where: { email: "user5@example.com" },
        update: {},
        create: {
            name: "User Five",
            email: "user5@example.com",
            username: "userfive",
            password: "hashedpassword5",
            role: "USER",
        },
    });

    // Create Posts
    const post1 = await prisma.post.create({
        data: {
            title: "First Post",
            slug: "first-post",
            content: "This is the first post content.",
            published: true,
            userId: user1.id,
        },
    });

    const post2 = await prisma.post.create({
        data: {
            title: "Second Post",
            slug: "second-post",
            content: "This is the second post content.",
            published: true,
            userId: user2.id,
        },
    });

    const post3 = await prisma.post.create({
        data: {
            title: "Third Post",
            slug: "third-post",
            content: "This is the third post content.",
            published: true,
            userId: user3.id,
        },
    });

    const post4 = await prisma.post.create({
        data: {
            title: "Fourth Post",
            slug: "fourth-post",
            content: "This is the fourth post content.",
            published: true,
            userId: user4.id,
        },
    });

    const post5 = await prisma.post.create({
        data: {
            title: "Fifth Post",
            slug: "fifth-post",
            content: "This is the fifth post content.",
            published: true,
            userId: user5.id,
        },
    });

    // Create Reactions
    await prisma.reaction.create({
        data: {
            userId: user1.id,
            postId: post1.id,
            type: "HEART",
        },
    });

    await prisma.reaction.create({
        data: {
            userId: user2.id,
            postId: post2.id,
            type: "CLAP",
        },
    });

    await prisma.reaction.create({
        data: {
            userId: user3.id,
            postId: post3.id,
            type: "HEART",
        },
    });

    await prisma.reaction.create({
        data: {
            userId: user4.id,
            postId: post4.id,
            type: "CLAP",
        },
    });

    await prisma.reaction.create({
        data: {
            userId: user5.id,
            postId: post5.id,
            type: "HEART",
        },
    });

    console.log("✅ Seeding complete!");
}

main()
    .catch((e) => {
        console.error("❌ Error seeding the database:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
