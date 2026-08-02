import { useEffect, useRef, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import gsap from "gsap";
import { ensureGsap, prefersReducedMotion } from "@/lib/animations";

/**
 * GSAP route transition: an amber curtain wipes across on navigation while the
 * outgoing page lifts away and the incoming page settles in.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const contentRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const content = contentRef.current;
    const curtain = curtainRef.current;
    if (!content || !curtain) return;

    ensureGsap();
    const tl = gsap.timeline();

    if (first.current) {
      first.current = false;
      tl.fromTo(content, { opacity: 0 }, { opacity: 1, duration: 0.4 });
      return () => {
        tl.kill();
      };
    }

    tl.set(curtain, { transformOrigin: "left center" })
      .fromTo(
        curtain,
        { scaleX: 0, opacity: 1 },
        { scaleX: 1, duration: 0.42, ease: "power4.inOut" },
      )
      .fromTo(content, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5 }, 0.2)
      .to(
        curtain,
        {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 0.42,
          ease: "power4.inOut",
        },
        0.42,
      );

    return () => {
      tl.kill();
    };
  }, [pathname]);

  return (
    <>
      <div
        ref={curtainRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[100] origin-left scale-x-0 bg-primary"
      />
      <div ref={contentRef}>{children}</div>
    </>
  );
}