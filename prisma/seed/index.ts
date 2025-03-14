import { PrismaClient } from "@prisma/client";
import { USER_DATA, POSTS_DATA, TAGS_DATA } from "./constants";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    console.log("🌱 Seeding tags...");
    await Promise.all(
        TAGS_DATA.map((tag) =>
            prisma.tag.upsert({
                where: { name: tag.name },
                update: {},
                create: tag,
            }),
        ),
    );
    console.log("✅ Tags seeded successfully.");

    console.log("🌱 Seeding users...");
    await Promise.all(
        USER_DATA.map((user) =>
            prisma.user.upsert({
                where: { id: user.id },
                update: {},
                create: user,
            }),
        ),
    );
    console.log("✅ Users seeded successfully.");

    const isPost = await prisma.post.findFirst({ select: { id: true } });
    if (isPost) {
        console.log("🌱 Posts already exist, skipping post seeding.");
    } else {
        console.log("🌱 Seeding posts, comments, reactions, and replies...");
        for (const post of POSTS_DATA) {
            const createdPost = await prisma.post.create({
                data: {
                    id: post.id,
                    title: post.title,
                    slug: post.slug,
                    content: post.content,
                    published: post.published,
                    userId: post.userId,
                    bannerImgUrl: post.bannerImgUrl,
                },
            });

            for (const tagName of post.tags) {
                const tag = await prisma.tag.upsert({
                    where: { name: tagName },
                    update: {},
                    create: {
                        name: tagName,
                        description: "",
                        color: "text-gray-600",
                    },
                });

                await prisma.postTag.upsert({
                    where: {
                        postId_tagId: {
                            postId: createdPost.id,
                            tagId: tag.id,
                        },
                    },
                    update: {},
                    create: {
                        postId: createdPost.id,
                        tagId: tag.id,
                    },
                });
            }

            for (const comment of post.comments) {
                const createdComment = await prisma.comment.create({
                    data: {
                        id: comment.id,
                        content: comment.content,
                        userId: comment.userId,
                        postId: createdPost.id,
                    },
                });

                if (comment.replies) {
                    for (const reply of comment.replies) {
                        await prisma.reply.create({
                            data: {
                                content: reply.content,
                                userId: reply.userId,
                                commentId: createdComment.id,
                            },
                        });
                    }
                }
            }

            await Promise.all(
                post.reactions.map((reaction) =>
                    prisma.reaction.create({
                        data: {
                            userId: reaction.userId,
                            postId: createdPost.id,
                            type: reaction.type,
                        },
                    }),
                ),
            );
        }
    }

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
