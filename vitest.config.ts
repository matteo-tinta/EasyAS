import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 1000 * 20,                       //20 seconds
    maxConcurrency: 2,                            // Limit to 2 concurrent tests
    setupFiles: './tests/setup/setup.global.ts',
    exclude: ['node_modules', 'dist'],
  },
});