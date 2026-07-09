import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { AppProviders } from "@/components/AppProviders";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GariHub KE — Kenya's Premium Vehicle Marketplace",
  description:
    "Discover, compare and own Kenya's finest vehicles. Curated inventory from verified dealers, AI concierge, M-Pesa finance, and a checkout so smooth you'll keep browsing for hours.",
  keywords: [
    "cars Kenya", "buy cars Nairobi", "GariHub", "vehicle marketplace Kenya",
    "Toyota Kenya", "Land Cruiser", "Range Rover Kenya", "car finance Kenya",
  ],
  authors: [{ name: "GariHub KE" }],
  openGraph: {
    title: "GariHub KE — Kenya's Premium Vehicle Marketplace",
    description: "Curated inventory, verified dealers, AI concierge. The finest way to buy a car in Kenya.",
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
        className={`${inter.variable} ${jakarta.variable} antialiased bg-background text-foreground font-sans`}
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
