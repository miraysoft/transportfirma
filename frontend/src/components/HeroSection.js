import React from "react";
import { Button } from "./ui/button";
import { ArrowRight, Phone, Mail } from "lucide-react";

const HeroSection = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full relative">
          {/* Vimeo Video Background */}
          <iframe
            src="https://player.vimeo.com/video/872507248?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
            className="absolute inset-0 w-full h-full object-cover"
            frameBorder="0"
            allow="autoplay; fullscreen"
            style={{
              width: '100vw',
              height: '100vh',
              transform: 'scale(1.1)', // Slightly larger to avoid borders
              transformOrigin: 'center center'
            }}
          ></iframe>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Ammann & Co Transport
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Ihre zuverlässigen Partner für professionelle Transportlösungen in der Schweiz und Europa
          </p>
          <p className="text-lg text-white/80 mb-8">
            Derzeit in der Aufbauphase - Bald für Sie da!
          </p>
          
          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-white">
              <Phone className="h-5 w-5" />
              <a href="tel:+41792470005" className="hover:text-red-300 transition-colors">
                +41 79 247 00 05
              </a>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Mail className="h-5 w-5" />
              <a href="mailto:info@ammanncotransport.ch" className="hover:text-red-300 transition-colors">
                info@ammanncotransport.ch
              </a>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => scrollToSection("services")}
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
            >
              Unsere Dienstleistungen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              onClick={() => scrollToSection("contact")}
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg"
            >
              Kontakt aufnehmen
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
    </section>
  );
};

export default HeroSection;