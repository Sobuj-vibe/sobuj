import { useSplitHeadline } from "@/lib/animations";
import { cn } from "@/lib/utils";

export function SplitHeadline({
  text,
  className,
  accentFrom,
}: {
  text: string;
  className?: string;
  /** Word index from which the amber accent colour starts. */
  accentFrom?: number;
}) {
  const ref = useSplitHeadline<HTMLHeadingElement>(text);
  const words = text.split(" ");

  return (
    <h1 ref={ref} className={cn("flex flex-wrap", className)}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="overflow-hidden pb-[0.08em] pr-[0.28em]">
          <span
            data-word
            className={cn(
              "inline-block",
              accentFrom !== undefined && i >= accentFrom && "text-primary",
            )}
          >
            {word}
          </span>
        </span>
      ))}
    </h1>
  );
}