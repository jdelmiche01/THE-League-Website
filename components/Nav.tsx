"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import leagueConfig from "@/data/league.json";

const links = [
  { href: "/", label: "Home" },
  { href: "/standings", label: "Standings" },
  { href: "/scoring", label: "Scoring" },
  { href: "/playoff-picture", label: "Playoff Picture" },
  { href: "/transactions", label: "Transactions" },
  { href: "/trade-block", label: "Trade Block" },
  { href: "/news", label: "News" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-line">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
        <Link
          href="/"
          className="font-display font-bold text-lg tracking-tightest"
        >
          {leagueConfig.leagueName}
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "text-ink" : "text-mute hover:text-ink"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute left-3 right-3 -bottom-[1px] h-[2px] bg-accent rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
        {/* Mobile: simple horizontal scroll nav */}
        <nav className="md:hidden flex gap-4 overflow-x-auto text-sm font-medium text-mute">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap py-2"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
