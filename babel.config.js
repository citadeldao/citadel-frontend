// process.env.VUE_CLI_BABEL_TRANSPILE_MODULES = true;
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    // exclude to split code and lazy load lib-citadel
    ['@babel/preset-env', { exclude: ['proposal-dynamic-import'] }],
  ],
};
