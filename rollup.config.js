import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
// import uglify from 'rollup-plugin-uglify';
import replace from 'rollup-plugin-replace';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/annotate.js',
  output: {
    file: 'public/bundle.js',
    format: 'iife',
    name: 'App',
    sourcemap: true,
  },
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }), // tells Rollup how to find imports in node_modules
    commonjs(), // converts require() to ES modules
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    // production && uglify() // minify, but only in production
  ],
};
