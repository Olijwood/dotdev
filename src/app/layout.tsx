import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import Main from "@/components/main";

export const metadata: Metadata = {
    title: "Dotdev",
    description: "Blog Posting Platform by Olijwood",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Header />
                <Main>{children}</Main>
            </body>
        </html>
    );
}
