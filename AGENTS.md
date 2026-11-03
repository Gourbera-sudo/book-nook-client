<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# book-nook

Early-stage book-borrowing app: marketing pages plus email/Google auth backed by MongoDB. Several navbar links point at routes that do not exist yet.

## Stack and layout
- Next.js 16.4.3 App Router with React 19. JavaScript only: `.js`/`.jsx`, no TypeScript or `tsconfig`.
- `@/*` resolves to `src/*` (`jsconfig.json`). App code is in `src/app`, shared components in `src/components`, helpers in `src/lib`, hooks in `src/hooks`.
- UI uses Tailwind CSS v4 (CSS-first) and shadcn/ui `base-nova` on Base UI (`@base-ui/react`), not Radix. Icons come from `lucide-react`; the home banner uses `swiper`, the shadcn carousel uses `embla-carousel-react`.
- `src/app/(auth)/login` and `(auth)/register` serve `/login` and `/register`; the route group only organizes files, it does not change URLs.

## Auth and environment
- better-auth 1.7 with the separate `@better-auth/mongo-adapter` package.
- Server config: `src/lib/auth.js` (creates the Mongo client at module load, database name hardcoded as `book-nook`). Browser client: `src/lib/auth-client.js`. Handler: `src/app/api/auth/[...all]/route.js`.
- `.env` (gitignored) defines `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`. Auth needs the first three; Google sign-in needs the last two.
- The navbar is a client component mounted in the root layout on every route and is the only session consumer, via `authClient.useSession()`. There is no server-side session helper yet.

## Commands
- `npm run dev` — Turbopack dev server at http://localhost:3000.
- `npm run lint` — the only check script; run it after changes. Baseline currently fails on `src/components/ui/carousel.jsx` and `src/hooks/use-mobile.js` (`react-hooks/set-state-in-effect`); don't treat those as new regressions.
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
- A dev server may already be running; check `.next/dev/lock` before starting another.

## Styling and components
- No `tailwind.config.*`. Theme tokens and the `dark` variant live in `src/app/globals.css`.
- Dark mode is class-based (`.dark`). `data-theme="light"` on `<html>` is currently inert; don't rely on it.
- Add shadcn components with `npx shadcn add <name>`; `components.json` keeps output as JSX with the `base-nova` style.
- Shared primitives belong in `src/components/ui/`.
- Import `cn` from `@/lib/utils` (or directly from `cn`). This project uses the `cn` package, not `clsx` + `tailwind-merge`.

## Notes
- `README.md` is stale create-next-app boilerplate; trust `src/app` and the config files instead.
- Navbar links to `/books`, `/books/add`, `/my-books`, and `/my-borrows`, but none exist. `/all-books` (optionally filtered with `?category=fiction`) and `/all-books/[bookId]` fetch the Express API at `http://localhost:5000` (server in `../book-nook-server`) inside `<Suspense>` because `cacheComponents` rejects uncached fetches at prerender time. Book documents contain only `_id`, `title`, `author`, `category`, and `image`; current `_id` values are strings, so the API's detail route matches both string and ObjectId forms.
- Keep the managed `nextjs-agent-rules` block above; `next dev` recreates it.
