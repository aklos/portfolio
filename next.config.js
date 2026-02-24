/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        unoptimized: true,
    },
    turbopack: {
        rules: {
            '*.glsl': {
                loaders: ['raw-loader'],
                as: '*.js',
            },
        },
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
