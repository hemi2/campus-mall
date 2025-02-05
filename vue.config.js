const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,

  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:9527', // 服务器地址
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/api': '/api' // 重写路径
        }
      }
    }
  }


})
