import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Ticker from "@/components/Ticker";
import leagueConfig from "@/data/league.json";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: `${leagueConfig.leagueName} | League Hub`,
  description: `Standings, scoring, transactions, and news for ${leagueConfig.leagueName}.`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-body bg-paper text-ink antialiased flex min-h-screen flex-col">
        <Ticker />
        <Nav />
        <main className="flex-1 w-full max-w-6xl mx-auto px-5 sm:px-8 py-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
