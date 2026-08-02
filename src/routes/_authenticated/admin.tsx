import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { claimAdmin, getAdminStatus } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const sections = [
  { to: "/admin", label: "Overview", exact: true },
  { to: "/admin/portfolio", label: "Portfolio" },
  { to: "/admin/blog", label: "Notes" },
  { to: "/admin/pages", label: "Pages" },
  { to: "/admin/messages", label: "Messages" },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchStatus = useServerFn(getAdminStatus);
  const claim = useServerFn(claimAdmin);

  const status = useQuery({
    queryKey: ["admin", "status"],
    queryFn: () => fetchStatus(),
  });

  const claimMutation = useMutation({
    mutationFn: () => claim(),
    onSuccess: (result) => {
      if (result.ok) {
        toast.success("Owner access granted.");
        void queryClient.invalidateQueries({ queryKey: ["admin"] });
      } else {
        toast.error("An owner already exists for this site.");
      }
    },
    onError: (error: Error) => toast.error(error.message),
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="mx-auto w-full max-w-[1240px] px-5 py-14 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-6">
        <div>
          <p className="technical-label">Ref: SK-ADMIN · Control room</p>
          <h1 className="mt-2 font-serif text-4xl text-foreground">Studio CMS</h1>
        </div>
        <Button variant="outline" onClick={() => void signOut()}>
          Sign out
        </Button>
      </div>

      {status.isLoading ? (
        <p className="mt-10 text-sm text-muted-foreground">Checking access…</p>
      ) : status.data?.isAdmin ? (
        <div className="mt-8 grid gap-10 md:grid-cols-[180px_1fr]">
          <nav aria-label="Admin" className="flex flex-wrap gap-2 md:flex-col">
            {sections.map((section) => (
              <Link
                key={section.to}
                to={section.to}
                activeOptions={{ exact: section.exact ?? false }}
                className="border border-hairline px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:border-primary data-[status=active]:text-primary"
              >
                {section.label}
              </Link>
            ))}
          </nav>
          <div className="min-w-0">
            <Outlet />
          </div>
        </div>
      ) : (
        <div className="mt-10 max-w-lg border border-hairline bg-card p-6">
          <h2 className="font-serif text-2xl text-foreground">No owner access</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            This account isn&rsquo;t an administrator yet. If you are setting the site
            up for the first time, claim ownership below — this works only while no
            owner exists.
          </p>
          <Button
            className="mt-5"
            onClick={() => claimMutation.mutate()}
            disabled={claimMutation.isPending}
          >
            {claimMutation.isPending ? "Claiming…" : "Claim owner access"}
          </Button>
        </div>
      )}
    </div>
  );
}