import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { portfolioListQuery } from "@/lib/queries";
import { quickStats, services, site } from "@/lib/site";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { PortfolioCard } from "@/components/PortfolioCard";
import { canonical, jsonLd, personSchema } from "@/lib/seo";

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(portfolioListQuery());
  },
  head: () => ({
    meta: [
      { title: "Sobuj Hossen — AI Engineer & Full-Stack Developer" },
      {
        name: "description",
        content:
          "Real-life problem solver. AI engineer, computer vision researcher and full-stack software engineer based in Shenzhen, China.",
      },
      {
        property: "og:title",
        content: "Sobuj Hossen — AI Engineer & Full-Stack Developer",
      },
      {
        property: "og:description",
        content:
          "Selected AI, computer vision and full-stack engineering work by Sobuj Hossen.",
      },
      { property: "og:image", content: site.images.portrait },
      { name: "twitter:image", content: site.images.portrait },
      ...canonical("/").meta,
    ],
    links: canonical("/").links,
    scripts: [
      jsonLd(personSchema),
      jsonLd({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: `${site.name} — Portfolio`,
        url: site.website,
        author: { "@type": "Person", name: site.name },
      }),
    ],
  }),
  component: Index,
});

function Index() {
  const { data: projects } = useSuspenseQuery(portfolioListQuery());
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const shown = featured.length ? featured : projects.slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="blueprint-grid absolute inset-0 opacity-70" aria-hidden />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,var(--color-accent),transparent_60%)] opacity-60"
          aria-hidden
        />
        <div className="relative mx-auto grid w-full max-w-[1240px] items-center gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:py-32">
          <div>
            <motion.p
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="technical-label"
            >
              {site.location}
            </motion.p>

            <SplitHeadline
              text="Real-life problem solver."
              accentFrom={2}
              className="mt-6 text-[clamp(2.75rem,7vw,5.25rem)] leading-[0.98]"
            />

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              I&apos;m {site.shortName} — {site.roles.join(" · ")}. I build systems
              that see, decide and ship: vision models on the edge, typed
              full-stack products, and websites that earn their keep.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/portfolio"
                className="group inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                View the work
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={`mailto:${site.email}`}
                className="border-b border-primary pb-1 text-sm text-foreground transition-colors hover:text-primary"
              >
                {site.email}
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-md"
          >
            <div
              className="pointer-events-none absolute -inset-10 bg-[radial-gradient(ellipse_at_50%_40%,var(--color-primary),transparent_65%)] opacity-[0.14] blur-2xl"
              aria-hidden
            />
            <img
              src={site.images.portrait}
              alt={`Architectural sketch portrait of ${site.name}`}
              width={880}
              height={1100}
              decoding="async"
              fetchPriority="high"
              className="portrait-blend relative w-full object-cover"
            />
            <p className="technical-label relative mt-2 text-right">
              Fig. 01 — the engineer
            </p>
          </motion.div>
        </div>
      </section>

      <Reveal
        as="section"
        className="border-b border-hairline"
        stagger={0.09}
      >
        <div className="mx-auto grid w-full max-w-[1240px] grid-cols-2 gap-px px-5 sm:px-8 lg:grid-cols-4">
          {quickStats.map((stat) => (
            <div key={stat.label} data-reveal className="py-10 pr-6">
              <p className="text-5xl text-primary">{stat.value}</p>
              <p className="technical-label mt-3">{stat.label}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="border-b border-hairline">
        <div className="mx-auto w-full max-w-[1240px] px-5 py-24 sm:px-8">
          <SectionHeading
            label="Capabilities"
            title="Four disciplines, one delivery pipeline."
            description="Research rigour where it matters, product pragmatism everywhere else."
          />
          <div className="mt-14 grid gap-px sm:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.index}
                data-reveal
                className="group border border-hairline p-8 transition-colors hover:border-primary/60"
              >
                <p className="font-mono text-xs tracking-[0.2em] text-primary">
                  {service.index}
                </p>
                <h3 className="mt-5 text-2xl">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {service.body}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {service.items.map((item) => (
                    <li
                      key={item}
                      className="border border-hairline px-2 py-1 font-mono text-[10px] tracking-[0.12em] uppercase text-muted-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="border-b border-hairline">
        <div className="mx-auto w-full max-w-[1240px] px-5 py-24 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              label="Selected work"
              title="Shipped for logistics, industry, medicine and retail."
            />
            <Link
              to="/portfolio"
              data-reveal
              className="group inline-flex items-center gap-2 border-b border-primary pb-1 text-sm transition-colors hover:text-primary"
            >
              All projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((item) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal as="section">
        <div className="mx-auto w-full max-w-[1240px] px-5 py-24 sm:px-8">
          <div
            data-reveal
            className="relative overflow-hidden border border-hairline bg-surface px-8 py-16 text-center sm:px-16"
          >
            <div className="blueprint-grid absolute inset-0 opacity-60" aria-hidden />
            <div className="relative">
              <p className="technical-label">Available for new work</p>
              <h2 className="mx-auto mt-5 max-w-2xl text-4xl leading-[1.05] sm:text-5xl">
                Have a problem worth solving properly?
              </h2>
              <Link
                to="/contact"
                className="group mt-9 inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Start a conversation
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </>
  );
}
