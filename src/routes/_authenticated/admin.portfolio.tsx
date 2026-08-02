import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  adminDeletePortfolio,
  adminListPortfolio,
  adminSavePortfolio,
} from "@/lib/admin.functions";
import { portfolioInput } from "@/lib/admin.schemas";
import { ResourceEditor, type Field, type Values } from "@/components/admin/ResourceEditor";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/portfolio")({
  component: PortfolioAdmin,
});

const fields: Field[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "slug", label: "Slug", type: "text", placeholder: "faraji-logistics" },
  { name: "category", label: "Category", type: "text" },
  { name: "client", label: "Client", type: "text" },
  { name: "year", label: "Year", type: "number" },
  { name: "sort_order", label: "Sort order", type: "number" },
  { name: "cover_url", label: "Cover image URL", type: "text", full: true },
  { name: "gallery", label: "Gallery URLs", type: "list", full: true },
  { name: "tech", label: "Tech stack", type: "list", full: true },
  { name: "live_url", label: "Live URL", type: "text" },
  { name: "repo_url", label: "Repo URL", type: "text" },
  { name: "summary", label: "Summary", type: "textarea", rows: 3 },
  { name: "description", label: "Case study (markdown)", type: "textarea", rows: 12 },
  { name: "featured", label: "Featured", type: "switch" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "draft", label: "Draft" },
      { value: "published", label: "Published" },
    ],
  },
];

const blank: Values = {
  title: "",
  slug: "",
  category: "Web",
  client: "",
  year: new Date().getFullYear(),
  sort_order: 0,
  cover_url: "",
  gallery: [],
  tech: [],
  live_url: "",
  repo_url: "",
  summary: "",
  description: "",
  featured: false,
  status: "draft",
};

function PortfolioAdmin() {
  const queryClient = useQueryClient();
  const list = useServerFn(adminListPortfolio);
  const save = useServerFn(adminSavePortfolio);
  const remove = useServerFn(adminDeletePortfolio);
  const [editing, setEditing] = useState<Values | null>(null);

  const items = useQuery({
    queryKey: ["admin", "portfolio"],
    queryFn: () => list(),
  });

  const saveMutation = useMutation({
    mutationFn: (values: Values) => {
      const parsed = portfolioInput.parse({
        ...values,
        client: values["client"] || null,
        cover_url: values["cover_url"] || null,
        live_url: values["live_url"] || null,
        repo_url: values["repo_url"] || null,
      });
      return save({ data: parsed });
    },
    onSuccess: () => {
      toast.success("Project saved.");
      setEditing(null);
      void queryClient.invalidateQueries();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Project deleted.");
      void queryClient.invalidateQueries();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-foreground">Portfolio</h2>
        <Button onClick={() => setEditing({ ...blank })}>New project</Button>
      </div>

      {editing && (
        <ResourceEditor
          fields={fields}
          value={editing}
          saving={saveMutation.isPending}
          onCancel={() => setEditing(null)}
          onSubmit={(values) => saveMutation.mutate(values)}
        />
      )}

      <ul className="divide-y divide-border border border-hairline">
        {(items.data ?? []).map((item) => (
          <li key={item.id} className="flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-foreground">{item.title}</p>
              <p className="technical-label mt-1">
                {item.status} · {item.category} · /{item.slug}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setEditing({
                  ...item,
                  client: item.client ?? "",
                  cover_url: item.cover_url ?? "",
                  live_url: item.live_url ?? "",
                  repo_url: item.repo_url ?? "",
                })
              }
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteMutation.mutate(item.id)}
            >
              Delete
            </Button>
          </li>
        ))}
        {items.data?.length === 0 && (
          <li className="p-4 text-sm text-muted-foreground">No projects yet.</li>
        )}
      </ul>
    </div>
  );
}