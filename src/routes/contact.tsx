import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { motion } from "motion/react";
import { Github, Loader2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { sendContactMessage } from "@/lib/content.functions";
import { site } from "@/lib/site";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { breadcrumbs, canonical, jsonLd } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Sobuj Hossen" },
      {
        name: "description",
        content:
          "Get in touch with Sobuj Hossen about AI, computer vision or full-stack engineering work. Based in Shenzhen, available worldwide.",
      },
      { property: "og:title", content: "Contact — Sobuj Hossen" },
      {
        property: "og:description",
        content: "Start a project conversation with Sobuj Hossen.",
      },
      ...canonical("/contact").meta,
    ],
    links: canonical("/contact").links,
    scripts: [
      jsonLd({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact Sobuj Hossen",
        url: `${site.website}/contact`,
      }),
      jsonLd(
        breadcrumbs([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]),
      ),
    ],
  }),
  component: Contact,
});

const fieldClass =
  "w-full border border-input bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none";

function Contact() {
  const send = useServerFn(sendContactMessage);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const mutation = useMutation({
    mutationFn: () =>
      send({
        data: {
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim() || undefined,
          message: form.message.trim(),
        },
      }),
    onSuccess: () => {
      toast.success("Message sent — I'll reply within a day or two.");
      setForm({ name: "", email: "", subject: "", message: "" });
    },
    onError: () => {
      toast.error("That didn't go through. Email me directly instead.");
    },
  });

  return (
    <div className="mx-auto w-full max-w-[1240px] px-5 py-20 sm:px-8">
      <Reveal>
        <SectionHeading
          label="Contact"
          title="Tell me what needs solving."
          description="Projects, research collaborations or a second opinion on an architecture — all welcome."
        />
      </Reveal>

      <div className="mt-16 grid gap-14 lg:grid-cols-[0.62fr_0.38fr]">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="technical-label">
                Name
              </label>
              <input
                id="name"
                required
                maxLength={120}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`mt-2 ${fieldClass}`}
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="technical-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                maxLength={200}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`mt-2 ${fieldClass}`}
                placeholder="you@company.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="technical-label">
              Subject
            </label>
            <input
              id="subject"
              maxLength={200}
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className={`mt-2 ${fieldClass}`}
              placeholder="Computer vision pilot, website rebuild…"
            />
          </div>

          <div>
            <label htmlFor="message" className="technical-label">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={7}
              minLength={5}
              maxLength={5000}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className={`mt-2 resize-y ${fieldClass}`}
              placeholder="What are you building, and what's in the way?"
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {mutation.isPending ? "Sending" : "Send message"}
          </button>
        </motion.form>

        <Reveal className="space-y-8">
          <div data-reveal className="border border-hairline p-8">
            <p className="technical-label">Direct lines</p>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-3 transition-colors hover:text-primary"
                >
                  <Mail className="h-4 w-4 text-primary" /> {site.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.phone}`}
                  className="inline-flex items-center gap-3 transition-colors hover:text-primary"
                >
                  <Phone className="h-4 w-4 text-primary" /> {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 transition-colors hover:text-primary"
                >
                  <MessageCircle className="h-4 w-4 text-primary" /> WhatsApp / WeChat
                </a>
              </li>
              <li>
                <a
                  href={site.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 transition-colors hover:text-primary"
                >
                  <Github className="h-4 w-4 text-primary" /> github.com/helloSobuj
                </a>
              </li>
              <li className="inline-flex items-start gap-3 text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {site.location}
              </li>
            </ul>
          </div>

          <div data-reveal className="border border-hairline p-8">
            <p className="technical-label">Response time</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              I reply to most messages within 24–48 hours, China Standard Time
              (UTC+8). For urgent work, WhatsApp is fastest.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}