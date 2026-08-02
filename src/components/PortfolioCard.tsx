import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export type PortfolioCardItem = {
  slug: string;
  title: string;
  summary: string | null;
  cover_url: string | null;
  category: string | null;
  year: number | null;
  tech: string[] | null;
};

export function PortfolioCard({ item }: { item: PortfolioCardItem }) {
  return (
    <motion.article
      data-reveal
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="group border border-hairline bg-surface"
    >
      <Link
        to="/portfolio/$slug"
        params={{ slug: item.slug }}
        className="block focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <div className="relative aspect-[16/10] overflow-hidden border-b border-hairline bg-muted">
          {item.cover_url && (
            <img
              src={item.cover_url}
              alt={item.title}
              loading="lazy"
              width={1600}
              height={1000}
              decoding="async"
              className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="technical-label">
              {item.category ?? "Project"}
              {item.year ? ` · ${item.year}` : ""}
            </p>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
          </div>
          <h3 className="mt-3 text-2xl leading-tight">{item.title}</h3>
          {item.summary && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {item.summary}
            </p>
          )}
          {item.tech?.length ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {item.tech.slice(0, 4).map((t) => (
                <li
                  key={t}
                  className="border border-hairline px-2 py-1 font-mono text-[10px] tracking-[0.12em] uppercase text-muted-foreground"
                >
                  {t}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Link>
    </motion.article>
  );
}