const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,

  devServer: {
    proxy: {
      '/api': { // 被代理的接口名
        target: 'http://localhost:9090', // url地址
        changeOrigin: true, // 发送请求头中 host 是否设置成 target
        pathRewrite: { // 重定向
          '^/api': ''
        }
      }
    }
  },

})
