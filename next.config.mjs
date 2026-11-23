/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        outputFileTracingIncludes: {
            "/api/todos": ["./prisma/dev.db"],
            "/api/todos/*": ["./prisma/dev.db"],
        },
    },
};

export default nextConfig;
