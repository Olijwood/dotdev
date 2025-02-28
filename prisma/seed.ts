import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    const existingUser = await prisma.user.findFirst();
    if (existingUser) {
        console.log("🌱 Database is already seeded");
        return;
    }

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
            title: "Second Post",
            slug: "second-post",
            content: post2content,
            published: true,
            userId: user2.id,
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
