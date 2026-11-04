import { Suspense } from "react";

import BannerSlider from "@/components/home/banner-slider";
import HowBorrowingWorks from "@/components/home/how-borrowing-works";
import {
  NewArrivals,
  NewArrivalsSkeleton,
} from "@/components/home/new-arrivals";
import TopCategories from "@/components/home/top-categories";

export default function Home() {
  return (
    <div className="pb-16">
      <BannerSlider />

      <Suspense fallback={<NewArrivalsSkeleton />}>
        <NewArrivals />
      </Suspense>

      <HowBorrowingWorks />
      <TopCategories />
    </div>
  );
}
