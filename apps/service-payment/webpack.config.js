const { composePlugins, withNx } = require('@nx/webpack');

module.exports = composePlugins(
  withNx({
    target: 'node',
  }),
  (config) => {
    config.experiments.futureDefaults = true;
    return config;
  },
);
