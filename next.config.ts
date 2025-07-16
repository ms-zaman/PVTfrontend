import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "unsplash.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "via.placeholder.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "picsum.photos",
                port: "",
                pathname: "/**",
            },
            // Add other image hosting services as needed
            {
                protocol: "https",
                hostname: "example.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
    // Enable experimental features for better performance
    experimental: {
        optimizePackageImports: ["leaflet", "react-leaflet"],
    },
};

export default nextConfig;
