import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { adminDeletePost, adminListPosts, adminSavePost } from "@/lib/admin.functions";
import { blogInput } from "@/lib/admin.schemas";
import { ResourceEditor, type Field, type Values } from "@/components/admin/ResourceEditor";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/blog")({
  component: BlogAdmin,
});

const fields: Field[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
  { name: "reading_minutes", label: "Reading minutes", type: "number" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "draft", label: "Draft" },
      { value: "published", label: "Published" },
    ],
  },
  { name: "cover_url", label: "Cover image URL", type: "text", full: true },
  { name: "tags", label: "Tags", type: "list", full: true },
  { name: "excerpt", label: "Excerpt", type: "textarea", rows: 3 },
  { name: "body", label: "Body (markdown)", type: "textarea", rows: 16 },
];

const blank: Values = {
  title: "",
  slug: "",
  reading_minutes: 3,
  status: "draft",
  cover_url: "",
  tags: [],
  excerpt: "",
  body: "",
};

function BlogAdmin() {
  const queryClient = useQueryClient();
  const list = useServerFn(adminListPosts);
  const save = useServerFn(adminSavePost);
  const remove = useServerFn(adminDeletePost);
  const [editing, setEditing] = useState<Values | null>(null);

  const posts = useQuery({ queryKey: ["admin", "posts"], queryFn: () => list() });

  const saveMutation = useMutation({
    mutationFn: (values: Values) => {
      const status = String(values["status"] ?? "draft");
      const parsed = blogInput.parse({
        ...values,
        cover_url: values["cover_url"] || null,
        published_at:
          status === "published"
            ? ((values["published_at"] as string | null) ?? new Date().toISOString())
            : null,
      });
      return save({ data: parsed });
    },
    onSuccess: () => {
      toast.success("Note saved.");
      setEditing(null);
      void queryClient.invalidateQueries();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Note deleted.");
      void queryClient.invalidateQueries();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-foreground">Notes</h2>
        <Button onClick={() => setEditing({ ...blank })}>New note</Button>
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
        {(posts.data ?? []).map((post) => (
          <li key={post.id} className="flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-foreground">{post.title}</p>
              <p className="technical-label mt-1">
                {post.status} · /{post.slug}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing({ ...post, cover_url: post.cover_url ?? "" })}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteMutation.mutate(post.id)}
            >
              Delete
            </Button>
          </li>
        ))}
        {posts.data?.length === 0 && (
          <li className="p-4 text-sm text-muted-foreground">No notes yet.</li>
        )}
      </ul>
    </div>
  );
}