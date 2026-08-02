import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { postListQuery } from "@/lib/queries";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

export const Route = createFileRoute("/blog/")({
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
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const { data: posts } = useSuspenseQuery(postListQuery());

  return (
    <div className="mx-auto w-full max-w-[1240px] px-5 py-20 sm:px-8">
      <Reveal>
        <SectionHeading
          label="Notes"
          title="Writing about the work."
          description="Short field notes on models, pipelines and interfaces — what actually held up in production."
        />
      </Reveal>

      <Reveal as="ul" className="mt-14 border-t border-hairline">
        {posts.map((post) => (
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
              {post.reading_minutes ? (
                <p className="technical-label sm:ml-auto">
                  {post.reading_minutes} min
                </p>
              ) : null}
            </Link>
          </li>
        ))}
      </Reveal>

      {!posts.length && (
        <p className="mt-16 text-sm text-muted-foreground">
          First notes are being written.
        </p>
      )}
    </div>
  );
}