module.exports={
    publicPath: process.env.NODE_ENV === 'production'? './': '/',
    devServer: {
        proxy: {
          '/api': {
            target: 'http://127.0.0.1:7001/',
            ws: true,
            changeOrigin: true,
            pathRewrite: {
              '^/api': ''   //需要rewrite的,
            } 
          },
        }
    }
}