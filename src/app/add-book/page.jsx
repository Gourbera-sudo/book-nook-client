"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImagePlus, Plus } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { authFetch } from "@/lib/api-client";
import { normalizeImageUrl } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export default function AddBookPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const formRef = useRef(null);
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previewError, setPreviewError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const previewUrl = normalizeImageUrl(imageUrl);

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/login?next=/add-book");
    }
  }, [isPending, user, router]);

  function resetForm() {
    formRef.current?.reset();
    setCategory("");
    setImageUrl("");
    setPreviewError(false);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const author = String(formData.get("author") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const totalCopies = Number(
      String(formData.get("totalCopies") ?? "").trim(),
    );

    if (!title || !author || !description) {
      setError("Title, author, and short description are required.");
      return;
    }

    if (!category) {
      setError("Please choose a category.");
      return;
    }

    if (!Number.isInteger(totalCopies) || totalCopies < 1) {
      setError("Total copies must be a whole number of at least 1.");
      return;
    }

    if (!previewUrl) {
      setError("Please enter a valid image URL starting with http:// or https://.");
      return;
    }

    setSubmitting(true);

    try {
      const bookResponse = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          category,
          description,
          image: previewUrl,
          totalCopies,
        }),
      });
      const bookResult = await bookResponse.json().catch(() => ({}));

      if (!bookResponse.ok) {
        throw new Error(bookResult.error || "Could not save the book.");
      }

      toast.add({
        type: "success",
        title: "Book added",
        description: `"${title}" is now in My Books.`,
      });

      resetForm();
      router.refresh();
      router.push("/my-books");
    } catch (submitError) {
      const message = submitError.message || "Something went wrong.";
      setError(message);
      toast.add({
        type: "error",
        title: "Could not add book",
        description: message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-3 text-muted-foreground">
        <Spinner className="size-5" />
        Loading your account…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-3 text-muted-foreground">
        <Spinner className="size-5" />
        Redirecting to login…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/all-books"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to all books
      </Link>

      <p className="mt-6 text-xs font-medium tracking-widest text-primary uppercase">
        Library
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Add a New Book
      </h1>
      <p className="mt-3 max-w-xl text-lg text-muted-foreground">
        Share a book from your shelf with the BookNook community.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Book details</CardTitle>
          <CardDescription>
            Fill in the information below and add a cover image URL.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="title">Book Title</FieldLabel>
                  <Input
                    id="title"
                    name="title"
                    placeholder="The Silent Library"
                    maxLength={160}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="author">Author Name</FieldLabel>
                  <Input
                    id="author"
                    name="author"
                    placeholder="Emma Clarke"
                    maxLength={120}
                    required
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="category">Category</FieldLabel>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" className="w-full">
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
                <FieldDescription>
                  Pick the shelf this book belongs to.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="totalCopies">Total Copies</FieldLabel>
                <Input
                  id="totalCopies"
                  name="totalCopies"
                  type="number"
                  min={1}
                  max={999}
                  step={1}
                  defaultValue={1}
                  required
                />
                <FieldDescription>
                  How many copies of this book can be borrowed at once.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="imageUrl">Book Image URL</FieldLabel>
                <div className="flex flex-wrap items-start gap-4">
                  <div className="grid size-36 shrink-0 place-items-center overflow-hidden rounded-xl border border-dashed border-border bg-muted">
                    {previewUrl && !previewError ? (
                      <Image
                        src={previewUrl}
                        alt="Book cover preview"
                        width={144}
                        height={216}
                        unoptimized
                        onError={() => setPreviewError(true)}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-primary">
                        <ImagePlus aria-hidden="true" className="size-7" />
                        <span className="text-xs font-medium">Cover preview</span>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      type="url"
                      placeholder="https://example.com/cover.jpg"
                      value={imageUrl}
                      onChange={(event) => {
                        setImageUrl(event.target.value);
                        setPreviewError(false);
                        setError("");
                      }}
                      required
                    />
                    <FieldDescription>
                      Paste a direct link to the cover image (JPG, PNG, GIF, or
                      WebP).
                    </FieldDescription>
                  </div>
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Short Description</FieldLabel>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="What is this book about?"
                  rows={5}
                  maxLength={600}
                  required
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="userName">User Name</FieldLabel>
                  <Input
                    id="userName"
                    name="userName"
                    value={user.name ?? ""}
                    readOnly
                    className="bg-muted/50"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="userEmail">Email</FieldLabel>
                  <Input
                    id="userEmail"
                    name="userEmail"
                    type="email"
                    value={user.email ?? ""}
                    readOnly
                    className="bg-muted/50"
                  />
                </Field>
              </div>

              {error ? <FieldError>{error}</FieldError> : null}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetForm}
                  disabled={submitting}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {submitting ? (
                    <>
                      <Spinner />
                      Adding…
                    </>
                  ) : (
                    <>
                      <Plus aria-hidden="true" className="size-4" />
                      Add Book
                    </>
                  )}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
