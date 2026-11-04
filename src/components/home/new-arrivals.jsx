import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import { BookGridSkeleton } from "@/components/books/book-skeletons";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BOOKS_API = "http://localhost:5000/all-books";
const NEW_ARRIVALS_COUNT = 6;

async function getNewArrivals() {
  const res = await fetch(BOOKS_API, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Books API responded with ${res.status}`);
  }

  const books = await res.json();

  if (!Array.isArray(books)) {
    return [];
  }

  return books
    .slice()
    .sort(
      (first, second) =>
        new Date(second.createdAt ?? 0) - new Date(first.createdAt ?? 0),
    )
    .slice(0, NEW_ARRIVALS_COUNT);
}

export async function NewArrivals() {
  let books;

  try {
    books = await getNewArrivals();
  } catch (error) {
    console.error("Failed to load new arrivals:", error);

    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          Could not load new arrivals right now. Make sure the books API is
          running at {BOOKS_API}.
        </p>
      </section>
    );
  }

  if (books.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
          No books have been added yet.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-medium tracking-widest text-sky-700 uppercase">
            Fresh off the shelf
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
            New Arrivals
          </h2>
          <p className="mt-3 max-w-xl text-lg text-sky-900/70">
            The latest additions to our library, ready to borrow.
          </p>
        </div>

        <Link
          href="/all-books"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700 transition-colors hover:text-sky-900"
        >
          View all books
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {books.map((book) => (
          <Card
            key={book._id}
            className="group h-full gap-3 pt-0 transition-all hover:-translate-y-1 hover:ring-sky-400/60"
          >
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-t-xl bg-sky-100">
              {book.image ? (
                <Image
                  src={book.image}
                  alt={`Cover of ${book.title}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 16vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="grid h-full place-items-center text-sky-400">
                  <BookOpen aria-hidden="true" className="size-10" />
                </div>
              )}
            </div>

            <CardHeader>
              <CardTitle className="line-clamp-2 text-base">
                {book.title}
              </CardTitle>
              <CardDescription className="line-clamp-1 text-sm">
                by {book.author}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
              {book.category ? (
                <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
                  {book.category}
                </span>
              ) : null}
            </CardContent>

            <CardFooter className="justify-center">
              <Link href={`/all-books/${book._id}`} className="w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-sky-600 text-white hover:bg-sky-600/10"
                >
                  View Details
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function NewArrivalsSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <Skeleton className="h-5 w-32 rounded-full" />
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <BookGridSkeleton
        count={NEW_ARRIVALS_COUNT}
        className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6"
      />
    </section>
  );
}
