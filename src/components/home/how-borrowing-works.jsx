import { ArrowRightLeft, BookMarked, BookOpen } from "lucide-react";

import Reveal from "@/components/motion/reveal";

const STEPS = [
  {
    step: "01",
    title: "Discover",
    description:
      "Browse our curated collection by category or search for your next great read.",
    Icon: BookOpen,
  },
  {
    step: "02",
    title: "Request",
    description:
      "Find a book you love and send a borrow request to the owner in just a click.",
    Icon: ArrowRightLeft,
  },
  {
    step: "03",
    title: "Read & Return",
    description:
      "Enjoy your book at your own pace, then return it on time to keep the cycle going.",
    Icon: BookMarked,
  },
];

export default function HowBorrowingWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Reveal className="text-center">
        <span className="inline-flex items-center rounded-full border border-border bg-accent px-3 py-1 text-xs font-medium tracking-widest text-accent-foreground uppercase">
          Simple Process
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          How Borrowing Works
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          Get started in three easy steps and join our community of book lovers
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {STEPS.map(({ step, title, description, Icon }, index) => (
          <Reveal key={step} className="h-full" delay={index * 0.08}>
            <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-8 -right-4 text-8xl font-extrabold text-primary/10 select-none"
              >
                {step}
              </span>

              <div className="relative">
                <div className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-900 text-white shadow-lg shadow-brand-500/20">
                  <Icon aria-hidden="true" className="size-6" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-foreground">{title}</h3>
                <p className="mt-2 leading-7 text-muted-foreground">{description}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
