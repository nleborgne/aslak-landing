"use client";

import { useQueryState, parseAsStringLiteral } from "nuqs";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { HOME_CONTENT, type HomeType } from "@/lib/config";

const homeTypes = ["crossfit", "hyrox"] as const;

const TYPE_TO_THEME: Record<HomeType, string> = {
  crossfit: "dark-red",
  hyrox: "dark-yellow",
};

export function useHomeType() {
  const [type, setType] = useQueryState(
    "type",
    parseAsStringLiteral(homeTypes).withDefault("crossfit")
  );
  return [type as HomeType, setType] as const;
}

export function useHomeContent() {
  const [type] = useHomeType();
  return HOME_CONTENT[type];
}

export function TypeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [type, setType] = useHomeType();
  const { setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setTheme(TYPE_TO_THEME[type]);
  }, [type, setTheme]);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 rounded-full bg-white/10 p-1 ring-1 ring-white/10">
        <div className="rounded-full px-3 py-1 text-xs font-medium text-white/70">
          CrossFit
        </div>
        <div className="rounded-full px-3 py-1 text-xs font-medium text-white/70">
          Hyrox
        </div>
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Content type selection"
      className="flex items-center gap-1 rounded-full bg-white/10 p-1 ring-1 ring-white/10"
    >
      <button
        role="radio"
        aria-checked={type === "crossfit"}
        onClick={() => setType("crossfit")}
        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          type === "crossfit"
            ? "bg-primary text-black"
            : "text-white/70 hover:text-white"
        }`}
      >
        CrossFit
      </button>
      <button
        role="radio"
        aria-checked={type === "hyrox"}
        onClick={() => setType("hyrox")}
        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          type === "hyrox"
            ? "bg-primary text-black"
            : "text-white/70 hover:text-white"
        }`}
      >
        Hyrox
      </button>
    </div>
  );
}

export function Logo() {
  const content = useHomeContent();
  return (
    <div className="flex items-center gap-3">
      <div className="h-7 w-7 rounded-lg bg-primary" />
      <span className="font-black tracking-tight">{content.logo}</span>
    </div>
  );
}

export function HeroContent() {
  const content = useHomeContent();
  return (
    <>
      <h1 className="text-5xl sm:text-6xl font-black leading-[1.05]">
        <span className="block">{content.hero.title}</span>
        <span className="block text-primary">{content.hero.highlight}</span>
      </h1>
      <p className="mt-5 max-w-xl text-white/70">{content.hero.description}</p>
    </>
  );
}

export function HeroCTA() {
  const content = useHomeContent();
  return (
    <>
      <span>{content.cta.primary}</span>
    </>
  );
}

export function SecondaryCTA() {
  const content = useHomeContent();
  return <>{content.cta.secondary}</>;
}
