import {
  GA4_MEASUREMENT_ID,
  GOOGLE_ADS_ID,
  GOOGLE_ADS_TRIAL_CONVERSION_LABEL,
} from "@/lib/google-tag-config";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function getGtag() {
  if (typeof window === "undefined") {
    return undefined;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.gtag =
    window.gtag ??
    function gtag() {
      window.dataLayer?.push(arguments);
    };

  return window.gtag;
}

export function trackTrialRequestConversion(transactionId: string) {
  const gtag = getGtag();
  if (!gtag) {
    return;
  }

  // GA4 lead event, deliberately emitted only from the rendered confirmation.
  gtag("event", "generate_lead", {
    send_to: GA4_MEASUREMENT_ID,
    form_name: "Formulaire séance d’essai – Site web",
    transaction_id: transactionId,
  });

  gtag("event", "conversion", {
    send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_TRIAL_CONVERSION_LABEL}`,
    transaction_id: transactionId,
  });
}
