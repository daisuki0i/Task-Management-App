import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.ts";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      include: ['**/*.test.ts', '**/*.test.tsx'],
      globals: true, 
      setupFiles: "./test-setup.ts",
    },
  })
);