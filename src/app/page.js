import BannerSlider from "@/components/home/banner-slider";
import HowBorrowingWorks from "@/components/home/how-borrowing-works";
import TopCategories from "@/components/home/top-categories";

export default function Home() {
  return (
    <div className="pb-16">
      <BannerSlider />
      <HowBorrowingWorks />
      {/* <TopCategories /> */}
    </div>
  );
}
