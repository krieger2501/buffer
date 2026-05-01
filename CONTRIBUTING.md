# Contributing to Buffer

Thank you for your interest in contributing. This document covers everything you need to get started.

---

## Development setup

Follow the [Setup guide in README.md](./README.md#setup) to get the project running locally.

---

## Branching model

```
feature/my-thing ──► main (staging) ──► release (production)
                          │                      │
                   auto-deploys to         auto-deploys to
                   Cloudflare Pages        Cloudflare Pages
                     (staging)              (production)
```

| Branch                  | Purpose                                 | Who writes to it          |
| ----------------------- | --------------------------------------- | ------------------------- |
| `main`                  | Staging — every merged PR deploys here  | PRs from feature branches |
| `release`               | Production — versioned, tagged releases | Release Please PRs only   |
| `feat/*`, `fix/*`, etc. | Feature/fix work                        | You                       |

**Rules:**

- All PRs target `main`.
- Never push directly to `main` or `release`.
- The `release` branch only receives merges from Release Please's automated release PRs (`chore: release vX.Y.Z`). These PRs are opened automatically after each merge to `main` that contains releasable commits.
- Merging the Release Please PR deploys to production and creates a GitHub Release + git tag.

---

## Workflow

1. Create a branch from `main`:
   ```sh
   git checkout -b feat/my-feature
   ```
2. Make your changes, commit using [Conventional Commits](#commit-messages).
3. Push and open a PR against `main`.
4. All CI checks must pass (type-check, lint, knip, build).
5. Rebase and merge — the only merge strategy accepted.
6. Release Please detects releasable commits on `main` and opens or updates a `chore: release vX.Y.Z` PR targeting `release`.
7. When ready to ship to production, merge the release PR.

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

| Type       | When to use                                | Bumps version |
| ---------- | ------------------------------------------ | ------------- |
| `feat`     | A new feature                              | minor         |
| `fix`      | A bug fix                                  | patch         |
| `perf`     | A performance improvement                  | patch         |
| `revert`   | Reverting a previous commit                | patch         |
| `refactor` | Code change that is not a feature or fix   | —             |
| `style`    | Formatting, whitespace — no logic change   | —             |
| `test`     | Adding or updating tests                   | —             |
| `docs`     | Documentation only                         | —             |
| `chore`    | Build process, tooling, dependency updates | —             |
| `ci`       | Changes to CI configuration                | —             |

> A `BREAKING CHANGE:` footer or `!` after the type (e.g. `feat!:`) triggers a **major** version bump.

**Examples:**

```
feat(forecast): add CSV export for 90-day projection
fix(accounts): prevent NaN balance when input is empty
chore(deps): bump @supabase/supabase-js to 2.106.0
feat!: replace Supabase with self-hosted Postgres
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
pnpm db:migrate    # applies it to your Supabase project
```

Always commit the generated migration files alongside the schema change.

---

## Reporting issues

Open a [GitHub Issue](https://github.com/krieger2501/buffer/issues) with:

- A clear title.
- Steps to reproduce.
- Expected vs actual behaviour.
- Browser / OS if it's a UI issue.
