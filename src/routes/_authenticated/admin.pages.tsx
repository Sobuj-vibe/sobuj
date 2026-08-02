import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { adminDeletePage, adminListPages, adminSavePage } from "@/lib/admin.functions";
import { pageInput } from "@/lib/admin.schemas";
import { ResourceEditor, type Field, type Values } from "@/components/admin/ResourceEditor";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/pages")({
  component: PagesAdmin,
});

const fields: Field[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
  {
    name: "format",
    label: "Format",
    type: "select",
    options: [
      { value: "markdown", label: "Markdown" },
      { value: "html", label: "HTML" },
    ],
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "draft", label: "Draft" },
      { value: "published", label: "Published" },
    ],
  },
  { name: "seo_title", label: "SEO title", type: "text", full: true },
  { name: "seo_description", label: "SEO description", type: "textarea", rows: 2 },
  { name: "body", label: "Body", type: "textarea", rows: 18 },
];

const blank: Values = {
  title: "",
  slug: "",
  format: "markdown",
  status: "draft",
  seo_title: "",
  seo_description: "",
  body: "",
};

function PagesAdmin() {
  const queryClient = useQueryClient();
  const list = useServerFn(adminListPages);
  const save = useServerFn(adminSavePage);
  const remove = useServerFn(adminDeletePage);
  const [editing, setEditing] = useState<Values | null>(null);

  const pages = useQuery({ queryKey: ["admin", "pages"], queryFn: () => list() });

  const saveMutation = useMutation({
    mutationFn: (values: Values) => {
      const parsed = pageInput.parse({
        ...values,
        seo_title: values["seo_title"] || null,
        seo_description: values["seo_description"] || null,
      });
      return save({ data: parsed });
    },
    onSuccess: () => {
      toast.success("Page saved.");
      setEditing(null);
      void queryClient.invalidateQueries();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Page deleted.");
      void queryClient.invalidateQueries();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-foreground">Custom pages</h2>
        <Button onClick={() => setEditing({ ...blank })}>New page</Button>
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
        {(pages.data ?? []).map((page) => (
          <li key={page.id} className="flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-foreground">{page.title}</p>
              <p className="technical-label mt-1">
                {page.status} · {page.format} · /p/{page.slug}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setEditing({
                  ...page,
                  seo_title: page.seo_title ?? "",
                  seo_description: page.seo_description ?? "",
                })
              }
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteMutation.mutate(page.id)}
            >
              Delete
            </Button>
          </li>
        ))}
        {pages.data?.length === 0 && (
          <li className="p-4 text-sm text-muted-foreground">No custom pages yet.</li>
        )}
      </ul>
    </div>
  );
}