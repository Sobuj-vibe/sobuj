import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function ensureGsap() {
  if (typeof window === "undefined") return;
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Scroll-triggered reveal for a section. Children marked with
 * `data-reveal` animate in on a stagger; the container itself is the fallback.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: { y?: number; stagger?: number; delay?: number } = {},
) {
  const ref = useRef<T | null>(null);
  const { y = 28, stagger = 0.08, delay = 0 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll<HTMLElement>("[data-reveal]");
    const nodes: HTMLElement[] = targets.length ? Array.from(targets) : [el];

    if (prefersReducedMotion()) {
      gsap.set(nodes, { opacity: 1, y: 0, clearProps: "all" });
      return;
    }

    ensureGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        nodes,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          delay,
          stagger,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [y, stagger, delay]);

  return ref;
}

/** Word-by-word reveal for a display headline. */
export function useSplitHeadline<T extends HTMLElement = HTMLHeadingElement>(
  text: string,
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    ensureGsap();
    const words = el.querySelectorAll<HTMLElement>("[data-word]");
    if (!words.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { yPercent: 115, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.055,
          ease: "expo.out",
          delay: 0.12,
        },
      );
    }, el);

    return () => ctx.revert();
  }, [text]);

  return ref;
}