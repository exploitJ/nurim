import path from "node:path";

import { type Config } from "prettier";
import tsMeta from "typescript/package.json" with { type: "json" };

const config: Config = {
  endOfLine: "lf",
  plugins: [
    "@prettier/plugin-oxc",
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  tailwindFunctions: ["cn", "cva"],
  importOrder: [
    "<TYPES>^(node:)",
    "<BUILTIN_MODULES>",
    "",
    "<TYPES>",
    "^(react/(.*)$)|^(react$)|^(react-native(.*)$)",
    "^(next/(.*)$)|^(next$)",
    "^(expo(.*)$)|^(expo$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "<TYPES>^@acme",
    "^@acme/(.*)$",
    "",
    "<TYPES>^[#|~|.|..]",
    "^#/",
    "^~/",
    "^[../]",
    "^[./]",
  ],
  importOrderTypeScriptVersion: tsMeta.version,
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
