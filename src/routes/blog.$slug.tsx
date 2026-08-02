import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowRight, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { postListQuery, postQuery } from "@/lib/queries";
import { registerPostView } from "@/lib/content.functions";
import { Reveal } from "@/components/motion/Reveal";
import { absolute, breadcrumbs, canonical, jsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ context, params }) => {
    const post = await context.queryClient.ensureQueryData(postQuery(params.slug));
    if (!post) throw notFound();
    void context.queryClient.ensureQueryData(postListQuery());
    return {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      cover: post.cover_url,
      publishedAt: post.published_at,
      updatedAt: post.updated_at,
      tags: post.tags ?? [],
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Post unavailable — Sobuj Hossen" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.title} — Sobuj Hossen`;
    const description = loaderData.excerpt ?? "A note by Sobuj Hossen.";
    const path = `/blog/${loaderData.slug}`;
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
          "@type": "Article",
          headline: loaderData.title,
          description,
          url: absolute(path),
          ...(image ? { image } : {}),
          keywords: loaderData.tags.join(", "),
          datePublished: loaderData.publishedAt ?? undefined,
          dateModified: loaderData.updatedAt ?? loaderData.publishedAt ?? undefined,
          author: { "@type": "Person", name: site.name, url: site.website },
          publisher: { "@type": "Person", name: site.name, url: site.website },
          mainEntityOfPage: { "@type": "WebPage", "@id": absolute(path) },
        }),
        jsonLd(
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: "Notes", path: "/blog" },
            { name: loaderData.title, path },
          ]),
        ),
      ],
    };
  },
  component: BlogPost,
  notFoundComponent: PostNotFound,
  errorComponent: PostError,
});

function PostError() {
  return (
    <div className="mx-auto max-w-[1240px] px-5 py-32 sm:px-8">
      <p className="technical-label">Read error</p>
      <h1 className="mt-4 text-3xl">This note couldn&apos;t be loaded.</h1>
      <p className="mt-4 max-w-lg text-sm text-muted-foreground">
        The content service didn&apos;t answer. Try again in a moment.
      </p>
      <Link to="/blog" className="mt-8 inline-block border-b border-primary pb-1">
        Back to notes
      </Link>
    </div>
  );
}

function PostNotFound() {
  return (
    <div className="mx-auto max-w-[1240px] px-5 py-32 sm:px-8">
      <p className="technical-label">404</p>
      <h1 className="mt-4 text-4xl">That note isn&apos;t published.</h1>
      <Link to="/blog" className="mt-8 inline-block border-b border-primary pb-1">
        Back to notes
      </Link>
    </div>
  );
}

/** Thin amber bar tracking how far through the article the reader is. */
function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-16 z-40 h-px bg-transparent"
    >
      <div
        className="h-px origin-left bg-primary transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}

function BlogPost() {
  const { slug } = Route.useParams();
  const { data: post } = useSuspenseQuery(postQuery(slug));
  const { data: posts } = useSuspenseQuery(postListQuery());
  const bumpView = useServerFn(registerPostView);
  const counted = useRef<string | null>(null);
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    if (counted.current === slug) return;
    counted.current = slug;
    void bumpView({ data: { slug } })
      .then((result) => setViews(result.views))
      .catch(() => undefined);
  }, [slug, bumpView]);

  if (!post) return <PostNotFound />;

  const index = posts.findIndex((p) => p.slug === slug);
  const newer = index > 0 ? posts[index - 1] : null;
  const older = index >= 0 && index < posts.length - 1 ? posts[index + 1] : null;
  const shownViews = views ?? post.views ?? 0;

  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8">
      <ReadingProgress />
      <Link
        to="/blog"
        className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        All notes
      </Link>

      <Reveal className="mt-10">
        <p data-reveal className="technical-label">
          {post.published_at
            ? new Date(post.published_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : "Draft"}
          {post.reading_minutes ? ` · ${post.reading_minutes} min read` : ""}
        </p>
        <h1 data-reveal className="mt-4 text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05]">
          {post.title}
        </h1>
        <p
          data-reveal
          className="mt-5 inline-flex items-center gap-2 text-xs text-muted-foreground"
        >
          <Eye className="h-3.5 w-3.5" aria-hidden />
          {shownViews.toLocaleString("en-GB")} {shownViews === 1 ? "read" : "reads"}
        </p>
        {post.tags?.length ? (
          <ul data-reveal className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <li key={tag}>
                <Link
                  to="/blog"
                  search={{ tag }}
                  className="border border-hairline px-3 py-1 font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </Reveal>

      <div className="prose-ink mt-12 max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.body || post.excerpt || ""}
        </ReactMarkdown>
      </div>

      {(newer || older) && (
        <nav
          aria-label="More notes"
          className="mt-20 grid gap-4 border-t border-hairline pt-8 sm:grid-cols-2"
        >
          {older ? (
            <Link
              to="/blog/$slug"
              params={{ slug: older.slug }}
              className="group border border-hairline p-5 transition-colors hover:border-primary"
            >
              <span className="technical-label inline-flex items-center gap-2">
                <ArrowLeft className="h-3 w-3" aria-hidden /> Older
              </span>
              <p className="mt-3 text-lg leading-tight transition-colors group-hover:text-primary">
                {older.title}
              </p>
            </Link>
          ) : (
            <span />
          )}
          {newer ? (
            <Link
              to="/blog/$slug"
              params={{ slug: newer.slug }}
              className="group border border-hairline p-5 text-right transition-colors hover:border-primary"
            >
              <span className="technical-label inline-flex items-center gap-2">
                Newer <ArrowRight className="h-3 w-3" aria-hidden />
              </span>
              <p className="mt-3 text-lg leading-tight transition-colors group-hover:text-primary">
                {newer.title}
              </p>
            </Link>
          ) : null}
        </nav>
      )}
    </article>
  );
}