import type { NextConfig } from "next";

const isDev = process.env.STATIC_ENV === "development";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    experimental: {
        serverActions: {
            bodySizeLimit: "2mb",
        },
    },
    async headers() {
        return [
            {
                source: "/uploads/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
        ];
    },
    async rewrites() {
        if (isDev) {
            return [
                {
                    source: "/uploads/:path*",
                    destination: "http://localhost:3001/uploads/:path*",
                },
            ];
        }
        return [];
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "dotdev.olijwood.co.uk",
                pathname: "/uploads/**",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
        ],
    },
};

export default nextConfig;
