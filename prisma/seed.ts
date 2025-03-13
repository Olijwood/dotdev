import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TOP_TAGS = [
    {
        name: "webdev",
        description: "Because the internet...",
        color: "text-blue-600",
        badge: "",
    },
    {
        name: "programming",
        description: "The magic behind computers. 💻 ✨",
        color: "text-purple-600",
        badge: "",
    },
    {
        name: "javascript",
        description: "JavaScript is everywhere.",
        color: "text-yellow-600",
        badge: "JS",
    },
    {
        name: "react",
        description: "A JavaScript library for building user interfaces.",
        color: "text-blue-500",
        badge: "",
    },
    {
        name: "beginners",
        description:
            '"A journey of a thousand miles begins with a single step." -Chinese Proverb',
        color: "text-green-600",
        badge: "",
    },
    {
        name: "python",
        description: "A versatile programming language.",
        color: "text-blue-700",
        badge: "",
    },
    {
        name: "tailwindcss",
        description: "A utility-first CSS framework.",
        color: "text-cyan-600",
        badge: "",
    },
    {
        name: "ai",
        description: "Artificial Intelligence and Machine Learning.",
        color: "text-green-500",
        badge: "",
    },
    {
        name: "css",
        description: "Cascading Style Sheets: the styling language of the web.",
        color: "text-pink-500",
        badge: "",
    },
    {
        name: "html",
        description: "The markup language of the web.",
        color: "text-orange-600",
        badge: "",
    },
    {
        name: "typescript",
        description: "JavaScript with syntax for types.",
        color: "text-blue-600",
        badge: "TS",
    },
    {
        name: "node",
        description: "Server-side JavaScript runtime.",
        color: "text-green-700",
        badge: "",
    },
];

async function main() {
    console.log("🌱 Seeding database...");
    console.log("🌱 Seeding tags...");

    await Promise.all(
        TOP_TAGS.map((tag) =>
            prisma.tag.upsert({
                where: { name: tag.name },
                update: {},
                create: tag,
            }),
        ),
    );
    console.log("✅ Tags seeded successfully.");
    // try {
    //     for (const tag of TOP_TAGS) {
    //         await prisma.tag.upsert({
    //             where: { name: tag.name },
    //             update: {
    //                 description: tag.description,
    //                 color: tag.color,
    //                 badge: tag.badge || null,
    //             },
    //             create: {
    //                 name: tag.name,
    //                 description: tag.description,
    //                 color: tag.color,
    //                 badge: tag.badge || null,
    //             },
    //         });
    //     }

    //     console.log("✅ Tags seeded successfully.");
    // } catch (error) {
    //     console.error("❌ Error seeding tags:", error);
    // }

    const existingUser = await prisma.user.findFirst();
    if (existingUser) {
        console.log("🌱 Database is already seeded");
        return;
    }

    const allTags = await prisma.tag.findMany();

    // Create Users
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

    const existingPost = await prisma.post.findFirst();
    if (existingPost) {
        console.log("🌱 Database is already seeded");
        return;
    }

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
            tags: {
                create: allTags.slice(0, 3).map((tag) => ({
                    tagId: tag.id,
                })),
            },
        },
    });
    const post2content = `# **The Art of Clean Code**

Writing clean, maintainable, and efficient code is an essential skill for every developer. In this post, we'll explore best practices that will help you improve the readability and structure of your code.

## **Why Clean Code Matters**

Messy code leads to:
- **Harder debugging**
- **Slower development**
- **Increased technical debt**
- **Poor collaboration in teams**

On the other hand, **clean code**:
- Is easier to read and maintain ✅
- Reduces bugs and errors 🔍
- Improves collaboration among developers 👥

## **Principles of Clean Code**

Here are some key principles to follow when writing clean code:

### **1️⃣ Use Meaningful Variable & Function Names**

❌ Bad:

\`\`\`js
let a = 10;
function x(y) {
    return y * 2;
}
\`\`\`

✅ Better:

\`\`\`js
let userAge = 10;
function doubleValue(number) {
    return number * 2;
}
\`\`\`

Names should clearly describe what the variable or function does.

### **2️⃣ Keep Functions Small**

Each function should do one thing and do it well.

❌ Bad: A function that does too much

\`\`\`js
function processUser(user) {
    console.log("Processing user...");
    user.isActive = true;
    sendWelcomeEmail(user.email);
    saveToDatabase(user);
}
\`\`\`

✅ Better: Break functions into smaller pieces

\`\`\`js
function activateUser(user) {
    user.isActive = true;
}

function notifyUser(email) {
    sendWelcomeEmail(email);
}

function saveUser(user) {
    saveToDatabase(user);
}
\`\`\`

### **3️⃣ Follow Consistent Formatting**

Use consistent indentation, spacing, and line breaks to improve readability.

\`\`\`js
if (isLoggedIn) {
    console.log("Welcome back!");
} else {
    console.log("Please log in.");
}
\`\`\`

### **4️⃣ Avoid Unnecessary Comments**

❌ Bad: Commenting obvious things

\`\`\`js
// Loop through the array
for (let i = 0; i < items.length; i++) {
    console.log(items[i]); // Print item to console
}
\`\`\`

✅ Better: Use clear code instead of excessive comments

\`\`\`js
items.forEach(item => console.log(item));
\`\`\`

### **5️⃣ Use DRY (Don't Repeat Yourself)**

Repeating the same logic in multiple places leads to maintenance nightmares.

❌ Bad:

\`\`\`js
function getAdmin() {
    return fetch("https://api.example.com/admins").then(res => res.json());
}

function getUsers() {
    return fetch("https://api.example.com/users").then(res => res.json());
}
\`\`\`

✅ Better: Use a reusable function

\`\`\`js
function fetchData(endpoint) {
    return fetch(\`https://api.example.com/\${endpoint}\`).then(res => res.json());
}
\`\`\`

### **Quotes on Clean Code**

"Programs must be written for people to read, and only incidentally for machines to execute."
— Harold Abelson

"Any fool can write code that a computer can understand. Good programmers write code that humans can understand."
— Martin Fowler

### **Further Reading**

📌 Clean Code by Robert C. Martin
📌 The Pragmatic Programmer

### **Final Thoughts**

Writing clean code is a skill that takes time to develop. Start applying these principles today, and soon it will become second nature. Happy coding! 🚀`;

    const post2 = await prisma.post.create({
        data: {
            title: "Art of Clean Code",
            slug: "the-art-of-clean-code",
            content: post2content,
            published: true,
            userId: user2.id,
            tags: {
                create: allTags.slice(3, 6).map((tag) => ({
                    tagId: tag.id,
                })),
            },
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
            userId: user1.id,
            postId: post2.id,
            type: "FIRE",
        },
    });

    // Create Comments
    const comment1 = await prisma.comment.create({
        data: {
            content: "I hope you like this post!",
            userId: user1.id,
            postId: post1.id,
        },
    });

    await prisma.comment.create({
        data: {
            content: "Great Post!",
            userId: user2.id,
            postId: post1.id,
        },
    });

    // Create Reply

    await prisma.reply.create({
        data: {
            content: "Thanks for the feedback!",
            userId: user1.id,
            commentId: comment1.id,
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
