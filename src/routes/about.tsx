import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { site } from "@/lib/site";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Sobuj Hossen" },
      {
        name: "description",
        content:
          "Sobuj Hossen is an AI engineer, computer vision researcher and full-stack software engineer based in Shenzhen, China.",
      },
      { property: "og:title", content: "About — Sobuj Hossen" },
      {
        property: "og:description",
        content:
          "The background, disciplines and working principles behind Sobuj Hossen's engineering practice.",
      },
    ],
  }),
  component: About,
});

const timeline = [
  {
    period: "Now",
    title: "AI Engineer & Computer Vision Researcher",
    body: "Building detection, tracking and OCR systems that run on constrained hardware, plus the tooling and dashboards that make them observable.",
  },
  {
    period: "Ongoing",
    title: "Full-Stack Software Engineer",
    body: "Typed React and TypeScript front ends on Postgres, with auth, roles and content pipelines designed for the people who maintain them.",
  },
  {
    period: "Since 2019",
    title: "Independent web partner",
    body: "Corporate, industrial, medical and e-commerce sites for clients across Asia and the Gulf — from brand systems to launch and SEO.",
  },
];

const principles = [
  {
    title: "Constraints first",
    body: "Latency budget, hardware, deadline and maintainer skill are all part of the spec — not afterthoughts.",
  },
  {
    title: "Measure, then claim",
    body: "A model or page ships with numbers attached: accuracy under drift, cold-start time, Lighthouse budget.",
  },
  {
    title: "Motion with meaning",
    body: "Animation exists to explain state and hierarchy. If it doesn't inform, it gets cut.",
  },
  {
    title: "Own the handover",
    body: "Documentation, admin tooling and clean structure so the work survives without me in the room.",
  },
];

function About() {
  return (
    <div className="mx-auto w-full max-w-[1240px] px-5 py-20 sm:px-8">
      <div className="grid gap-14 lg:grid-cols-[1fr_0.7fr] lg:items-start">
        <Reveal>
          <SectionHeading
            label="About"
            title="Engineer by training, problem solver by instinct."
          />
          <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p data-reveal>
              I&apos;m {site.name}, working from {site.location}. My work sits where
              research meets shipping: computer-vision models that must survive real
              lighting and real hardware, and full-stack products that must survive
              real users.
            </p>
            <p data-reveal>
              That combination means I can take a problem from a vague brief through
              data collection, model training, API design, interface and deployment
              without handing it across three teams. Fewer translation losses, faster
              iteration.
            </p>
            <p data-reveal>
              Outside client work I research vision architectures, write short field
              notes about what actually held up in production, and build interfaces
              that treat motion as information rather than decoration.
            </p>
          </div>
          <img
            data-reveal
            src={site.images.signature}
            alt={`${site.name} signature`}
            className="mt-10 h-16 w-auto opacity-85"
          />
        </Reveal>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="absolute -inset-3 border border-hairline" aria-hidden />
          <img
            src={site.images.portrait}
            alt={`Portrait of ${site.name}`}
            className="relative w-full object-cover"
          />
          <dl className="mt-8 space-y-4 border-t border-hairline pt-6 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="technical-label">Based in</dt>
              <dd className="text-right text-muted-foreground">{site.location}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="technical-label">Email</dt>
              <dd className="text-right">
                <a href={`mailto:${site.email}`} className="hover:text-primary">
                  {site.email}
                </a>
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="technical-label">Site</dt>
              <dd className="text-right">
                <a
                  href={site.website}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary"
                >
                  sobuj.top
                </a>
              </dd>
            </div>
          </dl>
        </motion.div>
      </div>

      <Reveal className="mt-28">
        <p data-reveal className="technical-label">
          Trajectory
        </p>
        <ul className="mt-8 border-t border-hairline">
          {timeline.map((entry) => (
            <li
              key={entry.title}
              data-reveal
              className="grid gap-3 border-b border-hairline py-8 sm:grid-cols-[10rem_1fr] sm:gap-10"
            >
              <p className="technical-label pt-1">{entry.period}</p>
              <div>
                <h3 className="text-2xl leading-tight">{entry.title}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {entry.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-24">
        <p data-reveal className="technical-label">
          How I work
        </p>
        <div className="mt-8 grid gap-px sm:grid-cols-2">
          {principles.map((item) => (
            <div key={item.title} data-reveal className="border border-hairline p-8">
              <h3 className="text-xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}