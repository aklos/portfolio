/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        unoptimized: true,
    },
    webpack: (config, {}) => {
        config.module.rules.push({
            test: /\.glsl/,
            type: "asset/source",
        });

        return config;
    },
};

module.exports = nextConfig;
