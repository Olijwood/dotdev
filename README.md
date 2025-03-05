# DotDev

Welcome to **DotDev**, a blog-sharing platform inspired by [dev.to](https://dev.to) and built using **Next.js 19, React, Prisma, and TailwindCSS**!

🔗 **Live Website**: [https://dotdev.olijwood.co.uk](https://dotdev.olijwood.co.uk)

## 🚀 Introduction

DotDev is a modern blogging platform where developers can share, comment, react to, and discover informative blog posts about software engineering.  
With Markdown support, users can create posts with custom formatting, including images, links, and code snippets, adding their unique flair to each post.

---

## ✨ Features

### 🔑 User Authentication

- Powered by **NextAuth.js** with support for OAuth (Google, GitHub) and credentials-based authentication.
- Email verification is required for credentials-based signups.
- Includes **password reset emails** and **two-factor authentication (2FA)** for added security.

### 📝 Post Management

- Users can **Create, Read, Update, and Delete (CRUD)** posts seamlessly.
- Posts display user reactions, bookmarks, and metadata in real-time.
- Uses **Prisma, PostgreSQL, and Next.js Server Actions** for efficient backend operations.

### 📚 Reading List

- Bookmark posts for later and access them from your **profile dropdown**.

### ✍️ Markdown Support

- Users can write posts and comments using **Markdown**.
- A custom-built **Markdown toolbar** provides easy access to formatting options like **bold, italic, links, headings, images, and more**.

### 👀 Live Markdown Preview

- Instantly preview your formatted Markdown content before publishing.
- Uses **ReactMarkdown** for rendering.

### ⚡ Dynamic Form Handling

- **Seamless post creation & updating** using a single form component.
- Advanced toolbar features include **Live View** and **Publish** options.

### 🎭 Reactions

- Users can react to posts using **emoji popups**, with real-time updates on reaction counts.

### 💬 Comments & Replies

- Users can comment on posts, like comments, and reply to others.

### 📱 Responsive Design

- **Fully mobile-friendly** using TailwindCSS breakpoints.
- On mobile, the toolbar appears at the **bottom**; on larger screens, it's positioned on the **left**.

### 🔒 Middleware Protection

- Prevents unauthorized users from accessing private routes.

### 🖼️ Image Uploads

- Users can upload images to posts.
- Uses **Dokku persistent storage**, ensuring images remain accessible.

### ✅ Automated Testing on Commits

- Uses **Husky** to **lint, check types, and run tests** before every commit.
- Blocks commits if any tests fail, maintaining code quality.

### 🧪 Testing Suite

- **Unit & Integration Testing** using **Vitest** and **React Testing Library**.
- **Mock data** handled via `ngneat/falso`.
- Planned: **Playwright for E2E tests** and **Mock Service Worker (MSW) for API mocks**.

---

## 🛠️ Technologies Used

- **Next.js 19** – Full-stack React framework.
- **React** – Component-based UI library.
- **TypeScript** – Statically typed JavaScript.
- **TailwindCSS** – Utility-first styling.
- **NextAuth.js** – Authentication without third-party SaaS.
- **Vitest / Testing Library / Ngneat** – Testing tools.
- **Prisma & PostgreSQL** – Database ORM and relational database.
- **Mailer (Resend API)** – Handles email verification, password resets, and 2FA.

---

## 🛠️ Local Development Setup

### 📥 Clone the Repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/dotdev.git
cd dotdev
```

### 📦 Install Dependencies

```
yarn install
# or
npm install
```

### 🔑 Set Up Environment Variables

Create a **.env** file in the root directory and add the following variables:

```
# Database
POSTGRES_URL=your_postgres_database_url

# NextAuth
AUTH_SECRET=randomly_generated_uuid
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_URL_INTERNAL=http://localhost:3000

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_id
GITHUB_SECRET=your_github_secret

# Mailer (Resend API)
RESEND_API_KEY=your_resend_api_key
```

### 🗃️ Database Setup

Run the following command to apply migrations and seed the database:

```
yarn dbinit
# or
npx run dbinit
```

### 🚀 Start the Development Server

```
yarn dev
# or
npx run dev
```

🔗 Open your browser and visit: [http://localhost:3000](http://localhost:3000)

---

## 🤝 Contributing

Contributions are **welcome**! If you’d like to suggest features, improvements, or bug fixes, please:

- Open an **issue**
- Submit a **pull request**

Please ensure your contributions follow best practices and include necessary tests where applicable.

---

## 👨‍💻 About the Author

DotDev is maintained by **Oliver Wood**.

**📎 Connect with me:**

- **LinkedIn**: [https://www.linkedin.com/in/olijwood](https://www.linkedin.com/in/olijwood/)
- **Portfolio**: [https://www.olijwood.co.uk](https://www.olijwood.co.uk)

---

## 🎉 Thanks for Exploring DotDev!

We hope you enjoy exploring, sharing, and discovering insightful software development blogs.
Happy coding! 🚀💻
