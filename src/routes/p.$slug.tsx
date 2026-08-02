import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DOMPurify from "dompurify";
import { pageQuery } from "@/lib/queries";

export const Route = createFileRoute("/p/$slug")({
  loader: async ({ context, params }) => {
    const page = await context.queryClient.ensureQueryData(pageQuery(params.slug));
    if (!page) throw notFound();
    return { title: page.seo_title ?? page.title, description: page.seo_description };
  },
  head: ({ loaderData }) => {
    const title = loaderData?.title ?? "Page — Sobuj Hossen";
    const description =
      loaderData?.description ??
      "A page from the studio of Sobuj Hossen — AI engineer and full-stack developer in Shenzhen.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  errorComponent: () => (
    <div className="mx-auto max-w-2xl px-5 py-24 text-center">
      <p className="text-sm text-muted-foreground">This page could not be loaded.</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-5 py-24 text-center">
      <h1 className="font-serif text-3xl text-foreground">Page not found</h1>
      <Link to="/" className="mt-4 inline-block text-sm text-primary hover:underline">
        Back home
      </Link>
    </div>
  ),
  component: CustomPage,
});

function CustomPage() {
  const { slug } = Route.useParams();
  const { data: page } = useSuspenseQuery(pageQuery(slug));
  if (!page) return null;

  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8">
      <p className="technical-label">Ref: SK-PAGE</p>
      <h1 className="mt-3 font-serif text-4xl text-foreground sm:text-5xl">
        {page.title}
      </h1>
      <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
        {page.format === "html" ? (
          <div
            dangerouslySetInnerHTML={{
              __html:
                typeof window === "undefined" ? "" : DOMPurify.sanitize(page.body),
            }}
          />
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{page.body}</ReactMarkdown>
        )}
      </div>
    </article>
  );
}