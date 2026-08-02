import type { ReactNode } from "react";
import { useReveal } from "@/lib/animations";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  stagger,
  y,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
  as?: "div" | "section" | "ul" | "header" | "footer";
}) {
  const ref = useReveal<HTMLDivElement>({
    ...(stagger === undefined ? {} : { stagger }),
    ...(y === undefined ? {} : { y }),
  });
  return (
    <Tag ref={ref as never} className={cn(className)}>
      {children}
    </Tag>
  );
}