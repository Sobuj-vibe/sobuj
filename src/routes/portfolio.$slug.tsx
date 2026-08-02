import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { portfolioItemQuery, portfolioListQuery } from "@/lib/queries";
import { Reveal } from "@/components/motion/Reveal";
import { PortfolioCard } from "@/components/PortfolioCard";
import { absolute, breadcrumbs, canonical, jsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const Route = createFileRoute("/portfolio/$slug")({
  loader: async ({ context, params }) => {
    const item = await context.queryClient.ensureQueryData(
      portfolioItemQuery(params.slug),
    );
    if (!item) throw notFound();
    void context.queryClient.ensureQueryData(portfolioListQuery());
    return {
      slug: item.slug,
      title: item.title,
      summary: item.summary,
      cover: item.cover_url,
      category: item.category,
      tech: item.tech ?? [],
      year: item.year,
      updatedAt: item.updated_at,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Project unavailable — Sobuj Hossen" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.title} — Sobuj Hossen`;
    const description = loaderData.summary ?? "Project case study by Sobuj Hossen.";
    const path = `/portfolio/${loaderData.slug}`;
    const link = canonical(path);
    const image =
      loaderData.cover && loaderData.cover.startsWith("http") ? loaderData.cover : null;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        ...link.meta,
        ...(image
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
      links: link.links,
      scripts: [
        jsonLd({
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: loaderData.title,
          description,
          url: absolute(path),
          ...(image ? { image } : {}),
          genre: loaderData.category ?? undefined,
          keywords: loaderData.tech.join(", "),
          dateModified: loaderData.updatedAt ?? undefined,
          creator: { "@type": "Person", name: site.name, url: site.website },
        }),
        jsonLd(
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: "Portfolio", path: "/portfolio" },
            { name: loaderData.title, path },
          ]),
        ),
      ],
    };
  },
  component: PortfolioDetail,
  notFoundComponent: ProjectNotFound,
  errorComponent: () => (
    <div className="mx-auto max-w-[1240px] px-5 py-32 sm:px-8">
      <p className="technical-label">Read error</p>
      <h1 className="mt-4 text-3xl">This case study couldn&apos;t be loaded.</h1>
      <Link to="/portfolio" className="mt-8 inline-block border-b border-primary pb-1">
        Back to portfolio
      </Link>
    </div>
  ),
});

function ProjectNotFound() {
  return (
    <div className="mx-auto max-w-[1240px] px-5 py-32 sm:px-8">
      <p className="technical-label">404</p>
      <h1 className="mt-4 text-4xl">That project isn&apos;t published.</h1>
      <Link to="/portfolio" className="mt-8 inline-block border-b border-primary pb-1">
        Back to portfolio
      </Link>
    </div>
  );
}

function PortfolioDetail() {
  const { slug } = Route.useParams();
  const { data: item } = useSuspenseQuery(portfolioItemQuery(slug));
  const { data: all } = useSuspenseQuery(portfolioListQuery());
  if (!item) return <ProjectNotFound />;

  const related = all
    .filter((other) => other.slug !== slug && other.category === item.category)
    .slice(0, 3);

  return (
    <article className="mx-auto w-full max-w-[1240px] px-5 py-20 sm:px-8">
      <Link
        to="/portfolio"
        className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        All projects
      </Link>

      <Reveal className="mt-10">
        <p data-reveal className="technical-label">
          {[item.category, item.client, item.year].filter(Boolean).join(" · ")}
        </p>
        <h1 data-reveal className="mt-4 max-w-4xl text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[1.02]">
          {item.title}
        </h1>
        {item.summary && (
          <p data-reveal className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {item.summary}
          </p>
        )}
        {item.live_url && (
          <a
            data-reveal
            href={item.live_url}
            target="_blank"
            rel="noreferrer"
            className="group mt-8 inline-flex items-center gap-2 border-b border-primary pb-1 text-sm transition-colors hover:text-primary"
          >
            Visit live site
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        )}
      </Reveal>

      {item.cover_url && (
        <Reveal className="mt-14">
          <img
            data-reveal
            src={item.cover_url}
            alt={item.title}
            className="w-full border border-hairline object-cover"
          />
        </Reveal>
      )}

      <div className="mt-16 grid gap-12 lg:grid-cols-[0.32fr_0.68fr]">
        <aside className="space-y-8">
          {item.tech?.length ? (
            <div>
              <p className="technical-label">Stack</p>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {item.tech.map((t: string) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {item.client && (
            <div>
              <p className="technical-label">Client</p>
              <p className="mt-3 text-sm text-muted-foreground">{item.client}</p>
            </div>
          )}
          {item.repo_url && (
            <div>
              <p className="technical-label">Source</p>
              <a
                href={item.repo_url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Repository
              </a>
            </div>
          )}
        </aside>

        <div className="prose-ink max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {item.description || item.summary || ""}
          </ReactMarkdown>
        </div>
      </div>

      {item.gallery?.length ? (
        <Reveal className="mt-16 grid gap-6 sm:grid-cols-2">
          {item.gallery.map((src: string) => (
            <img
              key={src}
              data-reveal
              src={src}
              alt={`${item.title} detail`}
              loading="lazy"
              className="w-full border border-hairline object-cover"
            />
          ))}
        </Reveal>
      ) : null}

      {related.length ? (
        <section className="mt-24 border-t border-hairline pt-12">
          <p className="technical-label">More {item.category} work</p>
          <Reveal className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((other) => (
              <div key={other.id} data-reveal>
                <PortfolioCard item={other} />
              </div>
            ))}
          </Reveal>
        </section>
      ) : null}
    </article>
  );
}