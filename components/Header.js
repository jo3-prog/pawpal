import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { usePets } from "../context/PetContext";

function PawLogo() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="6.5" cy="7.5" r="2.1" />
      <circle cx="12" cy="5.2" r="2.1" />
      <circle cx="17.5" cy="7.5" r="2.1" />
      <path d="M12 10.2c-3.1 0-6.2 2.4-6.2 5.4 0 1.9 1.4 3.1 3.2 3.1.9 0 1.6-.3 2.3-.6.5-.2 1-.4 1.5-.4s1 .2 1.5.4c.7.3 1.4.6 2.3.6 1.8 0 3.2-1.2 3.2-3.1 0-3-3.1-5.4-7-5.4z" />
    </svg>
  );
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/favorites", label: "Favorites", countKey: "favorites" },
  { href: "/applications", label: "My Applications", countKey: "applications" },
];

export default function Header() {
  const router = useRouter();
  const { favorites, applications } = usePets();
  const [menuOpen, setMenuOpen] = useState(false);

  const counts = {
    favorites: favorites.length,
    applications: applications.length,
  };

  return (
    <header className="sticky top-0 z-40 bg-pine text-paper shadow-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight"
          >
            <PawLogo />
            PawPal
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = router.pathname === link.href;
              const count = link.countKey ? counts[link.countKey] : null;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 rounded-md font-medium transition-colors ${
                    isActive
                      ? "bg-paper text-pine"
                      : "text-paper/90 hover:bg-pine-light"
                  }`}
                >
                  {link.label}
                  {count > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full bg-marigold text-ink text-xs font-bold align-middle">
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-pine-light"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="sm:hidden pb-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = router.pathname === link.href;
              const count = link.countKey ? counts[link.countKey] : null;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-3.5 py-2.5 rounded-md font-medium ${
                    isActive ? "bg-paper text-pine" : "text-paper/90"
                  }`}
                >
                  {link.label}
                  {count > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full bg-marigold text-ink text-xs font-bold align-middle">
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
