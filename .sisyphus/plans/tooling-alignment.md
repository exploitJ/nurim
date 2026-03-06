# Plan: Tooling Alignment with aiats Baseline

> **Goal**: Align nurim DX tooling with aiats patterns. Tooling-only — no framework changes.
> **Scope**: ESLint, Prettier, Turbo, TypeScript configs, UI exports, State management deps
> **Constraints**: Keep Next.js 16 + tRPC v11 + Drizzle ORM + Expo. Keep `@acme` prefix.
> **Execution**: 6 sequential waves, each a separate commit. Wave 1 (Prettier) MUST be isolated.

## Decisions Made

| Decision             | Choice                                                       | Rationale                                                                           |
| -------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| ESLint react-refresh | Add with `next()` config for Next.js, `recommended` for Expo | Plugin has dedicated Next.js config that allows framework exports                   |
| ESLint composition   | Keep separate `baseConfig` + `reactConfig` imports           | Less churn, non-React packages unaffected                                           |
| TSConfig react.json  | Custom (NOT @tsconfig/vite-react)                            | `jsx: "preserve"` needed for Next.js; vite-react sets `"react-jsx"` which conflicts |
| TSConfig node.json   | Skip                                                         | Not worth the churn for current packages                                            |
| UI exports           | Restructure to `src/components/` + wildcards                 | Clean separation, scalable, matches aiats pattern                                   |
| nuqs                 | Next.js only                                                 | No Expo adapter exists                                                              |

---

## Wave 1: Prettier Config Alignment

> **CRITICAL**: This wave reformats the ENTIRE codebase. Must be an isolated commit with NO other changes.
> **Commit message**: `chore: align prettier config (printWidth 100, tailwind stylesheet, jsonc parser)`

### Task 1.1: Update Prettier Config

**File**: `tooling/prettier/index.ts`

**Changes**:

1. Add `printWidth: 100` after `endOfLine: "lf"`
2. Add `tailwindStylesheet: path.resolve(import.meta.dirname, "../tailwind/theme.css")` after `tailwindFunctions`
3. Change `.ts.hbs` parser override from `"babel-ts"` to `"typescript"` (line ~45)
4. Add new override for tsconfig files (add BEFORE the `pnpm-workspace.yaml` override):

```ts
{
  files: ["**/tsconfig.json", "**/tsconfig.json.hbs", "**/tooling/typescript/*.json"],
  excludeFiles: "**/package.json",
  options: {
    parser: "jsonc",
  },
},
```

**Reference**: aiats `tooling/prettier/index.ts` lines 6-67

### Task 1.2: Update Format Scripts with Cache Strategy

Update ALL package/app `format` scripts to add `--cache --cache-location .cache/prettiercache --cache-strategy metadata`. Also add `format:fix` scripts (needed for Wave 4 turbo tasks).

**Files to update** (9 package.json files):

| File                               | Current `format` script                                  | New `format` script                                                                                                              | New `format:fix` script                                                                                                          |
| ---------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `apps/nextjs/package.json`         | `prettier --check . --ignore-path ../../.prettierignore` | `prettier . --ignore-path ../../.prettierignore --check --cache --cache-location .cache/prettiercache --cache-strategy metadata` | `prettier . --ignore-path ../../.prettierignore --write --cache --cache-location .cache/prettiercache --cache-strategy metadata` |
| `apps/expo/package.json`           | (same pattern)                                           | (same pattern)                                                                                                                   | (same pattern)                                                                                                                   |
| `packages/api/package.json`        | (same pattern)                                           | (same pattern)                                                                                                                   | (same pattern)                                                                                                                   |
| `packages/auth/package.json`       | (same pattern)                                           | (same pattern)                                                                                                                   | (same pattern)                                                                                                                   |
| `packages/db/package.json`         | (same pattern)                                           | (same pattern)                                                                                                                   | (same pattern)                                                                                                                   |
| `packages/ui/package.json`         | (same pattern)                                           | (same pattern)                                                                                                                   | (same pattern)                                                                                                                   |
| `packages/validators/package.json` | (same pattern)                                           | (same pattern)                                                                                                                   | (same pattern)                                                                                                                   |
| `tooling/eslint/package.json`      | `prettier --check . --ignore-path ../../.prettierignore` | (same pattern)                                                                                                                   | (same pattern)                                                                                                                   |
| `tooling/tailwind/package.json`    | (same pattern)                                           | (same pattern)                                                                                                                   | (same pattern)                                                                                                                   |

