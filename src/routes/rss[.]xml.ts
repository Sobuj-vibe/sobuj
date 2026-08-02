import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { SITE_URL } from "@/lib/seo";
import { site } from "@/lib/site";

const esc = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { getPublicClient } = await import("@/lib/supabase-public.server");
        const { data } = await getPublicClient()
          .from("blog_posts")
          .select("slug, title, excerpt, published_at, tags")
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(50);

        const posts = data ?? [];
        const latest = posts.find((post) => post.published_at)?.published_at ?? null;

        const items = posts.map((post) => {
          const url = `${SITE_URL}/blog/${post.slug}`;
          return [
            `    <item>`,
            `      <title>${esc(post.title)}</title>`,
            `      <link>${esc(url)}</link>`,
            `      <guid isPermaLink="true">${esc(url)}</guid>`,
            post.excerpt ? `      <description>${esc(post.excerpt)}</description>` : null,
            post.published_at
              ? `      <pubDate>${new Date(post.published_at).toUTCString()}</pubDate>`
              : null,
            ...(post.tags ?? []).map((tag) => `      <category>${esc(tag)}</category>`),
            `    </item>`,
          ]
            .filter(Boolean)
            .join("\n");
        });

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">`,
          `  <channel>`,
          `    <title>${esc(`${site.name} — Notes`)}</title>`,
          `    <link>${SITE_URL}/blog</link>`,
          `    <description>Field notes on AI engineering, computer vision research and shipping full-stack products.</description>`,
          `    <language>en</language>`,
          `    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />`,
          latest ? `    <lastBuildDate>${new Date(latest).toUTCString()}</lastBuildDate>` : null,
          ...items,
          `  </channel>`,
          `</rss>`,
        ]
          .filter(Boolean)
          .join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});