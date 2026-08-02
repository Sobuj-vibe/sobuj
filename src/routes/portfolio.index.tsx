import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { portfolioListQuery } from "@/lib/queries";
import { SectionHeading } from "@/components/SectionHeading";
import { PortfolioCard } from "@/components/PortfolioCard";
import { Reveal } from "@/components/motion/Reveal";
import { canonical } from "@/lib/seo";

export const Route = createFileRoute("/portfolio/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(portfolioListQuery());
  },
  head: () => ({
    meta: [
      { title: "Portfolio — Sobuj Hossen" },
      {
        name: "description",
        content:
          "Selected AI, computer vision and full-stack projects delivered for logistics, industrial, medical and retail clients.",
      },
      { property: "og:title", content: "Portfolio — Sobuj Hossen" },
      {
        property: "og:description",
        content: "Case studies across AI, computer vision and web engineering.",
      },
      ...canonical("/portfolio").meta,
    ],
    links: canonical("/portfolio").links,
  }),
  component: PortfolioIndex,
  errorComponent: () => (
    <div className="mx-auto max-w-[1240px] px-5 py-32 sm:px-8">
      <p className="technical-label">Read error</p>
      <h1 className="mt-4 text-3xl">Projects couldn&apos;t be loaded.</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        The content service didn&apos;t answer. Try refreshing in a moment.
      </p>
    </div>
  ),
});

function PortfolioIndex() {
  const { data: items } = useSuspenseQuery(portfolioListQuery());
  const [filter, setFilter] = useState<string>("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((i) => i.category ?? "Other")))],
    [items],
  );
  const visible =
    filter === "All" ? items : items.filter((i) => (i.category ?? "Other") === filter);

  return (
    <div className="mx-auto w-full max-w-[1240px] px-5 py-20 sm:px-8">
      <Reveal>
        <SectionHeading
          label="Portfolio"
          title="Work built to survive production."
          description="Every project here shipped to real users — with the constraints, deadlines and trade-offs that come with it."
        />
      </Reveal>

      <div className="mt-12 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={
              "border px-4 py-2 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors " +
              (filter === cat
                ? "border-primary bg-primary text-primary-foreground"
                : "border-hairline text-muted-foreground hover:border-primary hover:text-primary")
            }
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.div layout className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <PortfolioCard item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {!visible.length && (
        <p className="mt-16 text-sm text-muted-foreground">
          No projects in this category yet.
        </p>
      )}
    </div>
  );
}