**Note**: `tooling/prettier/package.json` also has a format script — update it too (10 total).

Also add `lint:fix` scripts to all packages that have `lint` (needed for Wave 4):

| File                               | Current `lint` script                            | New `lint:fix` script                                  |
| ---------------------------------- | ------------------------------------------------ | ------------------------------------------------------ |
| `apps/nextjs/package.json`         | `eslint --flag unstable_native_nodejs_ts_config` | `eslint --flag unstable_native_nodejs_ts_config --fix` |
| `apps/expo/package.json`           | (same)                                           | (same + `--fix`)                                       |
| `packages/api/package.json`        | (same)                                           | (same + `--fix`)                                       |
| `packages/auth/package.json`       | (same)                                           | (same + `--fix`)                                       |
| `packages/db/package.json`         | (same)                                           | (same + `--fix`)                                       |
| `packages/ui/package.json`         | (same)                                           | (same + `--fix`)                                       |
| `packages/validators/package.json` | (same)                                           | (same + `--fix`)                                       |
| `tooling/tailwind/package.json`    | (same)                                           | (same + `--fix`)                                       |

**Note**: `tooling/eslint/package.json` has no `lint` script (it's the eslint config itself). `tooling/prettier/package.json` has no `lint` script either. Skip these.

### Task 1.3: Run Full Reformat

```bash
pnpm format:fix
```

### Task 1.4: Verify Clean State

```bash
pnpm format  # Must exit 0 (no remaining diffs)
```

**QA**: After this wave, `git diff --stat` should show every file touched by the reformat. This is expected and intentional.

---

## Wave 2: TypeScript Config Hierarchy

> **Commit message**: `chore: add shared react tsconfig preset`

### Task 2.1: Create react.json Preset

**File**: `tooling/typescript/react.json` (NEW FILE)

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "preserve"
  }
}
```

**Rationale**: NOT extending `@tsconfig/vite-react` because it sets `jsx: "react-jsx"` which conflicts with Next.js SWC (requires `"preserve"`).

### Task 2.2: Add allowImportingTsExtensions to Base

**File**: `tooling/typescript/base.json`

Add to `compilerOptions`:

```json
"allowImportingTsExtensions": true
```

Place it after `"isolatedModules": true` (line 12).

### Task 2.3: Update UI Package TSConfig

**File**: `packages/ui/tsconfig.json`

Change FROM:

```json
{
  "extends": "@acme/tsconfig/base.json",
  "compilerOptions": {
    "lib": ["ES2022", "dom", "dom.iterable"],
    "jsx": "preserve",
    "rootDir": "."
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

Change TO:

```json
{
  "extends": "@acme/tsconfig/react.json",
  "compilerOptions": {
    "rootDir": "."
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### Task 2.4: Update Next.js TSConfig

**File**: `apps/nextjs/tsconfig.json`

Change FROM:

```json
{
  "extends": "@acme/tsconfig/base.json",
  "compilerOptions": {
    "lib": ["ES2022", "dom", "dom.iterable"],
    "jsx": "preserve",
    "paths": { "~/*": ["./src/*"] },
    "plugins": [{ "name": "next" }]
  },
  "include": [".", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Change TO:

```json
{
  "extends": "@acme/tsconfig/react.json",
  "compilerOptions": {
    "paths": { "~/*": ["./src/*"] },
    "plugins": [{ "name": "next" }]
  },
  "include": [".", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Task 2.5: DO NOT Touch Expo TSConfig

`apps/expo/tsconfig.json` uses `jsx: "react-native"` which is incompatible with the react.json preset (`jsx: "preserve"`). Leave it extending `base.json`.

### Task 2.6: Verify

```bash
pnpm typecheck  # Must exit 0
```

---

## Wave 3: UI Package Export Restructure

> **Commit message**: `refactor(ui): restructure to components/ with wildcard exports`

### Task 3.1: Create Directory Structure

Create `packages/ui/src/components/` and `packages/ui/src/lib/` directories.

### Task 3.2: Move Component Files

Move all `.tsx` component files from `packages/ui/src/` to `packages/ui/src/components/`:

```
src/button.tsx       → src/components/button.tsx
src/dropdown-menu.tsx → src/components/dropdown-menu.tsx
src/field.tsx        → src/components/field.tsx
src/input.tsx        → src/components/input.tsx
src/label.tsx        → src/components/label.tsx
src/separator.tsx    → src/components/separator.tsx
src/theme.tsx        → src/components/theme.tsx
src/toast.tsx        → src/components/toast.tsx
```

**DO NOT MOVE**: `src/index.ts` (stays as root barrel), `src/stories/` (stays for now).

### Task 3.3: Create Utility Module

**File**: `packages/ui/src/lib/utils.ts` (NEW FILE)

Move the `cn` function from `src/index.ts` to `src/lib/utils.ts`:

```ts
import { cx } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: Parameters<typeof cx>) => twMerge(cx(inputs));
```

### Task 3.4: Update Root Index

**File**: `packages/ui/src/index.ts`

Change to re-export from lib:

```ts
export { cn } from "./lib/utils.ts";
```

### Task 3.5: Update Internal Imports

Component files that import from sibling paths need updating:

- `src/components/field.tsx` — imports `cn` from `"@acme/ui"`, `Label` from `"@acme/ui/label"`, `Separator` from `"@acme/ui/separator"`. These package-level self-referencing imports should continue working via the exports field. No change needed IF the new exports map correctly.

### Task 3.6: Update Package Exports

**File**: `packages/ui/package.json`

Change `exports` FROM:

```json
{
  ".": "./src/index.ts",
  "./button": "./src/button.tsx",
  "./dropdown-menu": "./src/dropdown-menu.tsx",
  "./field": "./src/field.tsx",
  "./input": "./src/input.tsx",
  "./label": "./src/label.tsx",
  "./separator": "./src/separator.tsx",
  "./theme": "./src/theme.tsx",
  "./toast": "./src/toast.tsx"
}
```

Change TO:

```json
{
  ".": "./src/index.ts",
  "./components/*": "./src/components/*.tsx",
  "./lib/*": "./src/lib/*.ts"
}
```

### Task 3.7: Update ALL Consumer Imports

All consumer imports must change from `@acme/ui/button` to `@acme/ui/components/button`.

**File**: `apps/nextjs/src/app/_components/posts.tsx`

- `import { Button } from "@acme/ui/button"` → `import { Button } from "@acme/ui/components/button"`
- `import { ... } from "@acme/ui/field"` → `import { ... } from "@acme/ui/components/field"`
- `import { Input } from "@acme/ui/input"` → `import { Input } from "@acme/ui/components/input"`
- `import { toast } from "@acme/ui/toast"` → `import { toast } from "@acme/ui/components/toast"`
- `import { cn } from "@acme/ui"` stays the same (root export unchanged)

**File**: `apps/nextjs/src/app/layout.tsx`

- `import { ThemeProvider, ThemeToggle } from "@acme/ui/theme"` → `import { ThemeProvider, ThemeToggle } from "@acme/ui/components/theme"`
- `import { Toaster } from "@acme/ui/toast"` → `import { Toaster } from "@acme/ui/components/toast"`
- `import { cn } from "@acme/ui"` stays the same

**File**: `apps/nextjs/src/app/_components/auth-showcase.tsx`

- `import { Button } from "@acme/ui/button"` → `import { Button } from "@acme/ui/components/button"`

**Also update internal self-references in UI components**:

- `src/components/field.tsx`: If it imports `@acme/ui/label` → change to `@acme/ui/components/label`
- `src/components/field.tsx`: If it imports `@acme/ui/separator` → change to `@acme/ui/components/separator`

### Task 3.8: Verify

```bash
pnpm typecheck  # Must exit 0 — all imports resolve
pnpm --filter @acme/ui typecheck  # Specifically verify UI self-references
pnpm --filter @acme/nextjs typecheck  # Verify consumer imports
```

---

## Wave 4: Turbo Config Alignment

> **Commit message**: `chore: add quality tasks and structured format/lint fix to turbo`

### Task 4.1: Update turbo.json

**File**: `turbo.json`

Add these new tasks to the `"tasks"` object:

```json
"format:fix": {
  "outputs": [".cache/prettiercache"],
  "outputLogs": "none"
},
"lint:fix": {
  "dependsOn": ["^topo", "^build"],
  "outputs": [".cache/eslintcache"]
},
"quality": {
  "dependsOn": ["//#root:format", "lint", "format"],
  "cache": false
},
"quality:fix": {
  "dependsOn": ["//#root:format:fix", "lint:fix", "format:fix"],
  "cache": false
},
"//#root:format:fix": {
  "outputs": [".cache/prettiercache"],
  "outputLogs": "none"
}
```

Also update `build` task to add explicit inputs:

```json
"build": {
  "dependsOn": ["^build"],
  "inputs": ["$TURBO_DEFAULT$", ".env*", "!.env*.local"],
  "outputs": [".cache/tsbuildinfo.json", "dist/**"]
}
```

### Task 4.2: Update Root Package Scripts

**File**: `package.json`

Add/update these scripts:

```json
"quality": "turbo run quality --continue",
"quality:fix": "turbo run quality:fix --continue",
"root:format:fix": "prettier .github/ .vscode/ *.* --write --cache --cache-location .cache/prettiercache --cache-strategy metadata",
```

Update existing scripts to remove pass-through `--` pattern:

```json
"format": "turbo run format root:format --continue",
"format:fix": "turbo run format:fix root:format:fix --continue",
"lint": "turbo run lint --continue",
"lint:fix": "turbo run lint:fix --continue",
```

Also update `root:format` to add cache strategy:

```json
"root:format": "prettier .github/ .vscode/ *.* --check --cache --cache-location .cache/prettiercache --cache-strategy metadata",
```

Remove the `preformat` script (no longer needed with direct turbo tasks) — actually keep it, it's for `prettierignore-monorepo`.

### Task 4.3: Verify

```bash
npx turbo run quality --dry-run  # Should list format + lint + root:format tasks
npx turbo run format:fix --dry-run  # Should list all package format:fix tasks
pnpm quality  # Full quality check should pass
```

---

## Wave 5: ESLint Config Enrichment

> **Commit message**: `chore: enrich eslint with tailwind, query, refresh, and effect plugins`

### Task 5.1: Add react-refresh Dependency

**File**: `tooling/eslint/package.json`

Add to `dependencies`:

```json
"eslint-plugin-react-refresh": "^0.5.2"
```

### Task 5.2: Update Shared React Config

**File**: `tooling/eslint/react.ts`

Change FROM:

```ts
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";

export const reactConfig = defineConfig(
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
  reactHooks.configs.flat["recommended-latest"]!,
);
```

Change TO:

```ts
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
  reactRefresh.configs.recommended,
  reactYouMightNotNeedAnEffect.configs.recommended,
  {
    extends: [eslintPluginBetterTailwindcss.configs.correctness],
    rules: {
      "better-tailwindcss/no-unknown-classes": [
        "error",
        { ignore: ["toaster"] },
      ],
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
```

### Task 5.3: Update Base ESLint Config

**File**: `tooling/eslint/base.ts`

Add `eslint-import-resolver-typescript` resolver settings and `no-misused-promises` rule.

In the imports section, add:

```ts
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
```

Add resolver settings block (after the existing `importX.flatConfigs.typescript` line):

```ts
{
  settings: {
    "import-x/resolver-next": [createTypeScriptImportResolver()],
  },
},
```

Add to the `rules` object in the main config block:

```ts
"@typescript-eslint/no-misused-promises": [
  "error",
  {
    checksVoidReturn: {
      attributes: false,
    },
  },
],
```

### Task 5.4: Update Next.js ESLint Config

**File**: `apps/nextjs/eslint.config.ts`

Add react-refresh Next.js config:

Change FROM:

```ts
import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@acme/eslint-config/base";
import { nextjsConfig } from "@acme/eslint-config/nextjs";
import { reactConfig } from "@acme/eslint-config/react";

export default defineConfig(
  {
    ignores: [".next/**"],
  },
  baseConfig,
  reactConfig,
  nextjsConfig,
  restrictEnvAccess,
);
```

Change TO:

```ts
import { reactRefresh } from "eslint-plugin-react-refresh";
import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@acme/eslint-config/base";
import { nextjsConfig } from "@acme/eslint-config/nextjs";
import { reactConfig } from "@acme/eslint-config/react";

export default defineConfig(
  {
    ignores: [".next/**"],
  },
  baseConfig,
  reactConfig,
  nextjsConfig,
  restrictEnvAccess,
  reactRefresh.configs.next(),
);
```

**Note**: `reactRefresh.configs.next()` is placed AFTER `reactConfig` so it overrides the `recommended` config from the shared react.ts with Next.js-specific allowances.

### Task 5.5: Expo ESLint Config Needs No Change

`apps/expo/eslint.config.mts` already imports `reactConfig` which now includes `reactRefresh.configs.recommended`. The recommended config is correct for Expo (Metro bundler). No changes needed.

### Task 5.6: Verify

```bash
pnpm --filter @acme/eslint-config typecheck  # ESLint config package typechecks
pnpm lint  # Full lint across workspace — expect some new warnings (not errors) from new plugins
```

**Expected new warnings**: `better-tailwindcss/enforce-canonical-classes` (warn level) and `react-you-might-not-need-an-effect` may flag existing patterns. These are intentional — address them later or adjust rule severity.

If `pnpm lint` shows many errors from the new plugins, consider:

1. Downgrading specific rules from `error` to `warn` temporarily
2. Adding `// eslint-disable` for false positives
3. Running `pnpm lint:fix` to auto-fix what's possible

---

## Wave 6: State Management Dependencies

> **Commit message**: `chore: add zustand and nuqs dependencies`

### Task 6.1: Add to pnpm Catalog

**File**: `pnpm-workspace.yaml`

Add to the `catalog:` section:

```yaml
zustand: ^5.0.11
nuqs: ^2.8.8
```

### Task 6.2: Add Zustand to Both Apps

**File**: `apps/nextjs/package.json` — add to `dependencies`:

```json
"zustand": "catalog:"
```

**File**: `apps/expo/package.json` — add to `dependencies`:

```json
"zustand": "catalog:"
```

### Task 6.3: Add nuqs to Next.js Only

**File**: `apps/nextjs/package.json` — add to `dependencies`:

```json
"nuqs": "catalog:"
```

**DO NOT** add nuqs to `apps/expo/package.json` — no React Native adapter exists.

### Task 6.4: Install

```bash
pnpm install
```

### Task 6.5: Verify

```bash
pnpm --filter @acme/nextjs exec node -e "require('zustand')"  # Should not throw
pnpm --filter @acme/nextjs exec node -e "require('nuqs')"  # Should not throw
pnpm --filter @acme/expo exec node -e "require('zustand')"  # Should not throw
pnpm typecheck  # Still passes
```

---

## Final Verification Wave

Run full quality check across the workspace:

```bash
pnpm quality      # format + lint pass
pnpm typecheck    # type checking passes
pnpm build        # build succeeds
```

All 6 waves should result in 6 clean, atomic commits:

1. `chore: align prettier config (printWidth 100, tailwind stylesheet, jsonc parser)`
2. `chore: add shared react tsconfig preset`
3. `refactor(ui): restructure to components/ with wildcard exports`
4. `chore: add quality tasks and structured format/lint fix to turbo`
5. `chore: enrich eslint with tailwind, query, refresh, and effect plugins`
6. `chore: add zustand and nuqs dependencies`
