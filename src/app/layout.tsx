import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { Main } from "@/components/ui/main";
import { Navbar } from "@/components/ui/navbar";
import Provider from "./provider";

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
                <Provider>
                    <Navbar />
                    <Main>{children}</Main>
                </Provider>
            </body>
        </html>
    );
}
