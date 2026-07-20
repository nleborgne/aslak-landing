"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Logo, TypeSwitcher } from "@/components/home-content";
import { TrialDialog } from "@/components/trial-dialog";
import { Menu, X } from "lucide-react";

function LogoFallback() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-7 w-7 rounded-lg bg-primary" />
      <span className="font-black tracking-tight">CROSSFIT ASLAK</span>
    </div>
  );
}

function TypeSwitcherFallback() {
  return (
    <div className="flex items-center gap-1 rounded-full bg-white/10 p-1 ring-1 ring-white/10">
      <div className="rounded-full px-3 py-1 text-xs font-medium text-white/70">
        CrossFit
      </div>
      <div className="rounded-full px-3 py-1 text-xs font-medium text-white/70">
        Hyrox
      </div>
    </div>
  );
}

const NAV_LINKS = [
  { label: "Planning", sectionId: "planning" },
  { label: "Prix", sectionId: "pricing" },
  { label: "L\u2019\u00C9quipe", sectionId: "coachs" },
  { label: "Avis", sectionId: "reviews" },
  { label: "Partenaires", sectionId: "partners" },
] as const;

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuContentRef = useRef<HTMLDivElement>(null);
  const [menuHeight, setMenuHeight] = useState(0);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    closeMenu();
  };

  // Measure menu content height for smooth animation
  useEffect(() => {
    if (menuContentRef.current) {
      setMenuHeight(menuContentRef.current.scrollHeight);
    }
  }, [isMenuOpen]);

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        closeMenu();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen, closeMenu]);

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-black/40 bg-black/60 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          {/* Logo */}
          <Suspense fallback={<LogoFallback />}>
            <Logo />
          </Suspense>

          {/* Desktop nav */}
          <nav className="ml-auto hidden md:flex items-center gap-6 text-sm text-white/80">
            {NAV_LINKS.map((link) => (
              <a
                key={link.sectionId}
                href={`#${link.sectionId}`}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop controls */}
          <div className="hidden md:flex items-center gap-3">
            <Suspense fallback={<TypeSwitcherFallback />}>
              <TypeSwitcher />
            </Suspense>
            <TrialDialog>
              <Button>{"Réserver une séance d\u2019essai"}</Button>
            </TrialDialog>
          </div>

          {/* Mobile menu button */}
          <div className="ml-auto flex items-center gap-3 md:hidden">
            <Suspense fallback={<TypeSwitcherFallback />}>
              <TypeSwitcher />
            </Suspense>
            <button
              onClick={toggleMenu}
              className="relative w-10 h-10 flex items-center justify-center text-white/80 hover:text-white transition-colors rounded-md"
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isMenuOpen}
            >
              <span
                className={`absolute transition-all duration-300 ease-in-out ${isMenuOpen
                    ? "rotate-0 opacity-100 scale-100"
                    : "rotate-90 opacity-0 scale-75"
                  }`}
              >
                <X className="w-6 h-6" />
              </span>
              <span
                className={`absolute transition-all duration-300 ease-in-out ${isMenuOpen
                    ? "-rotate-90 opacity-0 scale-75"
                    : "rotate-0 opacity-100 scale-100"
                  }`}
              >
                <Menu className="w-6 h-6" />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu - animated slide-down */}
        <div
          className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: isMenuOpen ? `${menuHeight}px` : "0px",
            opacity: isMenuOpen ? 1 : 0,
          }}
        >
          <div
            ref={menuContentRef}
            className="border-t border-white/10 bg-black/80 backdrop-blur"
            style={{
              paddingBottom:
                "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
            }}
          >
            <nav className="px-4 pt-2 space-y-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.sectionId}
                  onClick={() => scrollToSection(link.sectionId)}
                  className="block w-full text-left px-4 py-3 min-h-[44px] text-base text-white/80 hover:text-white hover:bg-white/10 active:scale-[0.98] rounded-md transition-all duration-150 font-medium"
                >
                  {link.label}
                </button>
              ))}
            </nav>
            <div className="px-4 pt-3">
              <TrialDialog>
                <Button onClick={closeMenu} className="w-full">
                  <span className="sm:hidden">{"Réserver"}</span>
                  <span className="hidden sm:inline">{"Réserver une séance d\u2019essai"}</span>
                </Button>
              </TrialDialog>
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop overlay - closes menu on tap */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
          }`}
        onClick={closeMenu}
        aria-hidden="true"
      />
    </>
  );
}
