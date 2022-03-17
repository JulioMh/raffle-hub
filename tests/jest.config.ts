import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from '../tsconfig.json';

export default {
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  globals: {
    'ts-jest': {
      // tsconfig: 'tsconfig.test.json',
    },
  },
  collectCoverageFrom: ['resources/**/*.ts'],
  coverageDirectory: './coverage',
  transformIgnorePatterns: [
    'node_modules/(?!aggregate-error|clean-stack|escape-string-regexp|indent-string|p-map)',
  ],
  preset: 'jest-dynalite',
  verbose: true,
  testMatch: ['<rootDir>/tests/unit/**/*.test.ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  rootDir: '../',
  setupFiles: ['./tests/setEnvVars.ts'],
  testTimeout: 10000,
};
