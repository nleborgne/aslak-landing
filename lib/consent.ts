import { useSyncExternalStore } from "react";
import { getGtag } from "@/lib/google-tag";
import { META_PIXEL_ID } from "@/lib/meta-pixel-config";

export type Consent = { analytics: boolean; marketing: boolean };

export const CONSENT_STORAGE_KEY = "aslak-consent";
// Change avec la liste des partenaires : un choix antérieur est alors redemandé
export const CONSENT_VERSION = META_PIXEL_ID ? "google-meta" : "google";

// La CNIL recommande de redemander le consentement au bout de 6 mois
const CONSENT_MAX_AGE_MS = 182 * 24 * 60 * 60 * 1000;

const listeners = new Set<() => void>();
// undefined = pas encore lu, null = aucun choix valide
let cachedConsent: Consent | null | undefined;

export function toGoogleConsent({ analytics, marketing }: Consent) {
  const analyticsStatus = analytics ? "granted" : "denied";
  const marketingStatus = marketing ? "granted" : "denied";
  return {
    ad_storage: marketingStatus,
    analytics_storage: analyticsStatus,
    ad_user_data: marketingStatus,
    ad_personalization: marketingStatus,
  };
}

function readConsent(): Consent | null {
  try {
    const stored = JSON.parse(
      localStorage.getItem(CONSENT_STORAGE_KEY) ?? "null",
    );
    if (
      stored &&
      stored.version === CONSENT_VERSION &&
      stored.expires > Date.now()
    ) {
      return {
        analytics: stored.analytics === true,
        marketing: stored.marketing === true,
      };
    }
  } catch {
    // Stockage indisponible ou valeur illisible : on redemande
  }
  return null;
}

function getSnapshot() {
  if (cachedConsent === undefined) {
    cachedConsent = readConsent();
  }
  return cachedConsent;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function saveConsent({ analytics, marketing }: Consent) {
  const consent = { analytics, marketing };
  const google = toGoogleConsent(consent);
  try {
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({
        ...consent,
        google,
        version: CONSENT_VERSION,
        expires: Date.now() + CONSENT_MAX_AGE_MS,
      }),
    );
  } catch {
    // Stockage indisponible : le choix ne vaut que pour cette visite
  }
  cachedConsent = consent;
  getGtag()?.("consent", "update", google);
  listeners.forEach((listener) => listener());
}

// undefined côté serveur et pendant l'hydratation, null tant qu'aucun choix
export function useConsent() {
  return useSyncExternalStore<Consent | null | undefined>(
    subscribe,
    getSnapshot,
    () => undefined,
  );
}
