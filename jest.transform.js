module.exports = require('babel-jest').default.createTransformer({
  presets: ['@babel/preset-env'],
  plugins: ['@babel/plugin-transform-runtime'],
  ignore: ['node_modules'],
});
