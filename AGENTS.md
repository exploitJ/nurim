# Repository Guidelines

## Project Structure & Module Organization

This is a Turborepo + pnpm monorepo.

- `apps/nextjs`: Next.js web app.
- `apps/expo`: Expo / React Native app.
- `packages/api`: tRPC router/types shared with clients.
- `packages/auth`: Better Auth integration (runtime + CLI schema generation).
- `packages/db`: Drizzle ORM + database client/schema.
- `packages/ui`: Shared UI components.
- `packages/validators`: Shared Zod schemas.
- `tooling/*`: Shared ESLint/Prettier/TS/Tailwind configs.

Build artifacts and caches commonly live in `dist/`, `.next/`, `.expo/`, `.turbo/`, and `.cache/`.

## Build, Test, and Development Commands

Use the repo-wide scripts from the root `package.json`:

- `pnpm i`: Install workspace dependencies.
- `pnpm dev`: Run all app/package `dev` tasks via Turbo.
- `pnpm dev:next`: Run only the Next.js app (and its deps).
- `pnpm build`: Build all packages/apps (`turbo run build`).
- `pnpm lint` / `pnpm lint:fix`: Lint the workspace (ESLint).
- `pnpm format` / `pnpm format:fix`: Check/format with Prettier.
- `pnpm typecheck`: TypeScript typecheck across the workspace.
- `pnpm db:push` / `pnpm db:studio`: Drizzle push + studio (requires `.env`).
- `pnpm auth:generate`: Generate auth schema into `packages/db/src/auth-schema.ts`.

Tip: target a single package with pnpm filters, e.g. `pnpm -F @acme/db push`.

## Coding Style & Naming Conventions

- Language: TypeScript (ESM). Prefer explicit, named exports for shared packages.
- Formatting: Prettier is the source of truth (run `pnpm format:fix` before PRs).
- Linting: ESLint via shared config in `tooling/eslint` (run `pnpm lint`).
- Naming: packages use `@acme/*`; paths follow the workspace layout (e.g. `packages/db/src/*`).

## Testing Guidelines

There is no repo-wide unit test runner configured yet. Validate changes with:

- `pnpm typecheck` (types)
- `pnpm lint` (rules)
- `pnpm build` and a local run (`pnpm dev` / `pnpm dev:next`)

If you introduce a test framework, document it here and add a root `test` script.

## Commit & Pull Request Guidelines

- Commits follow Conventional Commits (examples in history: `chore: …`, `chore(deps): …`, `fix: …`, `refactor: …`).
- PRs should include: what/why, linked issue (if any), and screenshots for UI changes (Next.js and/or Expo).
- Keep changes scoped; avoid formatting-only diffs outside the touched area unless required by Prettier.

## Security & Configuration

- Use `.env.example` → `.env` for local configuration. Never commit secrets.
- Common env vars include `POSTGRES_URL` and auth provider credentials (see `turbo.json`).
