import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { BookGridSkeleton } from "@/components/books/book-skeletons";
import Reveal from "@/components/motion/reveal";
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

const NEW_ARRIVALS_COUNT = 6;

async function getNewArrivals() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, { cache: "no-store" });

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
          running at {process.env.NEXT_PUBLIC_API_URL}/books.
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
      <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center rounded-full border border-border bg-accent px-3 py-1 text-xs font-medium tracking-widest text-accent-foreground uppercase">
            Fresh off the shelf
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            New Arrivals
          </h2>
          <p className="mt-3 max-w-xl text-lg text-muted-foreground">
            The latest additions to our library, ready to borrow.
          </p>
        </div>

        <Link
          href="/all-books"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-foreground"
        >
          View all books
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </Reveal>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {books.map((book, index) => (
          <Reveal
            key={book._id}
            className="h-full"
            delay={(index % 6) * 0.05}
            amount={0.05}
          >
            <Card className="group h-full gap-3 pt-0 transition-all hover:-translate-y-1 hover:ring-primary/40">
              <div className="relative aspect-2/3 w-full overflow-hidden rounded-t-xl bg-muted">
                {book.image ? (
                  <Image
                    src={book.image}
                    alt={`Cover of ${book.title}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 16vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-muted-foreground">
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
                  <span className="inline-flex rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                    {book.category}
                  </span>
                ) : null}
              </CardContent>

              <CardFooter className="justify-center">
                <Link href={`/books/${book._id}`} className="w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </Reveal>
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
