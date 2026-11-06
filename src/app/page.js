import { Suspense } from "react";

import BannerSlider from "@/components/home/banner-slider";
import HowBorrowingWorks from "@/components/home/how-borrowing-works";
import {
  NewArrivals,
  NewArrivalsSkeleton,
} from "@/components/home/new-arrivals";
import TopCategories from "@/components/home/top-categories";

export const metadata = {
  title: { absolute: "BookNook | Home" },
};

export default function Home() {
  return (
    <div className="pb-16">
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
            <div className="min-h-105 rounded-3xl bg-brand-950 sm:min-h-115" />
          </div>
        }
      >
        <BannerSlider />
      </Suspense>

      <Suspense fallback={<NewArrivalsSkeleton />}>
        <NewArrivals />
      </Suspense>

      <HowBorrowingWorks />
      <TopCategories />
    </div>
  );
}
