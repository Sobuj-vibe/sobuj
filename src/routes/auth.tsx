import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { site } from "@/lib/site";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Studio access — Sobuj Hossen" },
      {
        name: "description",
        content:
          "Private sign-in for the studio CMS behind sobuj.top. Not intended for public use.",
      },
      { property: "og:title", content: "Studio access — Sobuj Hossen" },
      {
        property: "og:description",
        content: "Private sign-in for the studio CMS behind sobuj.top.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/auth" },
        });
        if (error) throw error;
        if (!data.session) {
          setSent(true);
          toast.success("Check your inbox to confirm the address.");
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      await navigate({ to: "/admin", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col justify-center px-5 py-24 sm:px-8">
      <p className="technical-label">Ref: SK-ADMIN</p>
      <h1 className="mt-3 font-serif text-4xl text-foreground">Studio access</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Private control room for {site.name}&rsquo;s portfolio, notes and pages.
      </p>

      {sent ? (
        <p className="mt-8 border border-hairline bg-card p-5 text-sm text-muted-foreground">
          Confirmation email sent to <span className="text-foreground">{email}</span>.
          Confirm it, then sign in here.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <Label htmlFor="email" className="technical-label">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="password" className="technical-label">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2"
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>
      )}

      <button
        type="button"
        onClick={() => {
          setSent(false);
          setMode((m) => (m === "signin" ? "signup" : "signin"));
        }}
        className="mt-6 text-left text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
      >
        {mode === "signin"
          ? "First time here? Create the owner account."
          : "Already have an account? Sign in."}
      </button>
    </div>
  );
}