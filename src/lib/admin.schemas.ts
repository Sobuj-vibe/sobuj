import { z } from "zod";

const csv = (value: string) =>
  value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

export const listField = z.union([z.array(z.string()), z.string().transform(csv)]);

export const idInput = z.object({ id: z.string().uuid() });

export const messageFlagInput = z.object({
  id: z.string().uuid(),
  handled: z.boolean(),
});

const status = z.enum(["draft", "published"]);
const slug = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9-]+$/, "lowercase letters, numbers and dashes only");

export const portfolioInput = z.object({
  id: z.string().uuid().optional(),
  slug,
  title: z.string().min(1).max(160),
  summary: z.string().max(400).default(""),
  description: z.string().max(20000).default(""),
  cover_url: z.string().max(600).nullable().default(null),
  gallery: listField.default([]),
  category: z.string().min(1).max(60).default("Web"),
  tech: listField.default([]),
  client: z.string().max(160).nullable().default(null),
  year: z.number().int().min(1990).max(2100).nullable().default(null),
  live_url: z.string().max(600).nullable().default(null),
  repo_url: z.string().max(600).nullable().default(null),
  featured: z.boolean().default(false),
  status: status.default("draft"),
  sort_order: z.number().int().min(0).max(9999).default(0),
});

export const blogInput = z.object({
  id: z.string().uuid().optional(),
  slug,
  title: z.string().min(1).max(200),
  excerpt: z.string().max(500).default(""),
  body: z.string().max(100000).default(""),
  cover_url: z.string().max(600).nullable().default(null),
  tags: listField.default([]),
  status: status.default("draft"),
  reading_minutes: z.number().int().min(1).max(120).default(3),
  published_at: z.string().nullable().default(null),
});

export const pageInput = z.object({
  id: z.string().uuid().optional(),
  slug,
  title: z.string().min(1).max(200),
  format: z.enum(["markdown", "html"]).default("markdown"),
  body: z.string().max(200000).default(""),
  status: status.default("draft"),
  seo_title: z.string().max(200).nullable().default(null),
  seo_description: z.string().max(400).nullable().default(null),
});

export type PortfolioInput = z.infer<typeof portfolioInput>;
export type BlogInput = z.infer<typeof blogInput>;
export type PageInput = z.infer<typeof pageInput>;