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
                source: "/uploads/:path*",
                destination: "/uploads/:path*",
            },
            {
                source: "/:path*",
                destination: "/:path*",
            },
        ];
    },
    images: {
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
