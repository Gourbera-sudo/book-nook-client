"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Plus } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { BookGridSkeleton } from "@/components/books/book-skeletons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MY_BOOKS_API = "http://localhost:5000/my-books";

const GRID_CLASS =
  "mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

function MyBooksHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs font-medium tracking-widest text-sky-700 uppercase">
          Your shelf
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
          My Books
        </h1>
        <p className="mt-3 max-w-xl text-lg text-sky-900/70">
          Books you have shared with BookNook.
        </p>
      </div>

      <Link href="/add-book">
        <Button className="bg-sky-600 text-white hover:bg-sky-700">
          <Plus aria-hidden="true" className="size-4" />
          Add a book
        </Button>
      </Link>
    </div>
  );
}

export default function MyBooksPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const email = user?.email ?? null;

  const [result, setResult] = useState({
    email: null,
    books: [],
    error: "",
  });

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/login?next=/my-books");
    }
  }, [isPending, user, router]);

  useEffect(() => {
    if (!email) {
      return undefined;
    }

    let cancelled = false;

    fetch(`${MY_BOOKS_API}?email=${encodeURIComponent(email)}`, {
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Could not load your books (${response.status}).`);
        }

        return response.json();
      })
      .then((data) => {
        if (cancelled) {
          return;
        }

        setResult({
          email,
          books: Array.isArray(data) ? data : [],
          error: "",
        });
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }

        setResult({
          email,
          books: [],
          error: error.message || "Could not load your books.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [email]);

  const loading = Boolean(email) && result.email !== email;
  const books = result.email === email ? result.books : [];
  const error = result.email === email ? result.error : "";

  if (isPending || loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <MyBooksHeader />
        <BookGridSkeleton count={4} className={GRID_CLASS} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <MyBooksHeader />

      {error ? (
        <p className="mt-10 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          {error} Make sure the books API is running at {MY_BOOKS_API}.
        </p>
      ) : books.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            You have not added any books yet.
          </p>
          <Link
            href="/add-book"
            className="mt-3 inline-block text-sm font-medium text-sky-700 hover:text-sky-900"
          >
            Add your first book
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-8 text-sm font-medium text-sky-800/70">
            {books.length} {books.length === 1 ? "book" : "books"}
          </p>

          <div className={GRID_CLASS}>
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
                  <Link href={`/all-books/${book._id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-sky-600 text-white hover:bg-sky-600/10"
                    >
                      View book
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
