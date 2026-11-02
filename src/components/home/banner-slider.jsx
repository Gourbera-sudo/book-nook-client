"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { A11y, Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    eyebrow: "Welcome to BookNook",
    title: "Find your next favorite book",
    text: "Explore fiction, science, history, kids' books, and more from our growing collection.",
    image: "/images/banner/library-1.jpg",
    overlay:
      "bg-gradient-to-r from-sky-950/95 via-blue-950/80 to-blue-900/70 lg:to-blue-900/25",
  },
  {
    eyebrow: "Borrow with ease",
    title: "Books are better shared",
    text: "Borrow from fellow readers, keep track of your loans, and return when you're done.",
    image: "/images/banner/library-2.jpg",
    overlay:
      "bg-gradient-to-r from-blue-950/95 via-sky-950/80 to-cyan-950/70 lg:to-cyan-900/25",
  },
  {
    eyebrow: "For every reader",
    title: "A shelf for every curious mind",
    text: "From timeless classics to modern discoveries, there is always something new waiting for you.",
    image: "/images/banner/library-3.jpg",
    overlay:
      "bg-gradient-to-r from-indigo-950/95 via-blue-950/80 to-sky-950/70 lg:to-sky-900/25",
  },
];

export default function BannerSlider() {
  return (
    <section
      aria-label="Featured books"
      className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8"
    >
      <h1 className="sr-only">BookNook</h1>

      <Swiper
        modules={[A11y, Autoplay, Navigation, Pagination]}
        slidesPerView={1}
        spaceBetween={24}
        loop
        speed={700}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        a11y={{ enabled: true }}
        className="overflow-hidden rounded-3xl [--swiper-navigation-color:white] [--swiper-navigation-size:24px] [--swiper-pagination-bullet-inactive-color:white] [--swiper-pagination-bullet-inactive-opacity:0.5] [--swiper-pagination-color:white] [&_.swiper-pagination]:bottom-5"
      >
        {SLIDES.map(({ eyebrow, title, text, image, overlay }, index) => (
          <SwiperSlide key={title}>
            <div className="relative flex min-h-[420px] items-center overflow-hidden bg-blue-950 px-6 py-14 sm:min-h-[460px] sm:px-12 lg:px-16">
              <Image
                src={image}
                alt=""
                fill
                sizes="100vw"
                className="object-cover object-center"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
              />

              <div
                aria-hidden="true"
                className={cn("pointer-events-none absolute inset-0", overlay)}
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -left-24 size-80 rounded-full bg-white/10 blur-2xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -bottom-32 size-96 rounded-full bg-cyan-300/20 blur-3xl"
              />

              <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium tracking-widest text-sky-50 uppercase">
                  {eyebrow}
                </span>
                <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {title}
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-sky-100 sm:text-lg">
                  {text}
                </p>
                <Link
                  href="/books"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "mt-8 gap-2 bg-white text-sky-700 shadow-lg shadow-sky-950/20 hover:bg-sky-50",
                  )}
                >
                  Browse Books
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
