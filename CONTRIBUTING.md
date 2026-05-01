# Contributing to Buffer

Thank you for your interest in contributing. This document covers everything you need to get started.

---

## Development setup

Follow the [Setup guide in README.md](./README.md#setup) to get the project running locally.

---

## Workflow

Buffer uses a **trunk-based** flow:

1. Fork the repository (external contributors) or create a branch (maintainers).
2. Branch names should be short and descriptive: `feat/forecast-export`, `fix/account-balance-nan`.
3. Open a pull request against `main` when ready.
4. All CI checks must pass before a PR can be merged.
5. Squash-merge is preferred to keep the log clean.

---

## Commit messages

This project follows [Conventional Commits](https://www.conventionalcommits.org/). Commit messages are linted automatically on every PR via commitlint.

**Format:**

```
<type>(<optional scope>): <short description>

[optional body]

[optional footer(s)]
```

**Allowed types:**

| Type       | When to use                                |
| ---------- | ------------------------------------------ |
| `feat`     | A new feature                              |
| `fix`      | A bug fix                                  |
| `perf`     | A performance improvement                  |
| `refactor` | Code change that is not a feature or fix   |
| `style`    | Formatting, whitespace — no logic change   |
| `test`     | Adding or updating tests                   |
| `docs`     | Documentation only                         |
| `chore`    | Build process, tooling, dependency updates |
| `ci`       | Changes to CI configuration                |
| `revert`   | Reverting a previous commit                |

**Examples:**

```
feat(forecast): add CSV export for 90-day projection
fix(accounts): prevent NaN balance when input is empty
chore(deps): bump @supabase/supabase-js to 2.106.0
```

---

## Code style

All style is enforced automatically — just run the auto-fixer before committing:

```sh
pnpm lint:fix
```

Key rules:

- **TypeScript** everywhere — no `any` without a comment explaining why.
- **Svelte 5 runes** — use `$state`, `$derived`, `$props`; avoid the legacy Options API.
- **No comments** unless the _why_ is genuinely non-obvious.
- All `<button>` elements need an explicit `type` attribute.
- Each `{#each}` block needs a key expression.

---

## Quality gate

Before opening a PR, run the full quality gate locally:

```sh
pnpm qc
```

This runs: `svelte-check` → ESLint + Prettier + sort-package-json → Knip → build → clean working tree.

---

## Database schema changes

Schema lives in `src/lib/server/schema.ts` (Drizzle ORM). After changing it:

```sh
pnpm db:generate   # generates a new SQL migration file in ./drizzle
pnpm db:migrate    # applies it to your local Supabase project
```

Always commit the generated migration files alongside the schema change.

---

## Reporting issues

Open a [GitHub Issue](https://github.com/krieger2501/buffer/issues) with:

- A clear title.
- Steps to reproduce.
- Expected vs actual behaviour.
- Browser / OS if it's a UI issue.
