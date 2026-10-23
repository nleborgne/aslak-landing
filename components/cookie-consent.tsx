"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { saveConsent, useConsent, type Consent } from "@/lib/consent";
import { META_PIXEL_ID } from "@/lib/meta-pixel-config";

const DENY_ALL: Consent = { analytics: false, marketing: false };
const ACCEPT_ALL: Consent = { analytics: true, marketing: true };

const AD_PARTNERS = META_PIXEL_ID
  ? "Google Ads et Meta (Facebook, Instagram)"
  : "Google Ads";

function CookieCategory({
  label,
  description,
  checked,
  disabled,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  const id = useId();

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <Label htmlFor={id}>{label}</Label>
        <p id={`${id}-description`} className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <Switch
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        aria-describedby={`${id}-description`}
      />
    </div>
  );
}

// Monté à chaque ouverture : l'état repart du consentement enregistré
function CookiePreferences({ onDone }: { onDone: () => void }) {
  const consent = useConsent();
  const [analytics, setAnalytics] = useState(consent?.analytics ?? false);
  const [marketing, setMarketing] = useState(consent?.marketing ?? false);

  function save(choice: Consent) {
    saveConsent(choice);
    onDone();
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Gestion des cookies</DialogTitle>
        <DialogDescription>
          Choisissez les cookies que vous acceptez. Vous pouvez modifier ou
          retirer votre choix à tout moment.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-5">
        <CookieCategory
          label="Strictement nécessaires"
          description="Indispensables au fonctionnement du site, dont la mémorisation de votre choix sur les cookies. Toujours actifs."
          checked
          disabled
        />
        <CookieCategory
          label="Mesure d’audience"
          description="Utilisés par Google Analytics pour mesurer la fréquentation du site et l’améliorer."
          checked={analytics}
          onCheckedChange={setAnalytics}
        />
        <CookieCategory
          label="Publicité"
          description={`Utilisés par ${AD_PARTNERS} pour mesurer l’efficacité de nos publicités et personnaliser les annonces.`}
          checked={marketing}
          onCheckedChange={setMarketing}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={() => save(DENY_ALL)}>
          Tout refuser
        </Button>
        <Button variant="outline" onClick={() => save(ACCEPT_ALL)}>
          Tout accepter
        </Button>
        <Button
          className="col-span-2"
          onClick={() => save({ analytics, marketing })}
        >
          Enregistrer mes choix
        </Button>
      </div>
    </>
  );
}

// children = déclencheur, pour que Radix lui rende le focus à la fermeture
export function CookiePreferencesDialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <CookiePreferences onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

export function CookieBanner() {
  const consent = useConsent();
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  if (consent !== null) {
    return null;
  }

  // z-40 : les dialogs Radix (z-50), dont le formulaire d'essai, passent au-dessus
  return (
    <>
      {/* Réserve la hauteur de la bannière pour pouvoir faire défiler le contenu au-dessus */}
      <div aria-hidden className="h-56 sm:h-44" />
      <section
        aria-label="Consentement aux cookies"
        className="fixed inset-x-2 bottom-2 z-40 mx-auto max-w-3xl rounded-lg border bg-background p-3 shadow-lg sm:inset-x-4 sm:bottom-4 sm:p-4"
      >
        <p className="text-xs sm:text-sm">
          Nous utilisons des cookies pour mesurer l&rsquo;audience du site, ainsi
          que l&rsquo;efficacité de nos publicités et la personnalisation des
          annonces ({AD_PARTNERS}). Vous pouvez les accepter, les refuser ou
          personnaliser vos choix, puis les modifier à tout moment via le lien
          «&nbsp;Gestion des cookies&nbsp;».
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:justify-end">
          <Button size="sm" onClick={() => saveConsent(DENY_ALL)}>
            Tout refuser
          </Button>
          <Button size="sm" onClick={() => saveConsent(ACCEPT_ALL)}>
            Tout accepter
          </Button>
          <CookiePreferencesDialog
            open={preferencesOpen}
            onOpenChange={setPreferencesOpen}
          >
            <Button
              size="sm"
              variant="ghost"
              className="col-span-2 sm:order-first"
            >
              Personnaliser
            </Button>
          </CookiePreferencesDialog>
        </div>
      </section>
    </>
  );
}

export function CookieSettingsLink({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <CookiePreferencesDialog open={open} onOpenChange={setOpen}>
      <button type="button" className={className}>
        Gestion des cookies
      </button>
    </CookiePreferencesDialog>
  );
}
