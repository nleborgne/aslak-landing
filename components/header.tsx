"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    closeMenu();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => scrollToSection("hero")}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <img
                src="/aslak-logo.png"
                alt="CrossFit Aslak Logo"
                className="w-16 h-16"
              />
            </button>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("hero")}
              className="text-gray-300 hover:text-[#ec3642] transition-colors font-medium"
            >
              Accueil
            </button>
            <button
              onClick={() => scrollToSection("crossfit")}
              className="text-gray-300 hover:text-[#ec3642] transition-colors font-medium"
            >
              CrossFit
            </button>
            <button
              onClick={() => scrollToSection("coaches")}
              className="text-gray-300 hover:text-[#ec3642] transition-colors font-medium"
            >
              Coachs
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-gray-300 hover:text-[#ec3642] transition-colors font-medium"
            >
              Contact
            </button>
          </nav>

          {/* CTA Button Desktop */}
          <div className="hidden md:block">
            <Button
              onClick={() => scrollToSection("contact")}
              size="sm"
              className="bg-[#ec3642] hover:bg-[#d12b36] text-white font-bold"
            >
              Réserver
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-[#ec3642] transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800 border-t border-gray-700">
              <button
                onClick={() => scrollToSection("hero")}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-[#ec3642] hover:bg-gray-700 rounded-md transition-colors font-medium"
              >
                Accueil
              </button>
              <button
                onClick={() => scrollToSection("crossfit")}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-[#ec3642] hover:bg-gray-700 rounded-md transition-colors font-medium"
              >
                CrossFit
              </button>
              <button
                onClick={() => scrollToSection("coaches")}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-[#ec3642] hover:bg-gray-700 rounded-md transition-colors font-medium"
              >
                Coachs
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-[#ec3642] hover:bg-gray-700 rounded-md transition-colors font-medium"
              >
                Contact
              </button>
              <div className="px-3 py-2">
                <Button
                  onClick={() => scrollToSection("contact")}
                  size="sm"
                  className="w-full bg-[#ec3642] hover:bg-[#d12b36] text-black font-bold"
                >
                  Réserver
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
