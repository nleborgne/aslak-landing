"use client";

import Script from "next/script";
import {
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  toGoogleConsent,
} from "@/lib/consent";
import {
  GA4_MEASUREMENT_ID,
  GOOGLE_ADS_ID,
  GOOGLE_TAG_ID,
} from "@/lib/google-tag-config";

const DEFAULT_CONSENT = JSON.stringify(
  toGoogleConsent({ analytics: false, marketing: false }),
);

export function GoogleTag() {
  return (
    <>
      <Script id="google-tag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('consent', 'default', ${DEFAULT_CONSENT});
          gtag('set', 'ads_data_redaction', true);
          try {
            var stored = JSON.parse(localStorage.getItem('${CONSENT_STORAGE_KEY}'));
            if (stored && stored.version === '${CONSENT_VERSION}' && stored.expires > Date.now()) {
              gtag('consent', 'update', stored.google);
            }
          } catch (e) {}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_TAG_ID}');
          gtag('config', '${GA4_MEASUREMENT_ID}');
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
