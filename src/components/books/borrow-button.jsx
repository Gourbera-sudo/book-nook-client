"use client";

import { useState } from "react";
import Link from "next/link";
import { BookCheck, BookOpen, BookX, Loader2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { authFetch } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

function readCopies(book) {
  const total = Number.isInteger(book.totalCopies) ? book.totalCopies : 1;
  const available = Number.isInteger(book.availableCopies)
    ? book.availableCopies
    : total;

  return { total, available };
}

export default function BorrowButton({ book }) {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const email = user?.email ?? null;

  const initialCopies = readCopies(book);
  const [totalCopies] = useState(initialCopies.total);
  const [availableCopies, setAvailableCopies] = useState(initialCopies.available);
  const [activeBorrow, setActiveBorrow] = useState(book.activeBorrow ?? null);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isOwner = Boolean(
    email &&
      book.userEmail &&
      String(book.userEmail).toLowerCase() === email.toLowerCase(),
  );

  async function handleConfirm() {
    if (!email || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/borrows`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: String(book._id),
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = result.error || "Could not borrow this book.";

        if (response.status === 409) {
          if (/already borrowed/i.test(message)) {
            setActiveBorrow({
              _id: null,
              borrowerName: user?.name ?? "",
              borrowedAt: null,
              borrowedByMe: true,
            });
          } else if (/available/i.test(message)) {
            setAvailableCopies(0);
          }
        }

        throw new Error(message);
      }

      setActiveBorrow({
        _id: String(result._id),
        borrowerName: result.borrowerName ?? "",
        borrowedAt: result.borrowedAt ?? null,
        borrowedByMe: true,
      });
      setAvailableCopies((current) =>
        Number.isInteger(result.availableCopies)
          ? result.availableCopies
          : Math.max(0, current - 1),
      );
      setOpen(false);

      toast.add({
        type: "success",
        title: "Book borrowed",
        description: `"${book.title}" is now in My Borrows.`,
      });
    } catch (error) {
      toast.add({
        type: "error",
        title: "Could not borrow book",
        description: error.message || "Something went wrong.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  let action;

  if (isOwner) {
    action = (
      <>
        <Button variant="outline" disabled className="w-fit">
          <BookOpen aria-hidden="true" className="size-4" />
          This is your book
        </Button>
        <p className="text-sm text-muted-foreground">
          You added this book, so it cannot be borrowed.
        </p>
      </>
    );
  } else if (!email) {
    action = (
      <Button variant="outline" disabled className="w-fit">
        <Loader2 aria-hidden="true" className="size-4 animate-spin" />
        Checking availability…
      </Button>
    );
  } else if (activeBorrow?.borrowedByMe) {
    action = (
      <>
        <Button disabled className="w-fit bg-primary text-primary-foreground">
          <BookCheck aria-hidden="true" className="size-4" />
          Borrowed
        </Button>
        <Link
          href="/my-borrows"
          className="text-sm font-medium text-primary hover:text-foreground"
        >
          View in My Borrows
        </Link>
      </>
    );
  } else if (availableCopies <= 0) {
    action = (
      <>
        <Button variant="outline" disabled className="w-fit">
          <BookX aria-hidden="true" className="size-4" />
          Not Available
        </Button>
        <p className="text-sm text-muted-foreground">
          All copies are currently borrowed.
        </p>
      </>
    );
  } else {
    action = (
      <>
        <Button
          onClick={() => setOpen(true)}
          className="w-fit bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <BookOpen aria-hidden="true" className="size-4" />
          Borrow This Book
        </Button>
        <p className="text-sm text-muted-foreground">
          {availableCopies} of {totalCopies}{" "}
          {totalCopies === 1 ? "copy" : "copies"} available.
        </p>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {action}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Borrow this book</DialogTitle>
            <DialogDescription>
              Confirm your details to borrow &quot;{book.title}&quot;.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="borrow-user-name">User Name</FieldLabel>
              <Input
                id="borrow-user-name"
                value={user?.name ?? ""}
                readOnly
                className="bg-muted/50"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="borrow-user-email">Email</FieldLabel>
              <Input
                id="borrow-user-email"
                type="email"
                value={email ?? ""}
                readOnly
                className="bg-muted/50"
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={submitting}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {submitting ? (
                <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              ) : (
                <BookOpen aria-hidden="true" className="size-4" />
              )}
              {submitting ? "Borrowing…" : "Confirm Borrow"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
