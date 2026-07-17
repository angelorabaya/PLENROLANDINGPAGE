import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/landing/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
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
        url: "/images/hero-landscape.jpg",
        width: 1200,
        height: 630,
        alt: "PLENRO Misamis Oriental Provincial Office",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased`}
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
              "image": "https://plenro.pages.dev/images/hero-landscape.jpg",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Ground Floor MISORTEL Building, A. Luna St.",
                "addressLocality": "Cagayan de Oro City",
                "addressRegion": "Misamis Oriental",
                "postalCode": "9000",
                "addressCountry": "PH"
              },
              "telephone": "09627484966",
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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
