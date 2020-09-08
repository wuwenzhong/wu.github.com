'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}
const webpack = require('webpack')

const NAME = process.env.VUE_APP_NAME || '财智未来综合实训平台' // 标题

const PORT = process.env.VUE_APP_PORT || 32005 // 端口

const TerserPlugin = require('terser-webpack-plugin') // 去掉console的插件

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    host: '127.0.0.1',
    port: PORT,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://129.211.171.155:20002',
        changeOrigin: true
        // pathRewrite: {
        //   ['^' + process.env.VUE_APP_BASE_API]: ''
        // }
      }
    },
    disableHostCheck: true
  },
  configureWebpack: {
    name: NAME,
    resolve: {
      alias: {
        '@': resolve('src'),
        common: resolve('src/common'),
        api: resolve('src/api'),
        public: resolve('public')
      }
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          sourceMap: false,
          terserOptions: {
            compress: {
              drop_console: true
            }
          }
        })
      ]
    }
  },
  chainWebpack(config) {
    config.plugin('provide').use(webpack.ProvidePlugin, [{
      'window.Quill': 'quill'
    }])
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/common/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/common/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-module-eval-source-map')
      )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
          // 内联runtimeChunk生成的映射文件
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              inline: /runtime\..*\.js$/
            }])
            .end()
        }
      )
  },
  css: {
    loaderOptions: {
      sass: {
        implementation: require('node-sass'),
        data: `
          @import "common/css/variable.scss";
          @import "common/css/mixin.scss";
        `
      }
    }
  }
}
