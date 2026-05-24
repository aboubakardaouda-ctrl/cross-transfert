import type { Metadata, Viewport } from "next";
import { Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Conférence Annuelle des Traducteurs Chinois | 中文译者年会",
  description:
    "Plateforme RSVP officielle de la Conférence Annuelle des Traducteurs Chinois. Confirmez votre participation et recevez votre invitation officielle.",
  keywords: "traducteurs chinois, conférence annuelle, RSVP, invitation, 中文译者",
  authors: [{ name: "billetdinvitation.site" }],
  openGraph: {
    title: "Conférence Annuelle des Traducteurs Chinois",
    description: "Confirmez votre participation à la rencontre annuelle de la communauté des traducteurs chinois.",
    locale: "fr_FR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#8B1A1A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${cormorant.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="min-h-screen bg-[#FDFCF8] text-[#1A1A1A] antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
