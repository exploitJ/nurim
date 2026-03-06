import path from "node:path";

import reactQueryPlugin from "@tanstack/eslint-plugin-query";
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { reactRefresh } from "eslint-plugin-react-refresh";
import reactYouMightNotNeedAnEffect from "eslint-plugin-react-you-might-not-need-an-effect";
import { defineConfig } from "eslint/config";

export const reactConfig = defineConfig(
  reactQueryPlugin.configs["flat/recommended"],
  reactHooks.configs.flat["recommended-latest"]!,
  reactRefresh.configs.recommended(),
  {
    rules: {
      "react-refresh/only-export-components": "warn",
    },
  },
  reactYouMightNotNeedAnEffect.configs.recommended,
  {
    extends: [eslintPluginBetterTailwindcss.configs.correctness],
    rules: {
      "better-tailwindcss/no-unknown-classes": ["warn", { ignore: ["toaster"] }],
      "better-tailwindcss/enforce-canonical-classes": "warn",
      "better-tailwindcss/no-deprecated-classes": "error",
    },
    settings: {
      "better-tailwindcss": {
        entryPoint: path.resolve(import.meta.dirname, "../tailwind/theme.css"),
        rootFontSize: 16,
      },
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    ...reactPlugin.configs.flat.recommended,
    ...reactPlugin.configs.flat["jsx-runtime"],
    languageOptions: {
      ...reactPlugin.configs.flat.recommended?.languageOptions,
      ...reactPlugin.configs.flat["jsx-runtime"]?.languageOptions,
      globals: {
        React: "writable",
      },
    },
  },
);
