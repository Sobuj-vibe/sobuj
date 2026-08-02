import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "night" | "day";

const STORAGE_KEY = "sobuj-theme";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
}>({ theme: "night", toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("night");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    const prefersLight =
      window.matchMedia?.("(prefers-color-scheme: light)").matches ?? false;
    setTheme(stored ?? (prefersLight ? "day" : "night"));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("light", theme === "day");
    root.style.colorScheme = theme === "day" ? "light" : "dark";
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "night" ? "day" : "night";
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}