# Decisions

## [2026-03-06] From plan file

| Decision             | Choice                                                       | Rationale                                                                           |
| -------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| ESLint react-refresh | Add with `next()` config for Next.js, `recommended` for Expo | Plugin has dedicated Next.js config that allows framework exports                   |
| ESLint composition   | Keep separate `baseConfig` + `reactConfig` imports           | Less churn, non-React packages unaffected                                           |
| TSConfig react.json  | Custom (NOT @tsconfig/vite-react)                            | `jsx: "preserve"` needed for Next.js; vite-react sets `"react-jsx"` which conflicts |
| TSConfig node.json   | Skip                                                         | Not worth the churn for current packages                                            |
| UI exports           | Restructure to `src/components/` + wildcards                 | Clean separation, scalable, matches aiats pattern                                   |
| nuqs                 | Next.js only                                                 | No Expo adapter exists                                                              |
