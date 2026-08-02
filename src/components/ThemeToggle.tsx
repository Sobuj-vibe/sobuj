import { motion, AnimatePresence } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isNight = theme === "night";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isNight ? "Switch to day theme" : "Switch to night theme"}
      aria-pressed={!isNight}
      className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={theme}
          initial={{ y: 14, opacity: 0, rotate: -35 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -14, opacity: 0, rotate: 35 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="absolute inline-flex"
        >
          {isNight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}