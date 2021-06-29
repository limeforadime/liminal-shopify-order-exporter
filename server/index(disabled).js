import babel from '@babel/register';
babel({
  presets: ['@babel/preset-env'],
  ignore: ['node_modules'],
});
console.log('in index.js, TEST');
// module.exports = require('./server');
// export { default as server } from './server';
