import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
// import babel from 'rollup-plugin-babel';

export default {
  input: 'browser/src/main.js',
  output: {
    file: 'browser/bundle.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    nodeResolve({
      jsnext: true,
      main: true
    }),
    commonjs({
      include: 'node_modules/**'
    })
    //,
    // babel({
    //   exclude: 'node_modules/**',
    // }),
  ]
};
