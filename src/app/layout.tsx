import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/landing/theme-provider";
import Analytics from "@/components/landing/analytics";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://plenro.pages.dev"),
  title: "PLENRO Misamis Oriental — Provincial Local Environment and Natural Resources Office",
  description:
    "Official landing page of the Provincial Local Environment and Natural Resources Office (PLENRO) of Misamis Oriental. Access regulatory frameworks, quarry permits, environmental compliance guidelines, and public resources for responsible mineral resource management.",
  keywords: [
    "PLENRO",
    "Misamis Oriental",
    "environment",
    "natural resources",
    "quarry permits",
    "mining regulation",
    "PMRB",
    "Provincial Mining Regulatory Board",
    "Cagayan de Oro",
    "Philippines",
  ],
  authors: [{ name: "PLENRO Misamis Oriental" }],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/images/plenro.png", type: "image/png" }
    ],
    apple: [
      { url: "/images/plenro.png", type: "image/png" }
    ]
  },
  openGraph: {
    title: "PLENRO Misamis Oriental",
    description:
      "Championing environmental stewardship and responsible resource regulation for a sustainable Misamis Oriental.",
    type: "website",
    locale: "en_PH",
    url: "https://plenro.pages.dev",
    images: [
      {
        url: "/images/hero-landscape.webp",
        width: 1376,
        height: 768,
        alt: "PLENRO Misamis Oriental Provincial Office",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PLENRO Misamis Oriental",
    description:
      "Championing environmental stewardship and responsible resource regulation for a sustainable Misamis Oriental.",
    images: ["/images/hero-landscape.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${outfit.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Inline script to prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('plenro-theme');
                  if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        {/* JSON-LD Structured Data for GovernmentOffice */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "GovernmentOffice",
              "name": "PLENRO Misamis Oriental",
              "alternateName": "Provincial Local Environment and Natural Resources Office",
              "description": "Official Provincial Local Environment and Natural Resources Office of Misamis Oriental. Access regulatory frameworks, quarry permits, and environmental compliance guidelines.",
              "url": "https://plenro.pages.dev",
              "logo": "https://plenro.pages.dev/images/logo.png",
              "image": "https://plenro.pages.dev/images/hero-landscape.webp",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Ground Floor MISORTEL Building, A. Luna St.",
                "addressLocality": "Cagayan de Oro City",
                "addressRegion": "Misamis Oriental",
                "postalCode": "9000",
                "addressCountry": "PH"
              },
              "telephone": "09627484966",
              "email": "enro@misamisoriental.gov.ph",
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday"
                ],
                "opens": "08:00",
                "closes": "17:00"
              }
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-xl focus:bg-emerald-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
        >
          Skip to main content
        </a>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
