<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# book-nook

## Stack and layout
- Next.js 16.4.3 App Router with React 19. JavaScript only: `.js`/`.jsx`, no TypeScript or `tsconfig`.
- App code lives under `src/`; `@/*` resolves to `src/*` (`jsconfig.json`).
- UI uses Tailwind CSS v4 (CSS-first) and shadcn/ui `base-nova` on Base UI (`@base-ui/react`), not Radix.

## Commands
- `npm run dev` — Turbopack dev server at http://localhost:3000.
- `npm run lint` — the only check script; run it after changes.
- `npm run build` / `npm start` — production build and serve.
- No test, typecheck, format, or codegen scripts and no CI config. Don't run `npm test`.
- If `next build` fails during prerendering, use `npx next build --debug-prerender` for full stack traces and all failing routes.

## Next.js 16 specifics
- `cacheComponents: true`: data is uncached by default. Opt in with `'use cache'` (pair with `cacheLife(...)`); otherwise uncached reads must sit under `<Suspense>`, or prerendering/build fails.
- Synchronous render-time values such as `new Date()`, `Math.random()`, and `crypto.randomUUID()` also trigger prerender errors unless cached or streamed.
- `partialPrefetching: true`: `<Link>` prefetches a shared App Shell by default; use `prefetch={true}` only when URL-specific cached content must be prefetched. Prefetching only runs in production, so verify with `next start`.
- `instant` route-segment config controls instant-navigation/static-shell validation; prefer caching or `<Suspense>` over `export const instant = false`. It cannot be used in Client Components.
- React Compiler is enabled; don't add `useMemo`/`useCallback` just to memoize.
- Turbopack is the bundler. `next.config.mjs` pipes `*.css` through `@tailwindcss/turbopack`; there is no PostCSS config.
- Read the version-matched docs in `node_modules/next/dist/docs/` before using unfamiliar 16.x APIs.
- A dev server may already be running; check `.next/dev/lock` for its PID/port before starting another.

## Styling and components
- No `tailwind.config.*`. Theme tokens and the `dark` variant live in `src/app/globals.css`.
- Dark mode is class-based (`.dark`). `data-theme="light"` on `<html>` is currently inert; don't rely on it.
- Add shadcn components with `npx shadcn add <name>`; `components.json` keeps output as JSX with the `base-nova` style.
- Shared primitives belong in `src/components/ui/`.
- Import `cn` from `@/lib/utils` (or directly from `cn`). This project uses the `cn` package, not `clsx` + `tailwind-merge`.

## Notes
- `README.md` is stale create-next-app boilerplate; trust `src/app` and the config files instead.
- Keep the managed `nextjs-agent-rules` block above; `next dev` recreates it.
