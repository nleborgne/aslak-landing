
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/theme-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

const siteUrl = "https://crossfitaslak.com";
const siteName = "CrossFit ASLAK";
const description =
  "Entraînement de CrossFit à Carrières-Sur-Seine (Yvelines). Découvrez lors de votre séance d'essai gratuite le CrossFit et l'Hyrox, nous sommes ouverts tous les jours.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CrossFit ASLAK - Box de CrossFit - Train The Fighter In You",
    template: "%s | CrossFit ASLAK",
  },
  description,
  keywords: [
    "CrossFit",
    "HYROX",
    "Carrières-Sur-Seine",
    "Yvelines",
    "salle de sport",
    "box CrossFit",
    "entraînement",
    "fitness",
    "78",
    "séance d'essai gratuite",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName,
    title: "CrossFit ASLAK - Box de CrossFit / HYROX à Carrières-Sur-Seine",
    description,
    images: [
      {
        url: "/og.webp",
        width: 1200,
        height: 630,
        alt: "CrossFit ASLAK - Box de CrossFit / HYROX à Carrières-Sur-Seine (78)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CrossFit ASLAK - Box de CrossFit / HYROX",
    description,
    images: ["/og.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsActivityLocation",
              "@id": siteUrl,
              name: siteName,
              description,
              url: siteUrl,
              image: `${siteUrl}/og.webp`,
              address: {
                "@type": "PostalAddress",
                streetAddress: "13 Rue du Port aux Vins",
                addressLocality: "Carrières-sur-Seine",
                postalCode: "78420",
                addressCountry: "FR",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 48.9138,
                longitude: 2.1789,
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                bestRating: "5",
                ratingCount: "139",
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ],
                  opens: "06:00",
                  closes: "21:00",
                },
              ],
              priceRange: "$$",
              sameAs: [
                "https://www.instagram.com/crossfitaslak",
                "https://www.facebook.com/crossfitaslak",
              ],
            }),
          }}
        />
      </head>
      <body>
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark-red"
            themes={["dark-red", "dark-yellow"]}
            enableSystem={false}
          >
            {children}
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
