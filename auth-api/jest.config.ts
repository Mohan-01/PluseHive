import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  setupFiles: ['<rootDir>/tests/utils/jest-setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/tests/stress/'],
  transform: {
    '^.+\\.ts?$': ['ts-jest', {}]
  }
};

export default config;
