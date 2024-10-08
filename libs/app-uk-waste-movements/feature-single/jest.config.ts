/* eslint-disable */
export default {
  displayName: 'lib-app-uk-waste-movements-feature-single',
  preset: '../../../jest.preset.js',
  setupFilesAfterEnv: ['./src/jest.setup.ts'],
  transform: {
    '^.+\\.[tj]sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', tsx: true },
          transform: { react: { runtime: 'automatic' } },
        },
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../coverage/libs/app-uk-waste-movements/feature-single',
};
