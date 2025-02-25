import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    experimental: {
        serverActions: {
            bodySizeLimit: "2mb",
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
        ],
    },
};

export default nextConfig;
