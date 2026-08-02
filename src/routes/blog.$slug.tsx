import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { postQuery } from "@/lib/queries";
import { Reveal } from "@/components/motion/Reveal";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ context, params }) => {
    const post = await context.queryClient.ensureQueryData(postQuery(params.slug));
    if (!post) throw notFound();
    return { title: post.title, excerpt: post.excerpt };
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
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: BlogPost,
  notFoundComponent: PostNotFound,
});

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

function BlogPost() {
  const { slug } = Route.useParams();
  const { data: post } = useSuspenseQuery(postQuery(slug));
  if (!post) return <PostNotFound />;

  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8">
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
      </Reveal>

      <div className="prose-ink mt-12 max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.body || post.excerpt || ""}
        </ReactMarkdown>
      </div>
    </article>
  );
}