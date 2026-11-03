import { Suspense } from "react";
import Image from "next/image";
import { BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BOOKS_API = "http://localhost:5000/all-books";

async function getBooks() {
  const res = await fetch(BOOKS_API, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Books API responded with ${res.status}`);
  }

  const books = await res.json();
  return Array.isArray(books) ? books : [];
}

async function BookGrid() {
  let books;

  try {
    books = await getBooks();
  } catch (error) {
    console.error("Failed to load books:", error);

    return (
      <p className="mt-10 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
        Could not load books right now. Make sure the books API is running at{" "}
        {BOOKS_API}.
      </p>
    );
  }

  if (books.length === 0) {
    return (
      <p className="mt-10 rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
        No books have been added yet.
      </p>
    );
  }

  return (
    <>
      <p className="mt-8 text-sm font-medium text-sky-800/70">
        {books.length} books
      </p>

      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="grid h-full place-items-center text-sky-400">
                  <BookOpen aria-hidden="true" className="size-10" />
                </div>
              )}
            </div>

            <CardHeader>
              <CardTitle className="line-clamp-2 text-lg">
                {book.title}
              </CardTitle>
              <CardDescription>by {book.author}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
              {book.category ? (
                <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
                  {book.category}
                </span>
              ) : null}
            </CardContent>

            <CardFooter className="justify-center">
              <Button variant="outline" size="sm" className="bg-sky-600 text-white hover:bg-sky-600/10">
                View book
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}

function BookGridSkeleton() {
  return (
    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="h-104 animate-pulse rounded-xl bg-muted"
        />
      ))}
    </div>
  );
}

const AllBooks = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs font-medium tracking-widest text-sky-700 uppercase">
        Library
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
        All Books
      </h1>
      <p className="mt-3 max-w-xl text-lg text-sky-900/70">
        Browse our shelves and find your next read.
      </p>

      <Suspense fallback={<BookGridSkeleton />}>
        <BookGrid />
      </Suspense>
    </div>
  );
};

export default AllBooks;
