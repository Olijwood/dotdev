import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    experimental: {
        serverActions: {
            bodySizeLimit: "2mb",
        },
    },
    async rewrites() {
        return [
            {
                source: "/assets/:path*",
                destination: "http://localhost:4001/assets/:path*",
            },
        ];
    },
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "dotdev.olijwood.co.uk",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
        ],
    },
};

export default nextConfig;
