"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { authFetch } from "@/lib/api-client";
import { normalizeImageUrl } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";

const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"];

function EditBookForm({ book, onOpenChange, onSaved }) {
  const [values, setValues] = useState({
    title: book.title ?? "",
    author: book.author ?? "",
    category: book.category ?? "",
    image: book.image ?? "",
    description: book.description ?? "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const image = normalizeImageUrl(values.image);
    const missing = ["title", "author", "category", "description"].filter(
      (field) => !values[field].trim(),
    );

    if (missing.length > 0) {
      setError("Title, author, category, and description are required.");
      return;
    }

    if (!image) {
      setError("Please enter a valid image URL starting with http:// or https://.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${book._id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title.trim(),
          author: values.author.trim(),
          category: values.category.trim(),
          image,
          description: values.description.trim(),
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "Could not update this book.");
      }

      toast.add({
        type: "success",
        title: "Book updated",
        description: `"${result.title}" has been saved.`,
      });

      onSaved(result);
      onOpenChange(false);
    } catch (submitError) {
      const message = submitError.message || "Something went wrong.";
      setError(message);
      toast.add({
        type: "error",
        title: "Could not update book",
        description: message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="edit-title">Book Title</FieldLabel>
            <Input
              id="edit-title"
              value={values.title}
              onChange={(event) => update("title", event.target.value)}
              maxLength={160}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="edit-author">Author Name</FieldLabel>
            <Input
              id="edit-author"
              value={values.author}
              onChange={(event) => update("author", event.target.value)}
              maxLength={120}
              required
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="edit-category">Category</FieldLabel>
          <Select
            value={values.category}
            onValueChange={(value) => update("category", value)}
          >
            <SelectTrigger id="edit-category" className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="edit-image">Book Image URL</FieldLabel>
          <Input
            id="edit-image"
            type="url"
            value={values.image}
            onChange={(event) => update("image", event.target.value)}
            placeholder="https://example.com/cover.jpg"
            required
          />
          <FieldDescription>
            Paste a direct link to the cover image.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="edit-description">Short Description</FieldLabel>
          <Textarea
            id="edit-description"
            value={values.description}
            onChange={(event) => update("description", event.target.value)}
            rows={4}
            maxLength={600}
            required
          />
        </Field>

        {error ? <FieldError>{error}</FieldError> : null}
      </FieldGroup>

      <DialogFooter className="mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {submitting ? (
            <Spinner />
          ) : (
            <Save aria-hidden="true" className="size-4" />
          )}
          {submitting ? "Saving…" : "Save changes"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function EditBookDialog({ book, open, onOpenChange, onSaved }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit book</DialogTitle>
          <DialogDescription>
            Update the details for &quot;{book.title}&quot; and save your changes.
          </DialogDescription>
        </DialogHeader>

        {open ? (
          <EditBookForm
            key={book._id}
            book={book}
            onOpenChange={onOpenChange}
            onSaved={onSaved}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
