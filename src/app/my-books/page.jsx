"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Pencil, Plus, Trash2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { BOOKS_API } from "@/lib/api";
import DeleteBookDialog from "@/components/books/delete-book-dialog";
import EditBookDialog from "@/components/books/edit-book-dialog";
import LoadingState from "@/components/loading-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const GRID_CLASS =
  "mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

function formatCopies(book) {
  const total = Number.isInteger(book.totalCopies) ? book.totalCopies : 1;
  const available = Number.isInteger(book.availableCopies)
    ? book.availableCopies
    : total;

  return `${available} of ${total} ${total === 1 ? "copy" : "copies"} available`;
}

function MyBooksHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs font-medium tracking-widest text-primary uppercase">
          Your shelf
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          My Books
        </h1>
        <p className="mt-3 max-w-xl text-lg text-muted-foreground">
          Books you have shared with BookNook.
        </p>
      </div>

      <Link href="/add-book">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
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
  const [editingBook, setEditingBook] = useState(null);
  const [deletingBook, setDeletingBook] = useState(null);

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

    fetch(BOOKS_API, {
      cache: "no-store",
      credentials: "include",
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

        const allBooks = Array.isArray(data) ? data : [];
        const mine = allBooks.filter(
          (book) =>
            String(book.userEmail ?? "").toLowerCase() === email.toLowerCase(),
        );

        setResult({
          email,
          books: mine,
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

  function handleSaved(updated) {
    setResult((current) => ({
      ...current,
      books: current.books.map((book) =>
        String(book._id) === String(updated._id)
          ? { ...book, ...updated }
          : book,
      ),
    }));
  }

  function handleDeleted(id) {
    setResult((current) => ({
      ...current,
      books: current.books.filter((book) => String(book._id) !== String(id)),
    }));
  }

  if (isPending || loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <MyBooksHeader />
        <LoadingState label="Loading your books…" />
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
          {error} Make sure the books API is running at {BOOKS_API}.
        </p>
      ) : books.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            You have not added any books yet.
          </p>
          <Link
            href="/add-book"
            className="mt-3 inline-block text-sm font-medium text-primary hover:text-foreground"
          >
            Add your first book
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-8 text-sm font-medium text-muted-foreground">
            {books.length} {books.length === 1 ? "book" : "books"}
          </p>

          <div className={GRID_CLASS}>
            {books.map((book) => (
              <Card
                key={book._id}
                className="group h-full gap-3 pt-0 transition-all hover:-translate-y-1 hover:ring-primary/40"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-t-xl bg-muted">
                  {book.image ? (
                    <Image
                      src={book.image}
                      alt={`Cover of ${book.title}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-muted-foreground">
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
                    <span className="inline-flex rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                      {book.category}
                    </span>
                  ) : null}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatCopies(book)}
                  </p>
                </CardContent>

                <CardFooter className="flex-wrap justify-center gap-2">
                  <Link href={`/books/${book._id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      View
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingBook(book)}
                  >
                    <Pencil aria-hidden="true" className="size-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingBook(book)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 aria-hidden="true" className="size-3.5" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}

      {editingBook ? (
        <EditBookDialog
          book={editingBook}
          open
          onOpenChange={(open) => {
            if (!open) {
              setEditingBook(null);
            }
          }}
          onSaved={handleSaved}
        />
      ) : null}

      {deletingBook ? (
        <DeleteBookDialog
          book={deletingBook}
          open
          onOpenChange={(open) => {
            if (!open) {
              setDeletingBook(null);
            }
          }}
          onDeleted={handleDeleted}
        />
      ) : null}
    </div>
  );
}
