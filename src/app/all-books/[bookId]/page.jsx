import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";

const BOOKS_API = "http://localhost:5000/all-books";

async function BookDetails({ params }) {
  const { bookId } = await params;

  const res = await fetch(`${BOOKS_API}/${bookId}`, { cache: "no-store" });

  if (res.status === 404 || res.status === 400) {
    notFound();
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch book details for ID: ${bookId}`);
  }

  const book = await res.json();

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/all-books"
        className="inline-flex items-center gap-1.5 text-lg font-medium text-sky-700 transition-colors hover:text-sky-900"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to all books
      </Link>

      <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr] md:items-start">
        <div className="relative aspect-[2/3] w-full max-w-[240px] overflow-hidden rounded-xl bg-sky-100">
          {book.image ? (
            <Image
              src={book.image}
              alt={`Cover of ${book.title}`}
              fill
              sizes="240px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="grid h-full place-items-center text-sky-400">
              <BookOpen aria-hidden="true" className="size-12" />
            </div>
          )}
        </div>

        <div>
          {book.category ? (
            <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-md font-medium text-sky-700">
              {book.category}
            </span>
          ) : null}

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
            {book.title}
          </h1>
          <p className="mt-2 text-lg text-sky-900/70">by {book.author}</p>

          <p className="mt-6 text-sky-900/70 text-lg">
            {book.description ||
              "No description is available for this book yet."}
          </p>
        </div>
      </div>
    </article>
  );
}

function BookDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="h-4 w-32 animate-pulse rounded bg-muted" />

      <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr] md:items-start">
        <div className="aspect-[2/3] w-full max-w-[240px] animate-pulse rounded-xl bg-muted" />
        <div className="space-y-3">
          <div className="h-5 w-20 animate-pulse rounded bg-muted" />
          <div className="h-9 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-40 animate-pulse rounded bg-muted" />
          <div className="h-16 w-full animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

const BookDetailsPage = ({ params }) => {
  return (
    <Suspense fallback={<BookDetailsSkeleton />}>
      <BookDetails params={params} />
    </Suspense>
  );
};

export default BookDetailsPage;
