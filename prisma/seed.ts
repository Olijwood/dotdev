import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Create Users
    // TODO: Remove my personal info
    const user1 = await prisma.user.upsert({
        where: { email: "user1@gmail.com" },
        update: {},
        create: {
            name: "User One",
            email: "user1@gmail.com",
            username: "user1",
            password: "password",
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

    const post1content =
        'RESTful API (Representational State Transfer API) is a network interface design style used for interactions between network applications. REST is a set of architectural principles and constraints rather than a standard or protocol. When a web service is "RESTful," it follows REST principles and provides an efficient, reliable, and scalable network service.\n\n' +
        "In a RESTful service, each request should contain all the necessary information to process the request. The server should not retain any state information about client requests.\n\n" +
        "A RESTful architecture may consist of multiple layers, each performing a specific function. This structure allows for the development of more complex and powerful applications.\n\n" +
        "# **URI Design**\n\n" +
        "In RESTful API design, URLs (Uniform Resource Locators) typically represent resources (objects), while HTTP methods (such as GET, POST, PUT, DELETE, etc.) represent operations on these resources (verbs). This design style emphasizes the state and representation of resources rather than actions.\n\n" +
        "## **Verb + Object**\n\n" +
        "Verbs in RESTful APIs are usually the five HTTP methods, corresponding to CRUD operations:\n\n" +
        "- **GET**: Read  \n" +
        "- **POST**: Create  \n" +
        "- **PUT**: Update  \n" +
        "- **PATCH**: Partial Update  \n" +
        "- **DELETE**: Delete  \n\n" +
        "According to the HTTP specification, verbs should always be in uppercase.\n\n" +
        '> "A well-designed RESTful API —SHOULD be intuitive and predictable, making it easier for developers to integrate seamlessly."\n>\n' +
        "> — REST API Best Practices";

    // Create Posts
    const post1 = await prisma.post.create({
        data: {
            title: "Mastering Restful API Design",
            slug: "restful-api-design",
            content: post1content,
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
