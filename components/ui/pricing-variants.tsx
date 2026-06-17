"use client";

import { useState } from "react";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { PLANS } from "@/lib/config";
import type { Plan } from "@/models/plan";

type Commitment = "base" | "trimester" | "yearly";

function priceFor(plan: Plan, commitment: Commitment) {
  if (plan.billing !== "monthly") return plan.price.base;
  return commitment === "base"
    ? plan.price.base
    : Math.round(plan.price[commitment]);
}

// Mobile-first billing toggle (select on phone, tabs on desktop)
function BillingToggle({
  value,
  onChange,
}: {
  value: Commitment;
  onChange: (v: Commitment) => void;
}) {
  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <Select value={value} onValueChange={(v) => onChange(v as Commitment)}>
        <SelectTrigger className="h-12 w-full text-base">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="base">Sans engagement</SelectItem>
          <SelectItem value="trimester">Engagement 3 mois</SelectItem>
          <SelectItem value="yearly">Engagement 12 mois · -35%</SelectItem>
        </SelectContent>
      </Select>
    );
  }
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as Commitment)}>
      <TabsList className="h-12">
        <TabsTrigger value="base" className="px-4 text-base">
          Sans engagement
        </TabsTrigger>
        <TabsTrigger value="trimester" className="px-4 text-base">
          3 mois
        </TabsTrigger>
        <TabsTrigger value="yearly" className="px-4 text-base">
          12 mois
          <span className="ml-2 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
            -35%
          </span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

// ── Grouped — memberships vs à la carte ───────────────────────────
// Splits IA: monthly memberships up top (emphasis), session packs as a
// compact secondary strip below.
export function PricingGrouped() {
  const [commitment, setCommitment] = useState<Commitment>("yearly");
  const memberships = PLANS.filter((p) => p.billing === "monthly");
  const packs = PLANS.filter((p) => p.billing !== "monthly");

  return (
    <div className="mx-auto w-full max-w-5xl space-y-14 px-1">
      <div className="text-center">
        <h2 className="mx-auto max-w-[24ch] text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Prix &amp; abonnements
        </h2>
        <p className="mx-auto mt-4 max-w-[48ch] text-lg text-pretty text-muted-foreground">
          Un abonnement pour progresser au quotidien, ou des cartes à la séance
          pour rester libre.
        </p>
      </div>

      {/* Memberships */}
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h3 className="text-xl font-semibold tracking-tight">Abonnements</h3>
          <BillingToggle value={commitment} onChange={setCommitment} />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {memberships.map((plan) => {
            const price = priceFor(plan, commitment);
            const saving = plan.price.base - price;
            return (
              <div
                key={plan.name}
                className={`flex flex-col justify-between rounded-2xl border bg-card p-7 ${
                  plan.isFeatured
                    ? "border-primary ring-1 ring-primary"
                    : "border-border"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-lg font-semibold">{plan.name}</h4>
                    {plan.isFeatured && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
                        <Star className="size-3 fill-current" />
                        Populaire
                      </span>
                    )}
                  </div>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-5xl font-semibold tracking-tight">
                      {price}&nbsp;€
                    </span>
                    <span className="text-sm text-muted-foreground">/ mois</span>
                  </div>
                  {commitment !== "base" && saving > 0 && (
                    <div className="mt-2">
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                        Économisez {saving} €/mois
                      </span>
                    </div>
                  )}
                  <ul role="list" className="mt-6 space-y-3 text-sm">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* CTA désactivé
                <div className="mt-8">
                  <Button
                    asChild
                    variant={plan.isFeatured ? "default" : "secondary"}
                    size="lg"
                    className="w-full"
                  >
                    <a href={plan.ctaHref ?? "#"}>{plan.ctaText ?? "S'abonner"}</a>
                  </Button>
                </div>
                */}
              </div>
            );
          })}
        </div>
      </div>

      {/* À la carte */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold tracking-tight">À la carte</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {packs.map((plan) => (
            <div
              key={plan.name}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5"
            >
              <div>
                <div className="font-semibold">{plan.name}</div>
                <div className="text-sm text-muted-foreground">
                  {plan.description}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-semibold tracking-tight">
                  {plan.price.base}&nbsp;€
                </span>
                {/* CTA désactivé
                <Button asChild variant="secondary">
                  <a href={plan.ctaHref ?? "#"}>{plan.ctaText ?? "Acheter"}</a>
                </Button>
                */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
