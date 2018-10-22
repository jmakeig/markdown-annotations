const node = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
module.exports = {
  input: './index.js',
  output: [
    {
      name: 'test',
      format: 'iife',
      sourcemap: 'inline'
    }
  ],
  plugins: [node(), commonjs()]
};
