import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-professional' 
        : 'bg-white/80 backdrop-blur-md border-b border-white/20'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-4 group">
            <div className="relative overflow-hidden rounded-xl p-2">
              <img 
                src="https://ammanncotransport.ch/wp-content/uploads/2025/09/96.png" 
                alt="Ammann & Co Transport Logo" 
                className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="">
              <span className="text-2xl font-bold font-display text-gray-900 tracking-tight">
                Ammann & Co Transport
              </span>
              <div className="text-xs text-red-600 font-medium tracking-wide uppercase">
                Professionelle Logistik
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {[
              { id: 'home', label: 'Startseite' },
              { id: 'services', label: 'Dienstleistungen' },
              { id: 'about', label: 'Über uns' },
              { id: 'contact', label: 'Kontakt' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="relative px-6 py-3 text-gray-700 hover:text-red-600 transition-all duration-300 font-medium tracking-wide text-sm group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </button>
            ))}
            <div className="ml-4">
              <Button
                onClick={() => scrollToSection("contact")}
                className="btn-professional bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-xl font-semibold tracking-wide text-sm shadow-red hover:shadow-professional-lg transition-all duration-300"
              >
                Anfrage stellen
              </Button>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 hover:bg-red-50 rounded-xl transition-colors duration-200"
            >
              {isMenuOpen ? 
                <X className="h-6 w-6 text-gray-700" /> : 
                <Menu className="h-6 w-6 text-gray-700" />
              }
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-1 bg-white/95 backdrop-blur-xl rounded-2xl mt-4 mb-4 shadow-professional">
            {[
              { id: 'home', label: 'Startseite' },
              { id: 'services', label: 'Dienstleistungen' },
              { id: 'about', label: 'Über uns' },
              { id: 'contact', label: 'Kontakt' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full px-6 py-4 text-left text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 font-medium"
              >
                {item.label}
              </button>
            ))}
            <div className="px-6 py-4">
              <Button
                onClick={() => scrollToSection("contact")}
                className="w-full btn-professional bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-xl font-semibold tracking-wide shadow-red"
              >
                Anfrage stellen
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;