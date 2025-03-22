const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8081,
    allowedHosts: "all",
  },
  publicPath:
    process.env.NODE_ENV === "production" ? "/scanner-camera-web/" : "/",
});
