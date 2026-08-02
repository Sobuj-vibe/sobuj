import {
  RiDiscordFill,
  RiDropboxFill,
  RiFigmaFill,
  RiGithubFill,
  RiGoogleFill,
  RiNotionFill,
  RiSlackFill,
  RiSupabaseFill,
  RiVercelFill,
} from "@remixicon/react";

const logos = [
  { name: "Slack", Icon: RiSlackFill },
  { name: "GitHub", Icon: RiGithubFill },
  { name: "Notion", Icon: RiNotionFill },
  { name: "Figma", Icon: RiFigmaFill },
  { name: "Vercel", Icon: RiVercelFill },
  { name: "Supabase", Icon: RiSupabaseFill },
  { name: "Google", Icon: RiGoogleFill },
  { name: "Discord", Icon: RiDiscordFill },
  { name: "Dropbox", Icon: RiDropboxFill },
];

export default function LogoCloudBlock({ label }: { label?: string }) {
  return (
    <div className="mx-auto w-full max-w-[1240px] px-5 py-14 sm:px-8">
      <style>{`
        @keyframes logo-cloud-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .logo-cloud-track {
          animation: logo-cloud-marquee 32s linear infinite;
        }
        .logo-cloud-mask:hover .logo-cloud-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .logo-cloud-track { animation: none; }
        }
      `}</style>

      <p className="technical-label text-center">
        {label ?? "Tools and platforms in the daily stack"}
      </p>

      <div
        className="logo-cloud-mask mt-8 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div className="logo-cloud-track flex w-max items-center gap-14 sm:gap-20">
          {[...logos, ...logos].map(({ name, Icon }, index) => (
            <div
              key={`${name}-${index}`}
              aria-hidden={index >= logos.length ? "true" : undefined}
              className="flex shrink-0 items-center gap-3 text-muted-foreground transition-colors hover:text-primary"
            >
              <Icon size={26} aria-hidden="true" />
              <span className="text-sm tracking-wide">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
