"use client";

import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

const THEME_STORAGE_KEY = "booknook-theme";

function applyTheme(isDark) {
  const root = document.documentElement;
  root.classList.toggle("dark", isDark);
  root.style.colorScheme = isDark ? "dark" : "light";

  try {
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
  } catch {
    // Private browsing or storage disabled: the theme still applies for this page.
  }
}

export default function ThemeToggle({ className }) {
  function handleToggle() {
    const isDark = document.documentElement.classList.contains("dark");
    applyTheme(!isDark);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="Toggle light and dark theme"
      title="Toggle light and dark theme"
      className={cn(
        "group inline-flex size-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className,
      )}
    >
      <Moon
        aria-hidden="true"
        className="size-5 transition-transform duration-300 group-hover:-rotate-12 dark:hidden"
      />
      <Sun
        aria-hidden="true"
        className="hidden size-5 transition-transform duration-300 group-hover:rotate-45 dark:block"
      />
    </button>
  );
}
