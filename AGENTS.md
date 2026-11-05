<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# book-nook

Book-borrowing app: marketing pages, email/Google auth backed by MongoDB, and book browsing/adding backed by a separate Express API.

## Stack and layout
- Next.js 16.4.3 App Router with React 19. JavaScript only: `.js`/`.jsx`, no TypeScript or `tsconfig`.
- `@/*` resolves to `src/*` (`jsconfig.json`). Routes in `src/app`, shared components in `src/components` (shadcn primitives in `src/components/ui`), helpers in `src/lib`, hooks in `src/hooks`.
- Tailwind CSS v4 (CSS-first) and shadcn/ui `base-nova` on Base UI (`@base-ui/react`), not Radix. Icons are `lucide-react`; the home banner uses `swiper`, the shadcn carousel uses `embla-carousel-react`.
- `src/app/(auth)/login` and `(auth)/register` serve `/login` and `/register`; the route group only organizes files.

## Commands and services
- `npm run dev` — Turbopack dev server at http://localhost:3000. Check `.next/dev/lock` first; a dev server may already be running.
- `npm run lint` — the only check script; run it after changes. Baseline fails on `src/components/ui/carousel.jsx` and `src/hooks/use-mobile.js` (`react-hooks/set-state-in-effect`); don't treat those two as new regressions.
- `npm run build` / `npm start` — production build and serve.
- No test, typecheck, format, or codegen scripts and no CI config. Don't run `npm test`.
- Book data needs the separate Express server in `../book-nook-server` (run `node index.js` from that directory; it has its own `.env` with `MONGODB_URI` and no start script) on port 5000. `npm run dev` alone leaves `/`, `/all-books`, `/my-books`, and book detail pages showing "Could not load…" messages.
- If `next build` fails during prerendering, use `npx next build --debug-prerender` for full stack traces and all failing routes.

## Auth and environment
- better-auth 1.7 with the separate `@better-auth/mongo-adapter` package.
- Server config: `src/lib/auth.js` (creates the Mongo client at module load, database name hardcoded as `book-nook`). Browser client: `src/lib/auth-client.js`. Handler: `src/app/api/auth/[...all]/route.js`.
- `.env` (gitignored) defines `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `IMGBB_API_KEY`. Auth needs the first three; Google sign-in needs the next two; `IMGBB_API_KEY` only feeds the now-unused `src/app/api/upload` route.
- No server-side session helper exists. `src/proxy.js` (Next 16 proxy, matcher `["/add-book", "/my-books"]`) only checks for a session cookie and redirects to `/login?next=<path>`; `add-book/page.jsx` and `my-books/page.jsx` re-validate with `authClient.useSession()`. The navbar and those two pages are the `useSession()` consumers.
- Login honors `?next=` for email/password sign-in only; the Google button does not pass it.

## Next.js 16 specifics
- `cacheComponents: true`: data is uncached by default. Opt in with `'use cache'` (pair with `cacheLife(...)`); otherwise uncached reads must sit under `<Suspense>`, or prerendering/build fails.
- Synchronous render-time values such as `new Date()`, `Math.random()`, and `crypto.randomUUID()` also trigger prerender errors unless cached or streamed.
- `partialPrefetching: true`: `<Link>` prefetches a shared App Shell by default; use `prefetch={true}` only when URL-specific cached content must be prefetched. Automatic prefetching doesn't run in `next dev`, so verify with `next start`.
- `instant` route-segment config controls instant-navigation/static-shell validation; prefer caching or `<Suspense>` over `export const instant = false`. It cannot be used in Client Components.
- React Compiler is enabled; don't add `useMemo`/`useCallback` just to memoize.
- Turbopack is the bundler. `next.config.mjs` pipes `*.css` through `@tailwindcss/turbopack`; there is no PostCSS config.
- Read the version-matched docs in `node_modules/next/dist/docs/` before using unfamiliar 16.x APIs.

## Routes and data flow
- Public routes: `/`, `/all-books`, `/all-books/[bookId]`. Implemented private routes: `/add-book` and `/my-books`; the navbar also links to `/my-borrows` and `/profile`, and login links to `/forgot-password`, none of which exist.
- `/all-books` and `/all-books/[bookId]` call the Express API (`GET /all-books`, `GET /all-books/:id`) with `cache: "no-store"` inside `<Suspense>`; `cacheComponents` rejects uncached fetches at prerender time. The list page filters the fetched array by `?category=` (lowercased exact match).
- The home page's "New Arrivals" section (`src/components/home/new-arrivals.jsx`) fetches the same API under `<Suspense>`, sorts by `createdAt` descending, and renders the first 6.
- Add-book flow: the form posts a user-supplied image URL directly to Express `POST /add-book` with JSON including `userName`/`userEmail`; the Express server stores it in the `add-book` collection with `createdAt` and an ObjectId `_id`, then the form redirects to `/my-books`. The imgbb `POST /api/upload` route still exists but is no longer used by the form.
- `GET /all-books` merges `all-books` (seeded catalog) with `add-book` (user submissions), de-duplicated by `_id`; user submissions are sorted newest-first after the catalog. `GET /my-books?email=<email>` returns only that user's `add-book` documents, newest first. The detail route checks both collections.
- Book documents live in the `book-nook` database: seeded books in `all-books`, form submissions in `add-book`. Both share `_id`, `title`, `author`, `category`, `image`; submissions also have `description`, `userName`, `userEmail`, `createdAt`. New inserts use ObjectIds, but the detail route matches both string and ObjectId `_id`s.
- `next/image` allows any `http`/`https` host via `remotePatterns` in `next.config.mjs` so pasted cover URLs render; keep that in mind before tightening it.

## Styling and components
- No `tailwind.config.*`. Theme tokens and the `dark` variant live in `src/app/globals.css`.
- Dark mode is class-based (`.dark`). `data-theme="light"` on `<html>` is currently inert; don't rely on it.
- Add shadcn components with `npx shadcn add <name>`; `components.json` keeps output as JSX with the `base-nova` style.
- Shared primitives belong in `src/components/ui/`.
- Import `cn` from `@/lib/utils` (or directly from `cn`). This project uses the `cn` package, not `clsx` + `tailwind-merge`.

## Notes
- `README.md` is stale create-next-app boilerplate; trust `src/app` and the config files instead.
- Known rough edges: navbar logout calls `router.push` with no router in scope (throws at runtime), and the register page's Google button has no handler.
- Keep the managed `nextjs-agent-rules` block above; `next dev` recreates it.
- Loading UI: shared card/detail placeholders live in `src/components/books/book-skeletons.jsx`; route-level `loading.jsx` files live in `src/app/all-books/(list)/`, `src/app/all-books/[bookId]/`, and `src/app/my-books/` (the `(list)` route group keeps the grid loading UI from wrapping the detail route), and inline `<Suspense>` fallbacks cover the home New Arrivals section.
