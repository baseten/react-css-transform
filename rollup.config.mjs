import {
  getBuildFormat,
  getRollupTSConfig,
  isProductionBuild,
} from './getRollupConfig.mjs';

const format = getBuildFormat();
const buildType = isProductionBuild() ? '' : '-dev';

const external = [
  'gl-matrix',
  'prop-types',
  'react',
  'react-dom',
  'react/jsx-runtime',
];

const buildFormats = format ? [format] : ['cjs', 'es'];
const builds = buildFormats.map((buildFormat) =>
  getRollupTSConfig(`dist/index.${buildFormat}${buildType}.js`, buildFormat, {
    external,
  }),
);

export default builds;
