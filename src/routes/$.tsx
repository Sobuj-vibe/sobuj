import { createFileRoute, Link } from "@tanstack/react-router";
import { navLinks } from "@/lib/site";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "Page not found — Sobuj Hossen" },
      {
        name: "description",
        content: "That address doesn't exist on sobuj.top.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: CatchAll,
});

function CatchAll() {
  return (
    <div className="relative overflow-hidden">
      <div className="blueprint-grid absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto w-full max-w-[1240px] px-5 py-28 sm:px-8">
        <p className="technical-label">Ref: SK-404 · Sheet not on file</p>
        <h1 className="mt-4 text-[clamp(3rem,9vw,6rem)] leading-[0.95]">404</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          This drawing was never issued, or it has been superseded. Pick a sheet from
          the index below.
        </p>
        <ul className="mt-12 grid max-w-2xl gap-0 border-t border-hairline">
          {navLinks.map((link) => (
            <li key={link.to} className="border-b border-hairline">
              <Link
                to={link.to}
                className="group flex items-baseline justify-between py-5 transition-colors hover:text-primary"
              >
                <span className="text-xl">{link.label}</span>
                <span className="technical-label transition-transform group-hover:translate-x-1">
                  {link.to}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}