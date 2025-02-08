import db from "@/lib/db";

// Fetch all posts with user, comment count, and reaction count
export async function getPosts() {
    const posts = await db.post.findMany({
        include: {
            user: { select: { username: true, image: true } },
            comments: true,
            reactions: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return posts.map((post) => ({
        ...post,
        username: post.user.username ?? "Guest",
        image: post.user.image ?? "/hacker.png",
        commentCount: post.comments.length || 0,
        reactionCount: post.reactions.length || 0,
    }));
}

// Fetch a single post by slug
export async function getPostBySlug(slug: string) {
    return await db.post.findUnique({
        where: { slug },
        include: {
            user: { select: { username: true, image: true, createdAt: true } },
            comments: true,
            reactions: true,
        },
    });
}

export async function getPostById(id: string) {
    return await db.post.findUnique({
        where: { id },
        include: {
            user: { select: { username: true, image: true, createdAt: true } },
            comments: true,
            reactions: true,
        },
    });
}

export async function getJustPostById(id: string) {
    return await db.post.findUnique({
        where: { id },
    });
}

export async function togglePostCount(
    id: string,
    increment: boolean,
    field: "reactionCount" | "commentCount" | "saveCount",
) {
    return await db.post.update({
        where: { id },
        data: {
            [field]: increment ? { increment: 1 } : { decrement: 1 },
        },
    });
}
