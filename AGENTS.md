# Repository Guidelines

## Coding Style & Naming Conventions

- Formatting: Prettier is the source of truth (run `pnpm format:fix` before PRs).
- Linting: ESLint via shared config in `tooling/eslint` (run `pnpm lint`).

## Testing Guidelines

## Commit & Pull Request Guidelines

- Commits follow Conventional Commits (examples in history: `chore: …`, `chore(deps): …`, `fix: …`, `refactor: …`).
- Keep changes scoped

## Security & Configuration

- Use `.env.example` → `.env` for local configuration. Never commit secrets.
- Common env vars include `POSTGRES_URL` and auth provider credentials (see `turbo.json`).
