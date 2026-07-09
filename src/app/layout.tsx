import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { AppProviders } from "@/components/AppProviders";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Fraunces — a modern editorial serif with optical sizing
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GariHub KE — Kenya's Premium Vehicle Marketplace",
  description:
    "A curated marketplace for Kenya's finest vehicles. Verified dealers, refined search, M-Pesa finance. Spend hours here.",
  keywords: [
    "cars Kenya", "buy cars Nairobi", "GariHub", "vehicle marketplace Kenya",
    "Toyota Kenya", "Land Cruiser", "Range Rover Kenya", "car finance Kenya",
  ],
  authors: [{ name: "GariHub KE" }],
  openGraph: {
    title: "GariHub KE — Kenya's Premium Vehicle Marketplace",
    description: "A curated marketplace for Kenya's finest vehicles.",
    siteName: "GariHub KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GariHub KE",
    description: "Kenya's premium vehicle marketplace.",
  },
};

// Inline script to set theme before hydration — prevents flash
const themeScript = `
(function(){
  try {
    var s = localStorage.getItem('garihub-ke');
    var theme = 'light';
    if (s) { var p = JSON.parse(s); theme = (p.state && p.state.theme) || 'light'; }
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${inter.variable} ${fraunces.variable} antialiased bg-background text-foreground font-sans`}
      >
        <AppProviders>
          {children}
        </AppProviders>
        <Toaster />
        <SonnerToaster position="top-center" richColors />
      </body>
    </html>
  );
}
