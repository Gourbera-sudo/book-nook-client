import { BookGridSkeleton } from "@/components/books/book-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function AllBooksLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="mt-3 h-10 w-52" />
      <Skeleton className="mt-4 h-5 w-96 max-w-full" />

      <BookGridSkeleton
        count={8}
        className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      />
    </div>
  );
}
