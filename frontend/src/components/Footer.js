import React from "react";
import { Phone, Mail, MapPin, Award, Shield } from "lucide-react";

const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-red-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-red-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-4 mb-6 group">
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                <img 
                  src="https://ammanncotransport.ch/wp-content/uploads/2025/09/96.png" 
                  alt="Ammann & Co Transport Logo" 
                  className="h-10 w-auto"
                />
              </div>
              <div>
                <span className="text-3xl font-bold font-display tracking-tight">Ammann & Co Transport</span>
                <div className="text-red-400 text-sm font-medium tracking-wide">Professionelle Logistiklösungen</div>
              </div>
            </div>
            <p className="text-gray-300 mb-8 max-w-lg leading-relaxed text-lg">
              Ihr zuverlässiger Partner für professionelle Transportlösungen in der Schweiz und Europa. 
              <span className="text-red-400 font-semibold"> Derzeit im Aufbau - bald für Sie da!</span>
            </p>
            <div className="space-y-4">
              {[
                {
                  icon: <Phone className="h-5 w-5 text-red-400" />,
                  content: "+41 79 247 00 05",
                  href: "tel:+41792470005"
                },
                {
                  icon: <Mail className="h-5 w-5 text-red-400" />,
                  content: "info@ammanncotransport.ch", 
                  href: "mailto:info@ammanncotransport.ch"
                },
                {
                  icon: <MapPin className="h-5 w-5 text-red-400" />,
                  content: "Schweiz"
                }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-red-500/20 transition-colors duration-200">
                    {item.icon}
                  </div>
                  {item.href ? (
                    <a href={item.href} className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                      {item.content}
                    </a>
                  ) : (
                    <span className="text-gray-300 font-medium">{item.content}</span>
                  )}
                </div>
              ))}
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