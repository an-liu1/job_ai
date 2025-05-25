const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@/assets/scss/_variables.scss";`,
      },
    },
  },
  devServer: {
    proxy: {
      "/api": {
        target: "https://jobace.ca", // 目标 API 服务器地址
        changeOrigin: true, // 允许跨域
        pathRewrite: {
          "^/api": "", // 重写路径，去掉请求路径中的 /api
        },
      },
      "/media": {
        target: "https://jobace.ca",
        changeOrigin: true,
        pathRewrite: {
          "^/media": "/media",
        },
      },
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule("wav")
      .test(/\.wav$/)
      .use("file-loader")
      .loader("file-loader")
      .options({
        name: "[name].[ext]",
        outputPath: "assets/", // 可选，指定输出路径
      })
      .end();
  },
});
