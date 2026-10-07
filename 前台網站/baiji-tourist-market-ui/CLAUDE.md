# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start                                          # dev server (ng serve), http://localhost:4200
npm run build                                      # production build -> dist/baiji-tourist-market-ui/{browser,server}
npm run watch                                      # dev-mode build in watch mode
npm test                                           # unit tests via Vitest (@angular/build:unit-test builder)
npm run serve:ssr:baiji-tourist-market-ui          # run the built SSR server (node dist/.../server/server.mjs)
```

- Run a single test file: `ng test -- src/app/app.spec.ts` (Vitest-based runner; pass a path/pattern after `--`).
- Scaffold code with the Angular CLI, not by hand: `ng generate component <path/name>` (default style is `scss`, configured in `angular.json`).
- No e2e framework is configured.

### Node / toolchain

Node is managed via **nvm**, not the system `/usr/local/bin/node`. Default aliased version is v26.10.0, required because `@angular/cli@22` needs Node `^22.22.3 || ^24.15.0 || >=26.0.0`. If a shell reports an old Angular CLI/Node version, run:
```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
```

## Architecture

This is an Angular 22 app generated with standalone components (no NgModules) and zoneless-style `signal()` state, using the esbuild-based `@angular/build:application` builder with SSR enabled.

- **Entry points**: `src/main.ts` (browser bootstrap) and `src/main.server.ts` (server bootstrap) both bootstrap the root `App` component (`src/app/app.ts`), configured via `src/app/app.config.ts`.
- **SSR server**: `src/server.ts` is an Express app using `AngularNodeAppEngine` from `@angular/ssr/node`. It serves static files from `dist/.../browser` and falls through to Angular's SSR handler for everything else. Add custom REST endpoints here (there's a commented example in the file).
- **Hybrid rendering per route**: `src/app/app.routes.server.ts` defines `ServerRoute[]` with a `renderMode` per path (`RenderMode.Prerender` for SSG, `Server`, or `Client`). Currently `**` is set to `Prerender`. When adding routes with dynamic/user-specific content, add a matching entry here with the appropriate mode — otherwise it inherits the catch-all prerender behavior. Client-side routes live in `src/app/app.routes.ts`.
- **Server config merging**: `app.config.server.ts` merges `appConfig` with `provideServerRendering(withRoutes(serverRoutes))` — route-level render modes and app-level providers are defined in separate files and merged, not colocated.
- **Styling stack** (`src/styles.scss`):
  - `@use '@angular/material' as mat;` + `@include mat.theme(...)` sets up Material 3 theming (Azure/Blue palette) via CSS custom properties (`--mat-sys-*`), not the older SCSS mixin-per-component theming.
  - `@use 'tailwindcss';` pulls in Tailwind v4 (config lives in `.postcssrc.json` via `@tailwindcss/postcss`, no `tailwind.config.js`). Brand tokens (`--color-*`, `--font-*`, `--radius-card`) are declared in `@theme static {}` in `styles.scss`, which auto-generates matching utilities (`bg-primary`, `text-primary`, `font-heading`, `rounded-card`, incl. opacity modifiers like `bg-primary/10` via `color-mix`).
  - **Ordering constraint**: Sass requires all `@use` rules to precede every other rule in the file (including plain CSS rules) — keep both `@use` statements at the top of `styles.scss` before `html {}`/`body {}` blocks.
  - **Tailwind utility classes are the default for ALL component styling** — write classes directly in the template, not a component `.scss` file. Only reach for a component's SCSS file when a Tailwind utility (incl. arbitrary-value syntax, e.g. `aspect-[16/7]`, `gap-[0.4rem]`) genuinely cannot express the rule — e.g. `@starting-style`/`::backdrop` transitions on `<dialog>`, multi-step `@keyframes`, `-webkit-line-clamp` beyond the built-in `line-clamp-*` range, or deep-selector overrides into Angular Material internals (`::ng-deep`). When a component only needs `:host { display: block; }` (or similar static host styling), prefer the `host: { class: '...' }` property on `@Component` over a `:host` SCSS rule, so the host element's styling is also Tailwind classes.
  - Prefer Material's `--mat-sys-*` CSS variables for Material component internals, and Tailwind utility classes for everything else.
  - **Cascade-layer pitfall**: Tailwind v4 wraps all its generated utilities in `@layer` (e.g. `@layer utilities`), but Angular Material's component CSS is *not* layered. Per the CSS spec, any un-layered rule beats a layered rule regardless of specificity or source order — so a plain utility like `hidden`/`block`/`flex` applied to a Material component host (e.g. `button[mat-icon-button]`) can silently lose to Material's own `display` rule. If a Tailwind utility on a Material host element doesn't appear to take effect, use the `!` important-modifier (e.g. `!hidden`, `max-[860px]:!inline-flex`) to force it — `!important` wins over un-layered rules regardless of layering.
