import React from "react";
import { Truck, Phone, Mail } from "lucide-react";

const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img 
              src="https://ammanncotransport.ch/wp-content/uploads/2025/09/96.png" 
              alt="Ammann & Co Transport Logo" 
              className="h-8 w-auto"
            />
              <span className="text-2xl font-bold">Ammann & Co Transport</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Ihr zuverlässiger Partner für professionelle Transportlösungen in der Schweiz und Europa. 
              Derzeit im Aufbau - bald für Sie da!
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-red-400" />
                <a href="tel:+41792470005" className="text-gray-300 hover:text-white">
                  +41 79 247 00 05
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <a href="mailto:info@ammanncotransport.ch" className="text-gray-300 hover:text-white">
                  info@ammanncotransport.ch
                </a>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Startseite
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("services")}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Dienstleistungen
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Über uns
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Kontakt
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li>LKW-Transport</li>
              <li>Kühlfahrzeuge</li>
              <li>Luftfracht</li>
              <li>Postversand</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2025 Ammann & Co Transport. Alle Rechte vorbehalten.
            </div>
            <div className="text-gray-400 text-sm mt-4 md:mt-0">
              <span className="inline-block bg-orange-600 text-white px-2 py-1 rounded text-xs mr-2">
                IN AUFBAU
              </span>
              Bald für Sie verfügbar
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;