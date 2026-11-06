"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { authFetchOptional } from "@/lib/api-client";
import BorrowButton from "@/components/books/borrow-button";
import LoadingState from "@/components/loading-state";
import { maskEmail } from "@/lib/format";

function getOwnerLabel(book) {
  const email = String(book.userEmail ?? "").trim();
  const name = String(book.userName ?? "").trim();

  if (!email) {
    return "Added by BookNook";
  }

  if (name) {
    return `Added by ${name} (${maskEmail(email)})`;
  }

  return `Added by ${maskEmail(email)}`;
}

export default function BookDetailsPage() {
  const params = useParams();
  const bookId = Array.isArray(params.bookId) ? params.bookId[0] : params.bookId;
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const email = user?.email ?? null;

  const [result, setResult] = useState({
    bookId: null,
    book: null,
    error: "",
    notFound: false,
  });

  useEffect(() => {
    if (!isPending && !user) {
      router.replace(`/login?next=${encodeURIComponent(`/books/${bookId}`)}`);
    }
  }, [isPending, user, router, bookId]);

  useEffect(() => {
    if (!bookId || !email) {
      return undefined;
    }

    let cancelled = false;

    authFetchOptional(`${process.env.NEXT_PUBLIC_API_URL}/books/${encodeURIComponent(bookId)}`, {
      cache: "no-store",
      credentials: "include",
    })
      .then((response) => {
        if (response.status === 404 || response.status === 400) {
          return null;
        }

        if (!response.ok) {
          throw new Error(`Could not load this book (${response.status}).`);
        }

        return response.json();
      })
      .then((book) => {
        if (cancelled) {
          return;
        }

        if (!book) {
          setResult({ bookId, book: null, error: "", notFound: true });
          return;
        }

        setResult({ bookId, book, error: "", notFound: false });
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }

        setResult({
          bookId,
          book: null,
          error: error.message || "Could not load this book.",
          notFound: false,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [bookId, email]);

  const loading = Boolean(email) && result.bookId !== bookId;
  const book = result.bookId === bookId ? result.book : null;
  const error = result.bookId === bookId ? result.error : "";
  const notFound = result.bookId === bookId ? result.notFound : false;

  if (isPending || loading) {
    return <LoadingState label="Loading book…" />;
  }

  if (!user) {
    return null;
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          Book not found
        </h1>
        <p className="mt-2 text-muted-foreground">
          This book may have been removed from the shelf.
        </p>
        <Link
          href="/all-books"
          className="mt-6 inline-block text-sm font-medium text-primary hover:text-foreground"
        >
          Back to all books
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          {error} Make sure the books API is running at {process.env.NEXT_PUBLIC_API_URL}/books.
        </p>
      </div>
    );
  }

  if (!book) {
    return null;
  }

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/all-books"
        className="inline-flex items-center gap-1.5 text-lg font-medium text-primary transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to all books
      </Link>

      <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr] md:items-start">
        <div className="relative aspect-[2/3] w-full max-w-[240px] overflow-hidden rounded-xl bg-muted">
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
            <div className="grid h-full place-items-center text-muted-foreground">
              <BookOpen aria-hidden="true" className="size-12" />
            </div>
          )}
        </div>

        <div>
          {book.category ? (
            <span className="inline-flex rounded-full bg-accent px-3 py-1 text-md font-medium text-accent-foreground">
              {book.category}
            </span>
          ) : null}

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {book.title}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">by {book.author}</p>

          <p className="mt-6 text-lg text-muted-foreground">
            {book.description ||
              "No description is available for this book yet."}
          </p>

          <p className="mt-4 text-sm text-muted-foreground">{getOwnerLabel(book)}</p>

          <div className="mt-8">
            <BorrowButton book={book} />
          </div>
        </div>
      </div>
    </article>
  );
}
