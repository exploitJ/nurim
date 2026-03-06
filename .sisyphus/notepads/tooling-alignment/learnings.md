# Learnings

## [2026-03-06] Session: ses_33dcef163ffePjYg0YfhjgFY6T — Plan Start

- Working in: /Users/koi/projects/nurim (branch: feat/tooling-alignment)
- Package manager: pnpm (monorepo with pnpm workspaces)
- 6 sequential waves, each a separate commit
- Goal: Align nurim DX tooling with aiats patterns (tooling-only, no framework changes)
- Keep @acme prefix throughout
- Wave 1 (Prettier) MUST be isolated — it reformats the entire codebase

## [2026-03-06] Wave 1: Prettier Config Alignment — COMPLETED

- Updated tooling/prettier/index.ts: printWidth 100, tailwindStylesheet, typescript parser, jsonc override
- Updated 10 package.json files with format/format:fix/lint:fix scripts
- `--cache-strategy metadata` was DELETED in this prettier version — had to remove it from all scripts
- `--experimental-cli` flag from turbo root causes different formatting output vs standard CLI — must format with it to match
- Ran `pnpm exec prettier . --write --ignore-path .prettierignore --experimental-cli` to reformat entire codebase
- `pnpm format` exits 0 (all 11 tasks pass)
- Committed: chore: align prettier config (printWidth 100, tailwind stylesheet, jsonc parser)
- 66 files changed, 1299 insertions(+), 492 deletions(-)

## [2026-03-06] Wave 2: TypeScript Config Hierarchy — COMPLETED

- Created tooling/typescript/react.json with lib: ES2022, DOM, DOM.Iterable, jsx: preserve
- Added allowImportingTsExtensions: true to base.json after isolatedModules
- Updated packages/ui/tsconfig.json to extend @acme/tsconfig/react.json (removed lib, jsx from compilerOptions)
- Updated apps/nextjs/tsconfig.json to extend @acme/tsconfig/react.json (removed lib, jsx from compilerOptions)
- Left apps/expo/tsconfig.json unchanged (uses jsx: "react-native" — incompatible with react.json preset)
- pnpm typecheck passes (13 tasks successful)
- Committed: chore: add shared react tsconfig preset
- 4 files changed, 18 insertions(+), 13 deletions(-)

## [2026-03-06] Wave 3: UI Package Export Restructure — COMPLETED

- Moved 8 component files from src/ to src/components/
- Created src/lib/utils.ts with cn function
- Updated src/index.ts to re-export cn from lib/utils.ts
- Updated packages/ui/package.json exports to use wildcard pattern
- Updated field.tsx self-references: @acme/ui/label → @acme/ui/components/label, etc.
- Updated apps/nextjs consumer imports to use @acme/ui/components/\*
- pnpm typecheck passes
- Committed: refactor(ui): restructure to components/ with wildcard exports

## [2026-03-06] Wave 4: Turbo Config Alignment — COMPLETED
- Updated turbo.json: added format:fix, lint:fix, quality, quality:fix, //#root:format:fix tasks
- Updated build task with explicit inputs field: ["$TURBO_DEFAULT$", ".env*", "!.env*.local"]
- Updated root package.json: simplified format/lint/format:fix/lint:fix scripts (removed pass-through --)
- Added quality and quality:fix scripts to root
- Added root:format:fix script with cache strategy metadata
- Updated root:format to add cache strategy metadata
- npx turbo run format:fix --dry-run verified task listing (no errors)
- npx turbo run quality --dry-run verified task listing (no errors)
- Committed: chore: add quality tasks and structured format/lint fix to turbo
