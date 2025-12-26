"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Flame, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return placeholder with same dimensions to prevent layout shift
  if (!mounted) {
    return (
      <div
        className="flex items-center gap-1 p-1 border border-white/20 rounded-full"
        aria-hidden="true"
      >
        <div className="w-8 h-8 rounded-full" />
        <div className="w-8 h-8 rounded-full" />
      </div>
    );
  }

  const isRedTheme = theme === "dark-red";
  const isYellowTheme = theme === "dark-yellow";

  return (
    <div
      role="radiogroup"
      aria-label="Theme selection"
      className="flex items-center gap-1 p-1 border border-white/20 hover:border-white/40 rounded-full transition-colors duration-200"
    >
      <button
        type="button"
        role="radio"
        aria-checked={isRedTheme}
        aria-label="Switch to red theme"
        onClick={() => setTheme("dark-red")}
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200",
          isRedTheme
            ? "bg-red-500/20 scale-110 ring-1 ring-red-500/50"
            : "hover:bg-white/10 scale-100"
        )}
      >
        <Flame
          className={cn(
            "w-4 h-4 transition-colors duration-200",
            isRedTheme ? "text-red-500" : "text-white/50 hover:text-white/70"
          )}
        />
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={isYellowTheme}
        aria-label="Switch to yellow theme"
        onClick={() => setTheme("dark-yellow")}
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200",
          isYellowTheme
            ? "bg-yellow-500/20 scale-110 ring-1 ring-yellow-500/50"
            : "hover:bg-white/10 scale-100"
        )}
      >
        <Zap
          className={cn(
            "w-4 h-4 transition-colors duration-200",
            isYellowTheme
              ? "text-yellow-500"
              : "text-white/50 hover:text-white/70"
          )}
        />
      </button>
    </div>
  );
}
