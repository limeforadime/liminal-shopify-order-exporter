module.exports = require('babel-jest').default.createTransformer({
  presets: ['@babel/preset-env'],
  ignore: ['node_modules'],
});
