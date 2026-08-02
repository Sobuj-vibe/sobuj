import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const slugInput = z.object({ slug: z.string().min(1).max(200) });

export const listPortfolio = createServerFn({ method: "GET" }).handler(async () => {
  const { getPublicClient } = await import("./supabase-public.server");
  const { data, error } = await getPublicClient()
    .from("portfolio_items")
    .select(
      "id, slug, title, summary, cover_url, category, tech, client, year, live_url, featured, sort_order",
    )
    .eq("status", "published")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getPortfolioItem = createServerFn({ method: "GET" })
  .inputValidator((raw: unknown) => slugInput.parse(raw))
  .handler(async ({ data: input }) => {
    const { getPublicClient } = await import("./supabase-public.server");
    const { data, error } = await getPublicClient()
      .from("portfolio_items")
      .select("*")
      .eq("status", "published")
      .eq("slug", input.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

export const listPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { getPublicClient } = await import("./supabase-public.server");
  const { data, error } = await getPublicClient()
    .from("blog_posts")
    .select(
      "id, slug, title, excerpt, cover_url, tags, published_at, reading_minutes, views",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getPost = createServerFn({ method: "GET" })
  .inputValidator((raw: unknown) => slugInput.parse(raw))
  .handler(async ({ data: input }) => {
    const { getPublicClient } = await import("./supabase-public.server");
    const { data, error } = await getPublicClient()
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .eq("slug", input.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

export const getPage = createServerFn({ method: "GET" })
  .inputValidator((raw: unknown) => slugInput.parse(raw))
  .handler(async ({ data: input }) => {
    const { getPublicClient } = await import("./supabase-public.server");
    const { data, error } = await getPublicClient()
      .from("pages")
      .select("*")
      .eq("status", "published")
      .eq("slug", input.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

/** Bumps the view counter for a published note and returns the new total. */
export const registerPostView = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => slugInput.parse(raw))
  .handler(async ({ data: input }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: current, error: readError } = await supabaseAdmin
      .from("blog_posts")
      .select("id, views")
      .eq("slug", input.slug)
      .eq("status", "published")
      .maybeSingle();
    if (readError) throw new Error(readError.message);
    if (!current) return { views: 0 };

    const next = (current.views ?? 0) + 1;
    const { error: writeError } = await supabaseAdmin
      .from("blog_posts")
      .update({ views: next })
      .eq("id", current.id);
    if (writeError) throw new Error(writeError.message);
    return { views: next };
  });

export const listPages = createServerFn({ method: "GET" }).handler(async () => {
  const { getPublicClient } = await import("./supabase-public.server");
  const { data, error } = await getPublicClient()
    .from("pages")
    .select("slug, title")
    .eq("status", "published")
    .order("title", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

const contactInput = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  subject: z.string().max(200).optional(),
  message: z.string().min(5).max(5000),
});

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => contactInput.parse(raw))
  .handler(async ({ data: input }) => {
    const { getPublicClient } = await import("./supabase-public.server");
    const { error } = await getPublicClient().from("contact_messages").insert({
      name: input.name,
      email: input.email,
      subject: input.subject ?? null,
      message: input.message,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });