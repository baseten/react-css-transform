import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';

const getBabelOptions = ({ useESModules }) => ({
  exclude: 'node_modules/**',
  runtimeHelpers: true,
  plugins: [['@babel/plugin-transform-runtime', { useESModules }]],
});

const commonjsOptions = {
  include: '**/node_modules/**',
};

const isExternal = id => !id.startsWith('.') && !id.startsWith('/');

const input = './src/index.js';
const name = 'ReactCssTransform';
const globals = {
  react: 'React',
};

const umd = [
  {
    input,
    output: {
      file: 'dist/react-css-transform.js',
      format: 'umd',
      name,
      globals,
    },
    external: Object.keys(globals),
    plugins: [
      resolve(),
      babel(getBabelOptions({ useESModules: true })),
      commonjs(commonjsOptions),
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
      sizeSnapshot(),
    ],
  },
  {
    input,
    output: {
      file: 'dist/react-css-transform.min.js',
      format: 'umd',
      name,
      globals,
    },
    external: Object.keys(globals),
    plugins: [
      resolve(),
      babel(getBabelOptions({ useESModules: true })),
      commonjs(commonjsOptions),
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      sizeSnapshot(),
      uglify(),
    ],
  },
];

const es = {
  input,
  output: { file: pkg.module, format: 'es' },
  external: isExternal,
  plugins: [babel(getBabelOptions({ useESModules: true })), sizeSnapshot()],
};

const cjs = {
  input,
  output: { file: pkg.main, format: 'cjs' },
  external: isExternal,
  plugins: [babel(getBabelOptions({ useESModules: false }))],
};

export default [...umd, es, cjs];
