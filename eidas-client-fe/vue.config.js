const { defineConfig } = require('@vue/cli-service')
module.exports = {
  publicPath: '/SP/',
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.pdf$/,
          use: [
            {
              loader: 'url-loader',
              // options: {
              //     name: 'files/[name].[hash:8].[ext]'
              // }
            }
          ]
        }
      ]
    }
  }
};
