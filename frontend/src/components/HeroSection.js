import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ArrowRight, Phone, Mail, Star, Award, Clock } from "lucide-react";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
              transform: 'scale(1.1)',
              transformOrigin: 'center center'
            }}
          ></iframe>
          {/* Professional gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <div className={`glass rounded-3xl p-12 lg:p-16 border border-white/20 shadow-professional-lg transition-all duration-1000 ${
          isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-10'
        }`}>
          {/* Trust badges */}
          <div className="flex justify-center items-center gap-6 mb-8 opacity-80">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="text-white text-sm font-medium">Swiss Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-400" />
              <span className="text-white text-sm font-medium">ISO Zertifiziert</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-400" />
              <span className="text-white text-sm font-medium">24/7 Service</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-display text-white mb-8 tracking-tight leading-tight">
            <span className="block">Ammann & Co</span>
            <span className="block bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Transport
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl text-white/95 mb-6 max-w-4xl mx-auto font-light leading-relaxed">
            Ihre <span className="font-semibold text-red-300">zuverlässigen Partner</span> für professionelle Transportlösungen in der Schweiz und Europa
          </p>
          
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm border border-red-400/30 rounded-2xl px-6 py-4 mb-12">
            <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse"></div>
            <p className="text-lg text-white/90 font-medium">
              Derzeit in der Aufbauphase - <span className="text-red-300 font-semibold">Bald für Sie da!</span>
            </p>
          </div>
          
          {/* Contact Info */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-12">
            <div className="flex items-center gap-3 text-white group hover:text-red-300 transition-colors duration-300">
              <div className="p-3 bg-white/10 rounded-xl group-hover:bg-red-500/20 transition-colors duration-300">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm text-white/70 font-medium">Telefon</div>
                <a href="tel:+41792470005" className="text-xl font-semibold tracking-wide">
                  +41 79 247 00 05
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white group hover:text-red-300 transition-colors duration-300">
              <div className="p-3 bg-white/10 rounded-xl group-hover:bg-red-500/20 transition-colors duration-300">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm text-white/70 font-medium">E-Mail</div>
                <a href="mailto:info@ammanncotransport.ch" className="text-xl font-semibold">
                  info@ammanncotransport.ch
                </a>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col lg:flex-row gap-6 justify-center">
            <Button
              onClick={() => scrollToSection("services")}
              size="lg"
              className="btn-professional bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-10 py-4 text-lg font-semibold rounded-2xl shadow-red hover:shadow-professional-lg transition-all duration-300 hover-lift"
            >
              Unsere Dienstleistungen
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            <Button
              onClick={() => scrollToSection("contact")}
              size="lg"
              variant="outline"
              className="border-2 border-white/50 text-white hover:bg-white hover:text-gray-900 px-10 py-4 text-lg font-semibold rounded-2xl backdrop-blur-sm hover:border-white transition-all duration-300 hover-lift"
            >
              Kontakt aufnehmen
            </Button>
          </div>
        </div>
      </div>

      {/* Professional bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/50 to-transparent z-20"></div>
      
      {/* Floating elements for visual interest */}
      <div className="absolute top-1/4 left-8 w-2 h-2 bg-red-400/30 rounded-full animate-pulse"></div>
      <div className="absolute top-1/3 right-12 w-3 h-3 bg-red-500/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-1/4 left-16 w-1.5 h-1.5 bg-red-300/40 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
    </section>
  );
};

export default HeroSection;