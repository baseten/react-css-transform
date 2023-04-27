/* eslint-disable global-require */
/* eslint-disable import/no-unresolved */
if (['test', 'development'].includes(process.env.NODE_ENV)) {
  module.exports = require('./dist/index.cjs-dev');
} else {
  module.exports = require('./dist/index.cjs');
}
