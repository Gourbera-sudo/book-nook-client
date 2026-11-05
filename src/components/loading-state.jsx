import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

export default function LoadingState({
  label = "Loading…",
  className,
  spinnerClassName,
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex min-h-[45vh] flex-col items-center justify-center gap-3 text-muted-foreground",
        className,
      )}
    >
      <Spinner className={cn("size-7", spinnerClassName)} />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
