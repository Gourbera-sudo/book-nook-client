"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, RotateCcw } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { BORROWS_API } from "@/lib/api";
import { authFetch } from "@/lib/api-client";
import LoadingState from "@/components/loading-state";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function MyBorrowsHeader() {
  return (
    <div>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        My Borrows
      </h1>
      <p className="mt-3 max-w-xl text-lg text-muted-foreground">
        Books you have borrowed from the community.
      </p>
    </div>
  );
}

export default function MyBorrowsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const email = user?.email ?? null;

  const [result, setResult] = useState({
    email: null,
    borrows: [],
    error: "",
  });
  const [returningId, setReturningId] = useState(null);

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/login?next=/my-borrows");
    }
  }, [isPending, user, router]);

  useEffect(() => {
    if (!email) {
      return undefined;
    }

    let cancelled = false;

    authFetch(BORROWS_API, {
      cache: "no-store",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Could not load your borrows (${response.status}).`);
        }

        return response.json();
      })
      .then((data) => {
        if (cancelled) {
          return;
        }

        setResult({
          email,
          borrows: Array.isArray(data) ? data : [],
          error: "",
        });
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }

        setResult({
          email,
          borrows: [],
          error: error.message || "Could not load your borrows.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [email]);

  const loading = Boolean(email) && result.email !== email;
  const borrows = result.email === email ? result.borrows : [];
  const error = result.email === email ? result.error : "";

  async function handleReturn(borrow) {
    if (!email || returningId) {
      return;
    }

    setReturningId(borrow._id);

    try {
      const response = await authFetch(`${BORROWS_API}/${borrow._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const updated = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(updated.error || "Could not return this book.");
      }

      setResult((current) => ({
        ...current,
        borrows: current.borrows.map((item) =>
          String(item._id) === String(borrow._id)
            ? { ...item, ...updated }
            : item,
        ),
      }));

      toast.add({
        type: "success",
        title: "Book returned",
        description: `"${borrow.bookTitle}" is available again.`,
      });
    } catch (error) {
      toast.add({
        type: "error",
        title: "Could not return book",
        description: error.message || "Something went wrong.",
      });
    } finally {
      setReturningId(null);
    }
  }

  if (isPending || loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <MyBorrowsHeader />
        <LoadingState label="Loading your borrows…" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <MyBorrowsHeader />

      {error ? (
        <p className="mt-10 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          {error} Make sure the books API is running at {BORROWS_API}.
        </p>
      ) : borrows.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            You have not borrowed any books yet.
          </p>
          <Link
            href="/all-books"
            className="mt-3 inline-block text-sm font-medium text-primary hover:text-foreground"
          >
            Browse books
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20 pl-4">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Borrow Date</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead className="pr-4 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {borrows.map((borrow) => {
                const isReturned = borrow.status === "returned";

                return (
                  <TableRow key={borrow._id}>
                    <TableCell className="py-3 pl-4">
                      <div className="relative aspect-[2/3] w-12 overflow-hidden rounded-md bg-muted">
                        {borrow.bookImage ? (
                          <Image
                            src={borrow.bookImage}
                            alt={`Cover of ${borrow.bookTitle}`}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="grid h-full place-items-center text-muted-foreground">
                            <BookOpen aria-hidden="true" className="size-5" />
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="whitespace-normal">
                      <Link
                        href={`/books/${borrow.bookId}`}
                        className="font-semibold text-foreground hover:text-primary"
                      >
                        {borrow.bookTitle}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        by {borrow.bookAuthor}
                      </p>
                      {isReturned ? (
                        <span className="mt-1 inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          Returned
                        </span>
                      ) : (
                        <span className="mt-1 inline-flex rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                          Borrowed
                        </span>
                      )}
                    </TableCell>

                    <TableCell>{formatDate(borrow.borrowedAt)}</TableCell>
                    <TableCell>
                      {isReturned ? formatDate(borrow.returnedAt) : "Not returned"}
                    </TableCell>

                    <TableCell className="pr-4 text-right">
                      {isReturned ? (
                        <span className="text-xs text-muted-foreground">
                          Completed
                        </span>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReturn(borrow)}
                          disabled={returningId === borrow._id}
                          className="gap-1.5"
                        >
                          {returningId === borrow._id ? (
                            <Spinner className="size-3.5" />
                          ) : (
                            <RotateCcw
                              aria-hidden="true"
                              className="size-3.5"
                            />
                          )}
                          Return Book
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
