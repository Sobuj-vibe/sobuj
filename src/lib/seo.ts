import { site } from "./site";

/** Absolute origin used for canonical URLs, feeds and structured data. */
export const SITE_URL = site.website.replace(/\/$/, "");

export const absolute = (path: string) =>
  path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** canonical + og:url pair for a leaf route. */
export function canonical(path: string) {
  const href = absolute(path);
  return {
    links: [{ rel: "canonical", href }],
    meta: [{ property: "og:url", content: href }],
  };
}

export function jsonLd(data: unknown) {
  return { type: "application/ld+json", children: JSON.stringify(data) };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: SITE_URL,
  image: site.images.portrait,
  email: `mailto:${site.email}`,
  telephone: site.phone,
  jobTitle: site.roles.join(", "),
  description: `${site.tagline} ${site.roles.join(" | ")}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Shenzhen",
    addressRegion: "Guangdong",
    addressCountry: "CN",
  },
  sameAs: [site.github, SITE_URL],
  knowsAbout: [
    "Artificial Intelligence",
    "Computer Vision",
    "Machine Learning",
    "Full-Stack Web Development",
    "React",
    "TypeScript",
  ],
};