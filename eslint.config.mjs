import defaultConfig, { defineConfig } from "@forsakringskassan/eslint-config";
import cliConfig from "@forsakringskassan/eslint-config-cli";
import cypressConfig from "@forsakringskassan/eslint-config-cypress";
import jestConfig from "@forsakringskassan/eslint-config-jest";
import typescriptConfig from "@forsakringskassan/eslint-config-typescript";
import typeinfoConfig from "@forsakringskassan/eslint-config-typescript-typeinfo";
import vueConfig from "@forsakringskassan/eslint-config-vue";

export default [
  {
    name: "Ignored files",
    ignores: [
      "**/coverage/**",
      "**/dist/**",
      "**/node_modules/**",
      "**/public/**",
      "**/temp/**",
      "**/typedoc/**",
    ],
  },

  ...defaultConfig,

  cliConfig(),
  typescriptConfig(),
  typeinfoConfig(import.meta.dirname),
  vueConfig(),
  jestConfig(),
  cypressConfig(),

  defineConfig({
    name: "local",
    rules: {
      "vue/no-restricted-block": "off",
      "max-depth": ["error", 4],
    },
  }),
];
