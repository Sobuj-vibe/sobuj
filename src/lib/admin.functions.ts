import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  blogInput,
  idInput,
  messageFlagInput,
  pageInput,
  portfolioInput,
} from "./admin.schemas";

/** True when the signed-in user holds the admin role. */
export const getAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error) throw new Error(error.message);
    return { isAdmin: Boolean(data), userId: context.userId };
  });

/**
 * One-time bootstrap: the first signed-in account can claim ownership while no
 * admin exists. Once an admin is present this always refuses.
 */
export const claimAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count, error } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if (error) throw new Error(error.message);
    if ((count ?? 0) > 0) return { ok: false as const, reason: "already-claimed" };
    const { error: insertError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (insertError) throw new Error(insertError.message);
    return { ok: true as const };
  });

export const adminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const db = context.supabase;
    const [portfolio, posts, pages, messages] = await Promise.all([
      db.from("portfolio_items").select("id, status"),
      db.from("blog_posts").select("id, status"),
      db.from("pages").select("id, status"),
      db.from("contact_messages").select("id, handled"),
    ]);
    const err =
      portfolio.error ?? posts.error ?? pages.error ?? messages.error ?? null;
    if (err) throw new Error(err.message);
    const count = (rows: { status: string }[] | null, status: string) =>
      (rows ?? []).filter((r) => r.status === status).length;
    return {
      portfolio: {
        total: portfolio.data?.length ?? 0,
        published: count(portfolio.data, "published"),
      },
      posts: {
        total: posts.data?.length ?? 0,
        published: count(posts.data, "published"),
      },
      pages: {
        total: pages.data?.length ?? 0,
        published: count(pages.data, "published"),
      },
      messages: {
        total: messages.data?.length ?? 0,
        unhandled: (messages.data ?? []).filter((m) => !m.handled).length,
      },
    };
  });

/* ---------------------------------- portfolio --------------------------------- */

export const adminListPortfolio = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("portfolio_items")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminSavePortfolio = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => portfolioInput.parse(raw))
  .handler(async ({ context, data }) => {
    const { id, ...values } = data;
    const db = context.supabase;
    const { error } = id
      ? await db.from("portfolio_items").update(values).eq("id", id)
      : await db.from("portfolio_items").insert(values);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeletePortfolio = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => idInput.parse(raw))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("portfolio_items")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ------------------------------------ blog ----------------------------------- */

export const adminListPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminSavePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => blogInput.parse(raw))
  .handler(async ({ context, data }) => {
    const { id, ...values } = data;
    const db = context.supabase;
    const { error } = id
      ? await db.from("blog_posts").update(values).eq("id", id)
      : await db.from("blog_posts").insert(values);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => idInput.parse(raw))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("blog_posts")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ------------------------------------ pages ---------------------------------- */

export const adminListPages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("pages")
      .select("*")
      .order("title", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminSavePage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => pageInput.parse(raw))
  .handler(async ({ context, data }) => {
    const { id, ...values } = data;
    const db = context.supabase;
    const { error } = id
      ? await db.from("pages").update(values).eq("id", id)
      : await db.from("pages").insert(values);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeletePage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => idInput.parse(raw))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("pages").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------------------------------- messages --------------------------------- */

export const adminListMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminFlagMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => messageFlagInput.parse(raw))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("contact_messages")
      .update({ handled: data.handled })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => idInput.parse(raw))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("contact_messages")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });