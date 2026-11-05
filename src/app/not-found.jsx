import Link from "next/link";
import { BookOpen, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <span className="grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
        <BookOpen aria-hidden="true" className="size-7" />
      </span>

      <p className="mt-6 text-sm font-semibold tracking-widest text-primary uppercase">
        404
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-lg text-muted-foreground">
        This page is not on our shelves. It may have been moved or removed.
      </p>

      <Link href="/" className="mt-8">
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Home aria-hidden="true" className="size-4" />
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
