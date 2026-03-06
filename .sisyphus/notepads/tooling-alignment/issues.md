# Issues & Gotchas

## [2026-03-06] Wave 1 Warning

- Wave 1 reformats ENTIRE codebase - git diff will show many files changed - this is EXPECTED and intentional
- Must be an isolated commit with NO other changes

## [2026-03-06] Expo TSConfig

- apps/expo/tsconfig.json uses `jsx: "react-native"` — incompatible with react.json preset
- Leave it extending base.json (DO NOT change to react.json)

## [2026-03-06] nuqs Scope

- nuqs goes to apps/nextjs ONLY - no React Native adapter exists
- DO NOT add to apps/expo
