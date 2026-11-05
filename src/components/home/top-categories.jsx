import Link from "next/link";
import { ArrowRight, Atom, BookOpen, Landmark, Puzzle, Sparkles } from "lucide-react";

import Reveal from "@/components/motion/reveal";

const CATEGORIES = [
  { name: "Fiction", slug: "fiction", count: 4, Icon: BookOpen },
  { name: "Science", slug: "science", count: 4, Icon: Atom },
  { name: "History", slug: "history", count: 4, Icon: Landmark },
  { name: "Kids", slug: "kids", count: 3, Icon: Puzzle },
  { name: "Others", slug: "others", count: 4, Icon: Sparkles },
];

export default function TopCategories() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center rounded-full border border-border bg-accent px-3 py-1 text-xs font-medium tracking-widest text-accent-foreground uppercase">
              Explore
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Top Categories
            </h2>
            <p className="mt-3 max-w-xl text-lg text-muted-foreground">
              Find your next read by browsing the shelves our readers love most.
            </p>
          </div>

          <Link
            href="/all-books"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-foreground"
          >
            See all books
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map(({ name, slug, count, Icon }, index) => (
            <Reveal key={slug} className="h-full" delay={index * 0.06}>
              <Link
                href={`/all-books?category=${slug}`}
                className="group flex h-full flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-primary hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <span className="grid size-12 place-items-center rounded-full bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                <span className="mt-4 font-semibold text-md text-foreground">{name}</span>
                <span className="mt-1 text-md text-muted-foreground">
                  {count} books
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
