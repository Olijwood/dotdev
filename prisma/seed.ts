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
