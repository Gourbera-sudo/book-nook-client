import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BookCardSkeleton() {
  return (
    <Card className="h-full gap-3 pt-0">
      <Skeleton className="aspect-[2/3] w-full rounded-none" />

      <CardHeader>
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-5 w-3/5" />
        <Skeleton className="h-4 w-2/5" />
      </CardHeader>

      <CardContent className="flex-1">
        <Skeleton className="h-6 w-20 rounded-full" />
      </CardContent>

      <CardFooter className="justify-center">
        <Skeleton className="h-8 w-full" />
      </CardFooter>
    </Card>
  );
}

export function BookGridSkeleton({
  count = 8,
  className = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
}) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <BookCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function BookDetailsSkeleton() {
  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Skeleton className="h-5 w-36" />

      <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr] md:items-start">
        <Skeleton className="aspect-[2/3] w-full max-w-[240px] rounded-xl" />

        <div className="space-y-3">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </article>
  );
}
