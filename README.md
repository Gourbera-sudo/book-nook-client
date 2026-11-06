# BookNook

**Live site:** [https://book-nook-client.vercel.app](https://book-nook-client.vercel.app)

BookNook is a calm, curated online library for curious readers. Browse the shelves, add the books you love to the collection, borrow from other readers, and keep track of everything you have read — all in one place.

## Features

- **Browse a curated library** — explore the full collection at `/all-books`, filter by category, and open any title for its cover, description, owner, and live copy availability.
- **Add books to the shared shelf** — signed-in readers can submit a book with a cover image, category, description, and number of copies; it appears in the catalog right away.
- **Borrow and return with confidence** — request a copy from another reader, see availability update as copies are taken, and return a book with one click from your borrows page.
- **Personal shelves** — `/my-books` lets owners edit or delete their own submissions, while `/my-borrows` keeps active and returned loans in a single, easy-to-scan table.
- **Secure accounts and protected actions** — email/password and Google sign-in are handled by better-auth, and every write to the API is protected by a short-lived JWT with server-side ownership checks.
- **Light and dark themes** — a navbar toggle remembers the reader's choice in `localStorage`, follows the system preference on first visit, and applies before first paint to avoid a flash.
- **Responsive, polished interface** — Tailwind CSS v4, shadcn/ui components on Base UI, and subtle Framer Motion entrance animations that respect the user's reduced-motion setting.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack, React Compiler) |
| UI | React 19, Tailwind CSS v4, shadcn/ui (Base UI), lucide-react |
| Animation | Framer Motion |
| Auth | better-auth with the MongoDB adapter (email/password + Google) |
| Database | MongoDB |
| API | Separate Express server (`../book-nook-server`) on port 5000 |
| Language | JavaScript (`.js` / `.jsx`) |

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the environment

Create a `.env` file in the project root:

```env
MONGODB_URI=your-mongodb-connection-string
BETTER_AUTH_SECRET=your-better-auth-secret
BETTER_AUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

JWT_SECRET=the-same-secret-used-by-the-api
NEXT_PUBLIC_API_URL=http://localhost:5000
```

- `MONGODB_URI`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL` are required for authentication.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` enable Google sign-in.
- `JWT_SECRET` must match the value in `../book-nook-server/.env`.
- `NEXT_PUBLIC_API_URL` points the client at the Express API.

### 3. Start the API

Book browsing, borrowing, and book management are served by the companion Express API. From `../book-nook-server`:

```bash
node index.js
```

### 4. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> Without the API running, `/`, `/all-books`, `/books/[bookId]`, `/my-books`, and `/my-borrows` will show "Could not load…" messages.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Turbopack dev server at http://localhost:3000 |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Home page with banner, new arrivals, how borrowing works, and categories |
| `/all-books` | Public | Full catalog with category filtering |
| `/books/[bookId]` | Signed in | Book details, availability, and borrow action |
| `/add-book` | Signed in | Submit a new book to the collection |
| `/my-books` | Signed in | Edit or delete books you added |
| `/my-borrows` | Signed in | View and return your borrowed books |
| `/login`, `/register` | Public | Authentication pages |

## Project structure

```text
src/
├── app/                 # App Router pages, layouts, and API routes
│   ├── (auth)/          # /login and /register
│   ├── all-books/       # Catalog list
│   ├── books/[bookId]/  # Book detail
│   ├── add-book/        # Add a book
│   ├── my-books/        # Manage your submissions
│   ├── my-borrows/      # Manage your loans
│   └── api/auth/        # better-auth handler and JWT minting
├── components/
│   ├── books/           # Borrow, edit, and delete dialogs
│   ├── home/            # Home page sections
│   ├── motion/          # Reveal animation and motion provider
│   ├── ui/              # shadcn/ui primitives
│   ├── navbar.jsx
│   ├── footer.jsx
│   └── theme-toggle.jsx
├── hooks/
└── lib/                 # Auth clients, API helpers, and formatting
```

## API overview

The Express API exposes eight routes:

- `GET /books` — public catalog
- `GET /books/:id` — single book with the caller's active borrow
- `POST /books` — add a book
- `PATCH /books/:id` — update your own book
- `DELETE /books/:id` — delete your own book
- `POST /borrows` — borrow a copy
- `GET /borrows` — list your borrows
- `DELETE /borrows/:id` — return a book

All write routes require an `Authorization: Bearer <jwt>` header. The client obtains that token from `GET /api/auth/jwt`, which mints a short-lived token from the current better-auth session.
