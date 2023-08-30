const css=require('rollup-plugin-css-only')
const resolve =require('@rollup/plugin-node-resolve')
const postcss  =require('rollup-plugin-postcss')
const {terser}=require('rollup-plugin-terser')
module.exports={
    input: 'src/index.js',
    output: {
        file: 'dist/console.js',
        format: 'umd',
        name: 'Console',
    },
    plugins: [
        resolve(),
        postcss({
            extract: false, // 将 CSS 提取为单独的文件
            minimize: true, // 压缩 CSS
            config: './postcss.config.js',
        }),
        terser()
    ],
};
