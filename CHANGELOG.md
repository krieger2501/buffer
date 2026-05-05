# Changelog

## [2.1.0](https://github.com/krieger2501/buffer/compare/v2.0.1...v2.1.0) (2026-05-05)


### Features

* fix PWA nav safe area, add account menu, add settings page ([ee80025](https://github.com/krieger2501/buffer/commit/ee800258b6d494710d8045ce30c2aeb11bb26a7a))
* **settings:** persist settings to user_settings DB table ([331f8df](https://github.com/krieger2501/buffer/commit/331f8df12f547aaec39e4dfaf3feceecd4931fd0))


### Bug Fixes

* **ci:** use pr_number output for alpha auto-merge ([7a2c8f1](https://github.com/krieger2501/buffer/commit/7a2c8f145ab58e1194d535cb88891d6facdaa51b))

## [2.0.1](https://github.com/krieger2501/buffer/compare/v2.0.0...v2.0.1) (2026-05-05)


### Bug Fixes

* **ci:** correct Pages output dir to .svelte-kit/cloudflare ([f452ed7](https://github.com/krieger2501/buffer/commit/f452ed7bc341d00ab05d323fe5bbd4eba6027009))

## [2.0.0](https://github.com/krieger2501/buffer/compare/v1.0.0...v2.0.0) (2026-05-05)


### ⚠ BREAKING CHANGES

* **data:** requires running `pnpm db:migrate` and applying drizzle/rls.sql in the Supabase SQL Editor before existing rows are accessible.

### Features

* **auth:** add Google + Apple OAuth via Supabase SSR ([c909594](https://github.com/krieger2501/buffer/commit/c909594f7d669eb092cc792ae8ca40e58982a2d2))
* **data:** scope all data to authenticated user ([a74d903](https://github.com/krieger2501/buffer/commit/a74d9039e1ae33f83c7bce9f3c927f7a5677388a))
* **forecast:** replace due_date with day_of_month for recurring items ([d0b8695](https://github.com/krieger2501/buffer/commit/d0b8695fd792f2fd018f02f91860cd421e5ce43d))
* initial project setup ([c20cc11](https://github.com/krieger2501/buffer/commit/c20cc1188d68423ad1e3b8280945b0bca99fd87c))
* **pwa:** fix manifest, generate icons, correct apple-touch-icon ([b7f596a](https://github.com/krieger2501/buffer/commit/b7f596a67a8f8be548c8f36fe55571fb730f879d))


### Bug Fixes

* **db:** add GRANT privileges to rls.sql, fix drizzle.config.ts node types ([8235dc7](https://github.com/krieger2501/buffer/commit/8235dc7738212eca53b1202d787a945e3daeb884))
* **ui:** extract BottomSheet component, fix nav overlap, slide-up animation ([6882270](https://github.com/krieger2501/buffer/commit/688227084fe6164903af3eaa497d618a9e10a8b1))

## 1.0.0 (2026-05-05)


### ⚠ BREAKING CHANGES

* **data:** requires running `pnpm db:migrate` and applying drizzle/rls.sql in the Supabase SQL Editor before existing rows are accessible.

### Features

* **auth:** add Google + Apple OAuth via Supabase SSR ([c909594](https://github.com/krieger2501/buffer/commit/c909594f7d669eb092cc792ae8ca40e58982a2d2))
* **data:** scope all data to authenticated user ([a74d903](https://github.com/krieger2501/buffer/commit/a74d9039e1ae33f83c7bce9f3c927f7a5677388a))
* **forecast:** replace due_date with day_of_month for recurring items ([d0b8695](https://github.com/krieger2501/buffer/commit/d0b8695fd792f2fd018f02f91860cd421e5ce43d))
* initial project setup ([c20cc11](https://github.com/krieger2501/buffer/commit/c20cc1188d68423ad1e3b8280945b0bca99fd87c))


### Bug Fixes

* **db:** add GRANT privileges to rls.sql, fix drizzle.config.ts node types ([8235dc7](https://github.com/krieger2501/buffer/commit/8235dc7738212eca53b1202d787a945e3daeb884))
* **ui:** extract BottomSheet component, fix nav overlap, slide-up animation ([6882270](https://github.com/krieger2501/buffer/commit/688227084fe6164903af3eaa497d618a9e10a8b1))
