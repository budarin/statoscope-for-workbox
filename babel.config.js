const isTesting = process.env.NODE_ENV === 'test';
const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
    comments: true,
    presets: [
        [
            '@babel/preset-env',
            {
                loose: true,
                debug: false,
                modules: isTesting ? 'commonjs' : false,
                corejs: {
                    version: 3,
                    proposals: true,
                },
                useBuiltIns: 'usage',
            },
        ],
    ],
    plugins: [],
    env: {
        production: {
            plugins: ['@babel/plugin-transform-react-constant-elements'],
            ignore: ['**/*.test.tsx', '**/*.test.ts', '__snapshots__', '__tests__'],
        },
        development: {
            ignore: ['**/*.test.tsx', '**/*.test.ts', '__snapshots__', '__tests__'],
        },
        test: {
            ignore: ['__snapshots__'],
        },
    },
};
