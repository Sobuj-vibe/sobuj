import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { SITE_URL } from "@/lib/seo";

const esc = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

type Entry = {
  path: string;
  lastmod?: string | null;
  changefreq?: string;
  priority?: string;
};

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { getPublicClient } = await import("@/lib/supabase-public.server");
        const db = getPublicClient();

        const [projects, posts, pages] = await Promise.all([
          db
            .from("portfolio_items")
            .select("slug, updated_at")
            .eq("status", "published"),
          db.from("blog_posts").select("slug, updated_at").eq("status", "published"),
          db.from("pages").select("slug, updated_at").eq("status", "published"),
        ]);

        const entries: Entry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/portfolio", changefreq: "weekly", priority: "0.9" },
          { path: "/blog", changefreq: "weekly", priority: "0.8" },
          { path: "/about", changefreq: "monthly", priority: "0.7" },
          { path: "/contact", changefreq: "yearly", priority: "0.6" },
          ...(projects.data ?? []).map((row) => ({
            path: `/portfolio/${row.slug}`,
            lastmod: row.updated_at,
            changefreq: "monthly",
            priority: "0.8",
          })),
          ...(posts.data ?? []).map((row) => ({
            path: `/blog/${row.slug}`,
            lastmod: row.updated_at,
            changefreq: "monthly",
            priority: "0.7",
          })),
          ...(pages.data ?? []).map((row) => ({
            path: `/p/${row.slug}`,
            lastmod: row.updated_at,
            changefreq: "yearly",
            priority: "0.5",
          })),
        ];

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...entries.map((entry) =>
            [
              `  <url>`,
              `    <loc>${esc(SITE_URL + entry.path)}</loc>`,
              entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>` : null,
              entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : null,
              entry.priority ? `    <priority>${entry.priority}</priority>` : null,
              `  </url>`,
            ]
              .filter(Boolean)
              .join("\n"),
          ),
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});