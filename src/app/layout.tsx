import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { Header } from "@/components/ui/header";
import { Main } from "@/components/ui/main";
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
                    <Header />
                    <Main>{children}</Main>
                </Provider>
            </body>
        </html>
    );
}
