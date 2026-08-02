import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
// Vite 8's dev server bundles client modules under /assets/*, so the `?url`
// path (/src/styles.css) 404s in dev and the preview renders unstyled.
// Side-effect import lets the dev bundler inject the stylesheet instead.
if (import.meta.env.DEV) {
  void import("../styles.css");
}
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ThemeProvider } from "../lib/theme";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { PageTransition } from "../components/layout/PageTransition";
import { Toaster } from "../components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Sobuj Hossen — AI Engineer & Full-Stack Developer" },
      {
        name: "description",
        content:
          "Real-life problem solver. AI engineer, computer vision researcher and full-stack software engineer based in Shenzhen, China.",
      },
      { name: "author", content: "Sobuj Hossen" },
      { property: "og:title", content: "Sobuj Hossen — AI Engineer & Full-Stack Developer" },
      {
        property: "og:description",
        content:
          "Real-life problem solver. AI engineer, computer vision researcher and full-stack software engineer based in Shenzhen, China.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Sobuj Hossen — AI Engineer & Full-Stack Developer" },
      { name: "twitter:description", content: "Real-life problem solver. AI engineer, computer vision researcher and full-stack software engineer based in Shenzhen, China." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3265da7a-eee9-4076-88ee-2ae9df862e67/id-preview-4192c94d--a495bf49-c0f0-4903-aa87-a0c99580616a.lovable.app-1785677629860.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3265da7a-eee9-4076-88ee-2ae9df862e67/id-preview-4192c94d--a495bf49-c0f0-4903-aa87-a0c99580616a.lovable.app-1785677629860.png" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="flex min-h-screen flex-col">
          <a
            href="#main"
            className="sr-only left-4 top-4 z-[100] border border-primary bg-background px-4 py-2 text-sm text-primary focus:not-sr-only focus:absolute"
          >
            Skip to content
          </a>
          <Header />
          <main id="main" className="flex-1">
            <PageTransition>
              {/* Required: nested routes render here. */}
              <Outlet />
            </PageTransition>
          </main>
          <Footer />
        </div>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
