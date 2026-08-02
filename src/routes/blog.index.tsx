import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Eye, Rss } from "lucide-react";
import { postListQuery } from "@/lib/queries";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { canonical } from "@/lib/seo";

export const Route = createFileRoute("/blog/")({
  validateSearch: (search: Record<string, unknown>): { tag?: string } => {
    const tag = search["tag"];
    return typeof tag === "string" && tag ? { tag } : {};
  },
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(postListQuery());
  },
  head: () => ({
    meta: [
      { title: "Notes & Writing — Sobuj Hossen" },
      {
        name: "description",
        content:
          "Field notes on AI engineering, computer vision research and shipping full-stack products.",
      },
      { property: "og:title", content: "Notes & Writing — Sobuj Hossen" },
      {
        property: "og:description",
        content: "Essays and notes on AI, computer vision and web engineering.",
      },
      ...canonical("/blog").meta,
    ],
    links: [
      ...canonical("/blog").links,
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: "Sobuj Hossen — Notes",
        href: "/rss.xml",
      },
    ],
  }),
  component: BlogIndex,
  errorComponent: () => (
    <div className="mx-auto max-w-[1240px] px-5 py-32 sm:px-8">
      <p className="technical-label">Read error</p>
      <h1 className="mt-4 text-3xl">Notes couldn&apos;t be loaded.</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        The content service didn&apos;t answer. Try refreshing in a moment.
      </p>
    </div>
  ),
});

function BlogIndex() {
  const { data: posts } = useSuspenseQuery(postListQuery());
  const { tag } = Route.useSearch();
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags ?? []))).sort();
  const visible = tag ? posts.filter((post) => (post.tags ?? []).includes(tag)) : posts;

  return (
    <div className="mx-auto w-full max-w-[1240px] px-5 py-20 sm:px-8">
      <Reveal>
        <SectionHeading
          label="Notes"
          title="Writing about the work."
          description="Short field notes on models, pipelines and interfaces — what actually held up in production."
        />
      </Reveal>

      <div className="mt-10 flex flex-wrap items-center gap-2">
        <Link
          to="/blog"
          search={{ tag: undefined }}
          className={
            "border px-4 py-2 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors " +
            (!tag
              ? "border-primary bg-primary text-primary-foreground"
              : "border-hairline text-muted-foreground hover:border-primary hover:text-primary")
          }
        >
          All
        </Link>
        {tags.map((item) => (
          <Link
            key={item}
            to="/blog"
            search={{ tag: item }}
            className={
              "border px-4 py-2 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors " +
              (tag === item
                ? "border-primary bg-primary text-primary-foreground"
                : "border-hairline text-muted-foreground hover:border-primary hover:text-primary")
            }
          >
            {item}
          </Link>
        ))}
        <a
          href="/rss.xml"
          className="ml-auto inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          <Rss className="h-3.5 w-3.5" aria-hidden />
          RSS feed
        </a>
      </div>

      <Reveal as="ul" key={tag ?? "all"} className="mt-10 border-t border-hairline">
        {visible.map((post) => (
          <li key={post.id} data-reveal className="border-b border-hairline">
            <Link
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="group flex flex-col gap-2 py-8 transition-colors sm:flex-row sm:items-baseline sm:gap-10"
            >
              <p className="technical-label sm:w-32 sm:shrink-0">
                {post.published_at
                  ? new Date(post.published_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "Draft"}
              </p>
              <div>
                <h2 className="text-2xl leading-tight transition-colors group-hover:text-primary">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                )}
              </div>
              <p className="technical-label flex items-center gap-3 sm:ml-auto">
                {post.reading_minutes ? <span>{post.reading_minutes} min</span> : null}
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="h-3 w-3" aria-hidden />
                  {(post.views ?? 0).toLocaleString("en-GB")}
                </span>
              </p>
            </Link>
          </li>
        ))}
      </Reveal>

      {!visible.length && (
        <p className="mt-16 text-sm text-muted-foreground">
          {tag ? `No notes tagged “${tag}” yet.` : "First notes are being written."}
        </p>
      )}
    </div>
  );
}