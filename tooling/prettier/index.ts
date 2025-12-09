import tsMeta from "typescript/package.json" with { type: "json" };

import "@prettier/plugin-oxc";
import "@ianvs/prettier-plugin-sort-imports";
import "prettier-plugin-tailwindcss";

import path from "node:path";

const config = {
  endOfLine: "lf",
  plugins: [
    "@prettier/plugin-oxc",
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  tailwindFunctions: ["cn", "cva"],
  importOrder: [
    "<TYPES>",
    "^(react/(.*)$)|^(react$)|^(react-native(.*)$)",
    "^(next/(.*)$)|^(next$)",
    "^(expo(.*)$)|^(expo$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "<TYPES>^@acme",
    "^@acme/(.*)$",
    "",
    "<TYPES>^[.|..|~]",
    "^~/",
    "^[../]",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "5.0.0",
  overrides: [
    {
      files: "*.json.hbs",
      options: {
        parser: "json",
      },
    },
    {
      files: "*.ts.hbs",
      options: {
        parser: "babel-ts",
      },
    },
    {
      files: "*.js.hbs",
      options: {
        parser: "babel",
      },
    },
    {
      files: "pnpm-workspace.yaml",
      options: {
        // pnpm updates with single quotes
        singleQuote: true,
      },
    },
  ],
};

export default config;
