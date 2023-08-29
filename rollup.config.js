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
        // 处理 CSS 文件
        // css({ minimize:true}),
        resolve(),
        postcss({
            extract: false, // 将 CSS 提取为单独的文件
            minimize: true, // 压缩 CSS
            // 可选：指定 PostCSS 配置文件的路径
            config: './postcss.config.js',
            // 可选：自定义 PostCSS 插件或配置
            // plugins: [autoprefixer(), cssnano()]
        }),
        terser()
    ],
};
