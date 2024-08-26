// @ts-check

import eslint from "@eslint/js"
import tslint from "typescript-eslint"
import globals from "globals"
import jestPlugin from "eslint-plugin-jest"
import prettierConfig from "eslint-config-prettier"

const configs = tslint.config(
  {
    // this much be in a different object rather than the above,
    // otherwise, those ignored files are still parsed and produce error.
    ignores: [".yarn", "*.pnp.*"],
  },

  prettierConfig,
  eslint.configs.recommended,
  ...tslint.configs.recommendedTypeChecked,
  ...tslint.configs.recommended,
  ...tslint.configs.strict,
  ...tslint.configs.stylistic,

  {
    plugins: { "@typescript-eslint": tslint.plugin },

    files: ["**/*.js", "**/*.ts"],
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      parserOptions: {
        parser: tslint.parser,
        projectService: {
          allowDefaultProject: ["tsconfig.json"],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    // disable type-aware linting on JS files
    files: ["**/*.js", "**/*.mjs"],
    ...tslint.configs.disableTypeChecked,
  },

  {
    // enable jest rules on test files
    files: ["**/test/**", "**/*.test.ts"],
    ...jestPlugin.configs["flat/recommended"],
  },
)

export default configs
