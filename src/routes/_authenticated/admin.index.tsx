import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminOverview } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Overview,
});

function Overview() {
  const fetchOverview = useServerFn(adminOverview);
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: () => fetchOverview(),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!data) return null;

  const cards = [
    { label: "Portfolio items", value: data.portfolio.total, note: `${data.portfolio.published} published` },
    { label: "Notes", value: data.posts.total, note: `${data.posts.published} published` },
    { label: "Custom pages", value: data.pages.total, note: `${data.pages.published} published` },
    { label: "Messages", value: data.messages.total, note: `${data.messages.unhandled} unhandled` },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map((card) => (
        <div key={card.label} className="border border-hairline bg-card p-5">
          <p className="technical-label">{card.label}</p>
          <p className="mt-3 font-serif text-4xl text-foreground">{card.value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{card.note}</p>
        </div>
      ))}
    </div>
  );
}