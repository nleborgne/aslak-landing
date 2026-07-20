"use client";

import { useHomeContent } from "@/components/home-content";
import { Button } from "@/components/ui/button";
import { TrialDialog } from "@/components/trial-dialog";

// Shared inline star rating (mobile-first, brand-colored)
function Stars({ score = 4.8 }: { score?: number }) {
  const full = Math.floor(score);
  const half = score - full >= 0.5;
  const arr = Array.from({ length: 5 }, (_, i) =>
    i < full ? "full" : i === full && half ? "half" : "empty"
  );
  return (
    <div className="flex items-center gap-0.5 text-primary" aria-hidden>
      {arr.map((t, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`h-4 w-4 ${t === "empty" ? "opacity-30" : ""}`}
        >
          {t === "half" && (
            <defs>
              <linearGradient id={`hg${i}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
          )}
          <path
            fill={t === "half" ? `url(#hg${i})` : "currentColor"}
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          />
        </svg>
      ))}
    </div>
  );
}

export function HeroFullBleed() {
  const content = useHomeContent();
  return (
    <section className="relative -mt-px min-h-[88svh] sm:min-h-[600px] overflow-hidden">
      <img
        src="/og.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* readability scrims */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />

      <div className="relative mx-auto flex min-h-[88svh] sm:min-h-[600px] max-w-7xl flex-col justify-end px-5 pb-12 pt-28 sm:px-8 sm:pb-16">
        <div className="text-xs font-medium uppercase tracking-wide text-primary">
          Carrières-sur-Seine (78) · 530m² · Parking
        </div>
        <h1 className="mt-4 max-w-[20ch] text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
          {content.hero.title}{" "}
          <span className="text-primary">{content.hero.highlight}</span>
        </h1>
        <p className="mt-5 max-w-[48ch] text-lg text-pretty text-foreground/80">
          {content.hero.description}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <TrialDialog>
            <Button size="lg" className="w-full sm:w-auto">
              {content.cta.primary}
            </Button>
          </TrialDialog>
          <a href="/#planning" className="w-full sm:w-auto">
            <Button variant="ghost" size="lg" className="w-full">
              {content.cta.secondary}
            </Button>
          </a>
        </div>
        <div className="mt-7 flex items-center gap-2 text-sm text-foreground/80">
          <Stars score={4.8} />
          <span className="font-semibold text-foreground">4.8/5</span>
          <span>· 175+ avis Google</span>
        </div>
      </div>
    </section>
  );
}
