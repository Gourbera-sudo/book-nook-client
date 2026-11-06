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
- Book data needs the separate Express server in `../book-nook-server` (run `node index.js` from that directory; it has its own `.env` with `MONGODB_URI` and no start script) on port 5000. `npm run dev` alone leaves `/`, `/all-books`, `/books/[bookId]`, `/my-books`, and `/my-borrows` showing "Could not load…" messages.
- If `next build` fails during prerendering, use `npx next build --debug-prerender` for full stack traces and all failing routes.

## Auth and environment
- better-auth 1.7 with the separate `@better-auth/mongo-adapter` package.
- Server config: `src/lib/auth.js` (creates the Mongo client at module load, database name hardcoded as `book-nook`). Browser client: `src/lib/auth-client.js`. Handler: `src/app/api/auth/[...all]/route.js`.
- `.env` (gitignored) defines `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `IMGBB_API_KEY`, `JWT_SECRET`, and `NEXT_PUBLIC_API_URL`. Auth needs the first three; Google sign-in needs the next two; `IMGBB_API_KEY` only feeds the now-unused `src/app/api/upload` route. `JWT_SECRET` must hold the same value in this `.env` and `../book-nook-server/.env`. `NEXT_PUBLIC_API_URL` points at the Express API (for example `http://localhost:5000`).
- No server-side session helper exists in Next. `src/proxy.js` (Next 16 proxy, matcher `["/add-book", "/my-books", "/my-borrows", "/books/:path*"]`) only checks for a session cookie and redirects to `/login?next=<path>`; `add-book/page.jsx`, `my-books/page.jsx`, `my-borrows/page.jsx`, and `books/[bookId]/page.jsx` re-validate with `authClient.useSession()`. The navbar and those pages are the `useSession()` consumers.
- API auth is JWT-based. `GET /api/auth/jwt` (`src/app/api/auth/jwt/route.js`) reads the better-auth session server-side and mints a 5-minute HS256 JWT (`sub`, `email`, `name`, issuer `book-nook`, audience `book-nook-api`). `src/lib/api-client.js` caches that token and exposes `authFetch` (protected calls, retries once on `401`) and `authFetchOptional` (public calls that use identity when available); use them instead of raw `fetch` for the Express API.
- The Express server verifies the `Authorization: Bearer <jwt>` header with `jose` in `requireAuth`, rejecting missing/invalid/expired tokens with `401`. It derives the email/name from the verified claims and ignores any email/name sent by the client. `POST /books`, `PATCH/DELETE /books/:id`, `POST/GET /borrows`, and `DELETE /borrows/:id` require it; `GET /books` is public and `GET /books/:id` uses the JWT only to flag the caller's own active borrow.
- Because the API is on port 5000 and the app on 3000, the server uses `cors({ origin: true, credentials: true })`; authenticated browser calls go through `authFetch`, which adds the bearer token. Keep the `JWT_SECRET` values in both `.env` files aligned.
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
- Public routes: `/`, `/all-books`. Implemented private routes: `/add-book`, `/my-books`, `/my-borrows`, and `/books/[bookId]`; the navbar also links to `/profile`, and login links to `/forgot-password`, neither of which exists.
- Express exposes exactly 8 routes: `GET /books` (public), `GET /books/:id`, `POST /books`, `PATCH /books/:id`, `DELETE /books/:id`, `POST /borrows`, `GET /borrows`, `DELETE /borrows/:id`. Requests build their URLs inline from `process.env.NEXT_PUBLIC_API_URL`; there is no `src/lib/api.js`.
- `/all-books` calls `GET /books` with `cache: "no-store"` and uses `<Suspense>` because `cacheComponents` rejects uncached fetches at prerender time. The list page filters the fetched array by `?category=` (lowercased exact match). `/books/[bookId]` is a client page that fetches `GET /books/:id` with credentials only after the session resolves.
- The old public `/all-books/[bookId]` URL is redirected to `/books/[bookId]` by `redirects()` in `next.config.mjs`; there is no page file for it.
- The home page's "New Arrivals" section (`src/components/home/new-arrivals.jsx`) fetches the same public API under `<Suspense>`, sorts by `createdAt` descending, and renders the first 6.
- Add-book flow: the form posts the book fields, `totalCopies`, and a user-supplied image URL to `POST /books`; the server stamps `userName`/`userEmail` from the verified JWT, stores the book in the `add-book` collection with `totalCopies`, `availableCopies`, `createdAt`, and an ObjectId `_id`, and the form redirects to `/my-books`. `totalCopies` must be a whole number of at least 1. The imgbb `POST /api/upload` route still exists but is no longer used by the form.
- `GET /books` merges `all-books` (seeded catalog) with `add-book` (user submissions), de-duplicated by `_id`; user submissions are sorted newest-first after the catalog. Every returned book is normalized to `totalCopies`/`availableCopies` (seeded books default to 1). `/my-books` fetches that public list and filters client-side by the signed-in `userEmail` (there is no email query parameter).
- My Books supports update and delete. `src/components/books/edit-book-dialog.jsx` opens a prefilled Dialog and `PATCH`es the book; `src/components/books/delete-book-dialog.jsx` uses an AlertDialog, `DELETE`s the book, and both show success toasts and update local state. Ownership is enforced server-side from the JWT; seeded books have no `userEmail`, so they cannot be edited or deleted. Deleting a book with an active borrow returns `409`.
- Borrow flow: `/books/[bookId]` shows the cover, title, author, category, description, and `Added by <name> (<masked email>)` (`maskEmail` in `src/lib/format.js`; seeded books show "Added by BookNook"). `src/components/books/borrow-button.jsx` opens a Dialog with read-only User Name/Email and a "Confirm Borrow" button, then posts `POST /borrows`. Owners cannot borrow their own book. Borrowing atomically decrements `availableCopies` (`$inc`-style pipeline); at 0 the button is disabled and reads "Not Available". `GET /books/:id` returns the caller's own `activeBorrow` (with `borrowedByMe`) plus the copy counts.
- Borrows live in `book-nook.borrows`: `bookId` (string), book snapshot fields, `ownerEmail`, `borrowerName`/`borrowerEmail`, `status` (`"borrowed"`/`"returned"`), `borrowedAt`, `returnedAt`. A unique partial index on `{ bookId, borrowerEmail }` where `status: "borrowed"` blocks one reader from holding the same book twice while allowing different readers to borrow different copies. `POST /borrows` also checks for an existing active borrow and returns `409` with "You have already borrowed this book"; the button surfaces that as an error toast. `DELETE /borrows/:id` marks the borrow `returned`, sets `returnedAt`, and increments `availableCopies` once (capped at `totalCopies`) instead of hard-deleting history. `/my-borrows` renders the signed-in user's borrows in a table (Image, Title, Borrow Date, Return Date, Return Book) and only active rows get the Return button.
- Book documents live in the `book-nook` database: seeded books in `all-books`, form submissions in `add-book`. Both share `_id`, `title`, `author`, `category`, `image`; submissions also have `description`, `totalCopies`, `availableCopies`, `userName`, `userEmail`, `createdAt`. New inserts use ObjectIds, but the detail route matches both string and ObjectId `_id`s.
- `next/image` allows any `http`/`https` host via `remotePatterns` in `next.config.mjs` so pasted cover URLs render; keep that in mind before tightening it.

