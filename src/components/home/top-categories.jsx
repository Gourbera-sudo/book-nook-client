import Link from "next/link";
import { ArrowRight, Atom, BookOpen, Landmark, Puzzle, Sparkles } from "lucide-react";

const CATEGORIES = [
  { name: "Fiction", slug: "fiction", count: 4, Icon: BookOpen },
  { name: "Science", slug: "science", count: 4, Icon: Atom },
  { name: "History", slug: "history", count: 4, Icon: Landmark },
  { name: "Kids", slug: "kids", count: 3, Icon: Puzzle },
  { name: "Others", slug: "others", count: 4, Icon: Sparkles },
];

export default function TopCategories() {
  return (
    <section className="border-y border-sky-200 bg-sky-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-medium tracking-widest text-sky-700 uppercase">
              Explore
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
              Top Categories
            </h2>
            <p className="mt-3 max-w-xl text-lg text-sky-900/70">
              Find your next read by browsing the shelves our readers love most.
            </p>
          </div>

          <Link
            href="/all-books"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700 transition-colors hover:text-sky-900"
          >
            See all books
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map(({ name, slug, count, Icon }) => (
            <Link
              key={slug}
              href={`/all-books?category=${slug}`}
              className="group flex flex-col items-center rounded-2xl border border-sky-200 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-sky-400 hover:shadow-md focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
            >
              <span className="grid size-12 place-items-center rounded-full bg-sky-100 text-sky-600 transition-colors group-hover:bg-sky-600 group-hover:text-white">
                <Icon aria-hidden="true" className="size-6" />
              </span>
              <span className="mt-4 font-semibold text-md text-sky-950">{name}</span>
              <span className="mt-1 text-md text-sky-800/70">
                {count} books
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
