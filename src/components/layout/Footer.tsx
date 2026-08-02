import { Link } from "@tanstack/react-router";
import { Github, Mail, MapPin, Phone } from "lucide-react";
import { navLinks, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto grid w-full max-w-[1240px] gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <img
            src={site.images.logo}
            alt=""
            width={200}
            height={48}
            loading="lazy"
            decoding="async"
            className="h-6 w-auto"
          />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {site.tagline} Building AI systems, computer-vision pipelines and
            production web products from Shenzhen.
          </p>
          <img
            src={site.images.signature}
            alt={`${site.name} signature`}
            width={420}
            height={160}
            loading="lazy"
            decoding="async"
            className="mt-6 h-12 w-auto opacity-80 mix-blend-multiply dark:mix-blend-lighten dark:invert"
          />
        </div>

        <nav aria-label="Footer">
          <p className="technical-label">Navigate</p>
          <ul className="mt-4 space-y-2.5">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="technical-label">Contact</p>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Mail className="h-3.5 w-3.5" /> {site.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${site.phone}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Phone className="h-3.5 w-3.5" /> {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={site.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Github className="h-3.5 w-3.5" /> helloSobuj
              </a>
            </li>
            <li className="inline-flex items-start gap-2">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {site.location}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-hairline">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-2 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="technical-label">Ref: SK-02-A · Built in Shenzhen</p>
        </div>
      </div>
    </footer>
  );
}