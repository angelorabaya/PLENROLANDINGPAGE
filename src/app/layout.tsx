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
  openGraph: {
    title: "PLENRO Misamis Oriental",
    description:
      "Championing environmental stewardship and responsible resource regulation for a sustainable Misamis Oriental.",
    type: "website",
    locale: "en_PH",
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
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
