import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
// import uglify from 'rollup-plugin-uglify';

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
    resolve(), // tells Rollup how to find imports in node_modules
    commonjs(), // converts require() to ES modules
    // production && uglify() // minify, but only in production
  ],
};