## Styling and components
- No `tailwind.config.*`. Theme tokens and the `dark` variant live in `src/app/globals.css`.
- Palette is "Amethyst & Parchment": `globals.css` defines a `brand-50`–`brand-950` purple scale in `@theme`, and the shadcn tokens map onto it. The light parchment theme is the default (`--background` `#FAF7F0`, `--card` `#FFFDF8`, `--primary` `#7E22CE`, `--ring` `#A855F7`), and a deep-purple `.dark` block provides the dark tokens. `data-theme` is not used.
- Theme switching: `src/components/theme-toggle.jsx` toggles `.dark` on `<html>` and persists the choice to `localStorage` under `booknook-theme`. `src/app/layout.js` runs a pre-paint inline script that applies the stored value (falling back to `prefers-color-scheme`) before first paint, and sets `suppressHydrationWarning` on `<html>`. The toggle renders in both the desktop and mobile navbar.
- Animations: `framer-motion` with the reusable `src/components/motion/reveal.jsx` (`whileInView` entrance) and `src/components/motion/motion-provider.jsx` (`MotionConfig reducedMotion="user"`). `Reveal` is applied to home sections, the New Arrivals cards, and the All Books grid; keep new entrance animations subtle.
- Prefer semantic utilities (`bg-background`, `bg-card`, `bg-muted`, `bg-accent`, `text-foreground`, `text-muted-foreground`, `text-primary`, `border-border`, `ring-ring`) over raw `brand-*` shades so components stay consistent. Reserve `brand-*` for fixed decorative gradients and the hero overlay.
- Keep `--destructive` red for delete/error states.
- Add shadcn components with `npx shadcn add <name>`; `components.json` keeps output as JSX with the `base-nova` style.
- Shared primitives belong in `src/components/ui/`.
- Import `cn` from `@/lib/utils` (or directly from `cn`). This project uses the `cn` package, not `clsx` + `tailwind-merge`.

## Notes
- `README.md` is stale create-next-app boilerplate; trust `src/app` and the config files instead.
- Known rough edges: navbar logout calls `router.push` with no router in scope (throws at runtime), and the register page's Google button has no handler.
- Keep the managed `nextjs-agent-rules` block above; `next dev` recreates it.
- Page titles come from the root `metadata` template `BookNook | %s` in `src/app/layout.js`; each route sets a short title via its own `metadata` (Home uses an absolute `BookNook | Home`). Route-level `layout.js` files carry the title for client pages. The custom 404 is `src/app/not-found.jsx` with a "Back to Home" button.
- Loading UI: shared spinner is `src/components/loading-state.jsx` (wraps `Spinner`). Route-level `loading.jsx` files under `src/app/all-books/(list)/`, `src/app/books/[bookId]/`, `src/app/my-books/`, and `src/app/my-borrows/` show it (the `(list)` route group keeps the list loading UI from wrapping the detail route); inline `<Suspense>` fallbacks cover the home New Arrivals section, and client pages show the spinner while their API fetch is in flight. Skeleton components in `src/components/books/book-skeletons.jsx` still exist for the home/New Arrivals fallback.
