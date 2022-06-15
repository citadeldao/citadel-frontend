const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  parallel: false,
  lintOnSave: process.env.NODE_ENV !== 'production',
  runtimeCompiler: true,
  transpileDependencies: ['@citadeldao/lib-citadel', '@polkadot'],
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();
    svgRule.delete('type');
    svgRule.delete('generator');

    svgRule
      .use('vue-loader')
      .loader('vue-loader-v16')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader');
  },
  configureWebpack: {
    devServer: {
      // overlay: false,
    },
    plugins: [new NodePolyfillPlugin()],

    module: {
      rules: [
        {
          test: /\.js$/,
          loader: require.resolve('@open-wc/webpack-import-meta-loader'),
        },
      ],
    },
    devtool: 'source-map',
  },
  devServer: {
    https: true,
  },
  productionSourceMap: process.env.NODE_ENV !== 'production',
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/assets/styles/_variables.scss";
          @import "@/assets/styles/_colors.scss";
          @import "@/assets/styles/mixins/index.scss";
        `,
      },
    },
  },
};
