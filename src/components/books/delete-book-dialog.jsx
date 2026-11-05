"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { BOOKS_API } from "@/lib/api";
import { authFetch } from "@/lib/api-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";

export default function DeleteBookDialog({
  book,
  open,
  onOpenChange,
  onDeleted,
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (deleting) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await authFetch(`${BOOKS_API}/${book._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "Could not delete this book.");
      }

      toast.add({
        type: "success",
        title: "Book deleted",
        description: `"${book.title}" was removed from BookNook.`,
      });

      onDeleted(book._id);
      onOpenChange(false);
    } catch (deleteError) {
      const message = deleteError.message || "Something went wrong.";
      setError(message);
      toast.add({
        type: "error",
        title: "Could not delete book",
        description: message,
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <Trash2 aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete this book?</AlertDialogTitle>
          <AlertDialogDescription>
            &quot;{book.title}&quot; will be removed permanently. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting}
            className="gap-2 bg-red-600 text-white hover:bg-red-700"
          >
            {deleting ? (
              <Spinner />
            ) : (
              <Trash2 aria-hidden="true" className="size-4" />
            )}
            {deleting ? "Deleting…" : "Delete book"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
