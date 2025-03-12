import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import React, { Suspense } from "react";
import { Navbar } from "@/components/ui/navbar";
import Loading from "./(posts)/loading";
import Provider from "./provider";

export const metadata: Metadata = {
    title: "Dotdev",
    description: "Blog Posting Platform by Oliver Wood",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/site.webmanifest"
                />
                <link rel="manifest" href="/site.webmanifest" />
            </head>
            <body className={inter.className}>
                <Provider>
                    <Suspense fallback={<Loading />}>
                        <Navbar />
                    </Suspense>
                    {children}
                </Provider>
            </body>
        </html>
    );
}
