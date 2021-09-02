import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
    input: 'example.js',
    output: {
        file: 'public/bundle.js',
        format: 'umd',
        name: 'fissionDID',
        sourcemap: true
    },
    plugins: [nodeResolve()]
}
