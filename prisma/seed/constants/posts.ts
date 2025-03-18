import type { ReactionType } from "@prisma/client";

type POST_DATA = {
    id: string;
    title: string;
    slug: string;
    bannerImgUrl?: string;
    content: string;
    published: boolean;
    userId: string;
    tags: string[];
    comments: {
        id: string;
        content: string;
        userId: string;
        replies?: {
            content: string;
            userId: string;
        }[];
    }[];
    reactions: {
        id?: string;
        type: ReactionType;
        userId: string;
    }[];
};

export const POSTS_DATA: POST_DATA[] = [
    {
        id: "3",
        title: "Why You Should Learn Go in 2025",
        slug: "learn-go-2025",

        content:
            "# **Why You Should Learn Go in 2025**\n\n" +
            "Go, also known as Golang, is an open-source, statically typed, compiled programming language designed for simplicity, efficiency, and scalability. Created by Google, Go has gained significant traction for backend development, microservices, and cloud-native applications.\n\n" +
            "## **Key Benefits of Go**\n\n" +
            "**1. Simplicity**\n" +
            "Go's syntax is clean and straightforward, making it an excellent choice for both beginners and experienced developers. Unlike verbose languages, Go emphasizes simplicity without compromising on performance.\n\n" +
            "**2. Performance**\n" +
            "Being a compiled language, Go delivers performance close to C and C++. It compiles to native machine code, enabling faster execution and efficient memory management.\n\n" +
            "**3. Concurrency Support**\n" +
            "Concurrency is baked into Go with its lightweight goroutines and channels. This makes Go perfect for building high-performance, scalable systems capable of handling thousands of tasks simultaneously.\n\n" +
            "**4. Strong Standard Library**\n" +
            "Go comes with a rich standard library that simplifies common programming tasks like handling HTTP requests, manipulating strings, and performing I/O operations.\n\n" +
            "## **Use Cases for Go**\n\n" +
            "- **Building APIs and Web Servers**: Frameworks like Gin and Echo make web development in Go a breeze.\n" +
            "- **Microservices Architecture**: Go's concurrency and low overhead make it ideal for distributed systems.\n" +
            "- **Cloud Services**: Tools like Docker and Kubernetes are written in Go, making it a natural fit for cloud-native development.\n" +
            "- **Command-line Tools**: Go's simplicity and cross-platform compilation make it great for CLI development.\n\n" +
            "## **Getting Started with Go**\n\n" +
            "Here's how you can initialize and run a simple Go project:\n\n" +
            "```bash\n" +
            "go mod init myproject\n" +
            "go run main.go\n" +
            "```\n\n" +
            'And here is a simple "Hello, World!" program in Go:\n\n' +
            "```go\n" +
            "package main\n\n" +
            'import "fmt"\n\n' +
            "func main() {\n" +
            '    fmt.Println("Hello, World!")\n' +
            "}\n" +
            "```\n\n" +
            "## **Why Learn Go in 2025?**\n\n" +
            "The demand for scalable backend systems continues to grow. Go’s simplicity, performance, and modern tooling make it a strong contender for future development needs. Whether you're diving into microservices or building fast APIs, Go offers the tools you need to succeed.\n\n" +
            '> "Go is simple, but not simplistic. It is powerful yet readable, making it an excellent language for developers to master in 2025 and beyond."\n\n' +
            "Start your Go journey today and embrace the future of backend development!",
        published: true,
        userId: "3",
        tags: ["go", "backend", "devops", "beginners"],
        reactions: [
            {
                userId: "3",
                type: "HEART",
            },
            {
                userId: "1",
                type: "CLAP",
            },
            {
                userId: "4",
                type: "THUMBS_UP",
            },
            {
                userId: "5",
                type: "FIRE",
            },
        ],
        comments: [
            {
                id: "comment-4",
                content: "I'm learning a lot about Go from this post!",
                userId: "3",
            },
            {
                id: "comment-5",
                content: "This is a great post on Go development!",
                userId: "1",
            },
        ],
    },
    {
        id: "4",
        title: "Deploying Full-Stack Apps with Docker",
        slug: "docker-fullstack-deploy",
        content: `# **Deploying Full-Stack Apps with Docker**
        
        Docker has revolutionized how applications are deployed, making it easier to containerize, distribute, and scale software.
        
        ## **Why Docker?**
        - **Portability**: Docker containers can run consistently across different environments.
        - **Scalability**: Easily scale applications using Docker Compose or Swarm.
        - **Isolation**: Avoid conflicts by isolating applications in separate containers.
        
        ## **How to Dockerize a Full-Stack App**
        
        1. **Create Dockerfile for Backend**
        \`\`\`dockerfile
        FROM node:14
        WORKDIR /app
        COPY package.json .
        RUN npm install
        COPY . .
        CMD ["npm", "start"]
        \`\`\`
        
        2. **Create Dockerfile for Frontend**
        \`\`\`dockerfile
        FROM node:14
        WORKDIR /app
        COPY package.json .
        RUN npm install
        COPY . .
        CMD ["npm", "start"]
        \`\`\`
        
        3. **Docker Compose for Multi-Container Setup**
        \`\`\`yaml
        version: '3'
        services:
        backend:
        build: ./backend
        ports:
        - "5000:5000"
        frontend:
        build: ./frontend
        ports:
        - "3000:3000"
        \`\`\`
        
        Docker simplifies the deployment process, making it the perfect choice for modern development workflows.`,
        published: true,
        userId: "4",
        tags: ["docker", "devops", "webdev"],
        reactions: [
            {
                userId: "4",
                type: "HEART",
            },
            {
                userId: "1",
                type: "CLAP",
            },
            {
                userId: "3",
                type: "THUMBS_UP",
            },
        ],
        comments: [
            {
                id: "comment-6",
                content: "This is a great post on Docker deployment!",
                userId: "1",
                replies: [
                    {
                        content: "Thanks! Glad you found it useful!",
                        userId: "4",
                    },
                ],
            },
        ],
    },
    {
        id: "5",
        title: "GraphQL vs REST: Which API Style Should You Choose?",
        slug: "graphql-vs-rest",
        content:
            "# **GraphQL vs REST: Which API Style Should You Choose?**\n\n" +
            "APIs are the cornerstone of modern web and mobile applications. Two prominent styles—**REST** and **GraphQL**—are frequently used, but which is better for your project?\n\n" +
            "## **What is REST?**\n" +
            "REST (Representational State Transfer) is an architectural style where each resource is identified by a URL, and standard HTTP methods (GET, POST, PUT, DELETE) are used to interact with these resources. It is widely adopted and offers simplicity and scalability.\n\n" +
            "## **What is GraphQL?**\n" +
            "GraphQL is a query language for APIs that enables clients to request exactly the data they need. Unlike REST, it minimizes over-fetching and under-fetching by allowing fine-grained control over responses.\n\n" +
            "## **Key Differences**\n\n" +
            "| Feature          | REST                      | GraphQL                              |\n" +
            "|------------------|---------------------------|--------------------------------------|\n" +
            "| Data Fetching    | Fixed endpoints, possible over-fetching | Flexible, client decides data needs |\n" +
            "| Performance      | Can be slower due to multiple round trips | Single query reduces requests      |\n" +
            "| Learning Curve   | Easier and more traditional | Steeper due to custom schemas        |\n" +
            "| Caching          | Built-in with HTTP caching | Requires custom caching strategies   |\n" +
            "| Tooling Support  | Mature, broad adoption     | Evolving but modern and powerful     |\n\n" +
            "## **When to Use REST?**\n" +
            "- If simplicity and widespread adoption are key.\n" +
            "- When HTTP caching is critical for performance.\n" +
            "- When APIs are small and don’t require flexible querying.\n\n" +
            "## **When to Use GraphQL?**\n" +
            "- If clients require flexible queries and fine-grained data.\n" +
            "- For complex applications with diverse frontend requirements.\n" +
            "- When minimizing round trips is a priority.\n\n" +
            "## **Example: Fetching User Data**\n\n" +
            "**REST:**\n" +
            "```http\n" +
            "GET /users/1\n" +
            '{ "id": 1, "name": "Alice", "posts": [101, 102] }\n' +
            "```\n\n" +
            "**GraphQL:**\n" +
            "```graphql\n" +
            "{\n" +
            "  user(id: 1) {\n" +
            "    name\n" +
            "    posts {\n" +
            "      title\n" +
            "      content\n" +
            "    }\n" +
            "  }\n" +
            "}\n" +
            "```\n\n" +
            "## **Conclusion**\n\n" +
            "Both REST and GraphQL have their place in modern development. If simplicity and caching are paramount, REST is a safe choice. If flexibility and efficiency are priorities, GraphQL may better suit your needs.\n\n" +
            '> "Choose the tool that best aligns with your project requirements and developer expertise."\n\n' +
            "Ultimately, understanding the strengths and trade-offs of each approach will help you build robust, efficient APIs.",
        published: true,
        userId: "1",
        tags: ["graphql", "api", "webdev"],
        reactions: [
            {
                userId: "1",
                type: "HEART",
            },
            {
                userId: "2",
                type: "CLAP",
            },
        ],
        comments: [
            {
                id: "comment-7",
                content: "I'm learning a lot from this post!",
                userId: "1",
                replies: [
                    {
                        content: "Thanks! Glad you found it useful!",
                        userId: "4",
                    },
                ],
            },
        ],
    },
    {
        id: "6",
        title: "Introduction to Rust for Web Developers",
        slug: "rust-web-introduction",
        content:
            "# **Introduction to Rust for Web Developers**\n\n" +
            "Rust is a systems programming language known for safety, speed, and concurrency. Although often associated with low-level system development, Rust is making waves in web development as well.\n\n" +
            "## **Why Rust for Web?**\n\n" +
            "- **Memory Safety**: Rust's strict compile-time checks eliminate common bugs like null pointer dereferencing.\n" +
            "- **High Performance**: Rust is compiled directly to machine code, ensuring blazing-fast execution.\n" +
            "- **Modern Tooling**: Cargo, Rust's package manager, simplifies project setup and dependency management.\n\n" +
            "## **Web Frameworks in Rust**\n" +
            "- **Rocket**: An easy-to-use, high-level web framework for rapid development.\n" +
            "- **Actix**: A highly performant and flexible framework, ideal for complex systems and APIs.\n\n" +
            "## **Getting Started with Rocket**\n" +
            "```rust\n" +
            "#[macro_use] extern crate rocket;\n\n" +
            '#[get("/")]\n' +
            "fn index() -> &'static str {\n" +
            '    "Hello, Rustaceans!"\n' +
            "}\n\n" +
            "fn main() {\n" +
            '    rocket::ignite().mount("/", routes![index]).launch();\n' +
            "}\n" +
            "```\n\n" +
            "## **Why Rust is the Future of Web Development**\n" +
            "- **WASM Support**: Rust compiles to WebAssembly, enabling high-performance web apps.\n" +
            "- **Growing Ecosystem**: Frameworks and libraries are evolving rapidly.\n" +
            "- **Secure by Default**: Rust's strict safety guarantees reduce runtime errors and security vulnerabilities.\n\n" +
            '> "Rust brings the performance of C with the safety of high-level languages. It\'s the perfect language for developers seeking both speed and reliability."\n',
        published: true,
        userId: "2",
        tags: ["rust", "backend", "webdev"],
        reactions: [
            {
                userId: "1",
                type: "HEART",
            },
            {
                userId: "2",
                type: "CLAP",
            },
        ],
        comments: [
            {
                id: "comment-8",
                content: "Is Rust really a good choice for web development?",
                userId: "2",
                replies: [
                    {
                        content:
                            "Yes, it's a great choice for web development! It's fast, secure, and has a growing ecosystem.",
                        userId: "4",
                    },
                ],
            },
        ],
    },
    {
        id: "1",
        title: "Mastering RESTful API Design",
        slug: "restful-api-design",
        bannerImgUrl: "/seed/restful-post-banner.jpg",
        content:
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
            "> — REST API Best Practices",
        published: true,
        userId: "1",
        tags: ["webdev", "api"],
        comments: [
            {
                id: "comment-1",
                content: "This is a great post on RESTful API design!",
                userId: "2",
                replies: [
                    {
                        content: "Thanks! Glad you found it useful!",
                        userId: "1",
                    },
                ],
            },
        ],
        reactions: [
            {
                userId: "3",
                type: "FIRE",
            },
            {
                userId: "4",
                type: "CLAP",
            },
        ],
    },
    {
        id: "2",
        title: "The Art of Clean Code",
        slug: "the-art-of-clean-code",
        content:
            "# **The Art of Clean Code** \n" +
            " Writing clean, maintainable, and efficient code is an essential skill for every developer. In this post, we'll explore best practices that will help you improve the readability and structure of your code.\n" +
            "## **Why Clean Code Matters** \n" +
            `Messy code leads to:
- **Harder debugging**
- **Slower development**
- **Increased technical debt**
- **Poor collaboration in teams** \n\n` +
            `On the other hand, clean code:
- **Is easier to read and maintain** ✅
- **Reduces bugs and errors** 🔍
- **Improves collaboration among developers** 👥 \n\n` +
            "## **Principles of Clean Code** \n" +
            "Here are some key principles to follow when writing clean code: \n" +
            "### **1️⃣ Use Meaningful Variable & Function Names** \n" +
            "❌ **Bad:** \n" +
            "```js\n" +
            "let a = 10;\n" +
            "function x(y) {\n" +
            "    return y * 2;\n" +
            "}\n" +
            "```\n\n" +
            "✅ **Better:** \n" +
            "```js\n" +
            "let userAge = 10;\n" +
            "function doubleValue(number) {\n" +
            "    return number * 2;\n" +
            "}\n" +
            "```\n\n" +
            "### **5️⃣ Use DRY (Don't Repeat Yourself)** \n" +
            "Repeating the same logic in multiple places leads to maintenance nightmares. \n" +
            "### **Quotes on Clean Code** \n" +
            `> "Programs must be written for people to read, and only incidentally for machines to execute."
— Harold Abelson`,
        published: true,
        userId: "2",
        bannerImgUrl: "/seed/clean-post-banner.jpg",
        tags: ["programming", "beginners", "javascript"],
        comments: [
            {
                id: "comment-2",
                content: "Great insights on writing clean code!",
                userId: "1",
                replies: [
                    {
                        content: "Appreciate it! Clean code is a craft.",
                        userId: "2",
                    },
                    {
                        content: "Agreed!",
                        userId: "3",
                    },
                ],
            },
            {
                id: "comment-3",
                content: "I'm learning a lot from this post!",
                userId: "3",
            },
        ],
        reactions: [
            {
                userId: "3",
                type: "HEART",
            },
            {
                userId: "1",
                type: "CLAP",
            },
            {
                userId: "4",
                type: "THUMBS_UP",
            },
            {
                userId: "5",
                type: "FIRE",
            },
        ],
    },
];
