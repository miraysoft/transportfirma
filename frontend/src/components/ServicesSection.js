import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Truck, Snowflake, Plane, Package, CheckCircle } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: <Truck className="h-14 w-14 text-red-600" />,
      title: "LKW-Transport",
      description: "Professioneller Gütertransport mit modernen LKW-Flotten für nationale und internationale Strecken.",
      features: ["Vollladungen", "Teilladungen", "Sondertransporte", "Termintreue Lieferung"],
      gradient: "from-red-50 to-red-100"
    },
    {
      icon: <Snowflake className="h-14 w-14 text-red-600" />,
      title: "Kühlfahrzeuge",
      description: "Temperaturgeführte Transporte für sensible Güter mit modernster Kühltechnik.",
      features: ["Frischewaren", "Tiefkühlprodukte", "Pharmazeutika", "Temperaturüberwachung"],
      gradient: "from-blue-50 to-cyan-100"
    },
    {
      icon: <Plane className="h-14 w-14 text-red-600" />,
      title: "Luftfracht",
      description: "Schnelle und sichere Luftfracht-Services für eilige und hochwertige Sendungen.",
      features: ["Express-Lieferung", "Internationale Verbindungen", "Sichere Verpackung", "Tracking"],
      gradient: "from-sky-50 to-blue-100"
    },
    {
      icon: <Package className="h-14 w-14 text-red-600" />,
      title: "Postversand",
      description: "Zuverlässige Paket- und Briefzustellung für Privat- und Geschäftskunden.",
      features: ["Briefversand", "Paketdienst", "Express-Optionen", "Nachverfolgung"],
      gradient: "from-green-50 to-emerald-100"
    }
  ];

  return (
    <section id="services" className="py-32 gradient-professional relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-100 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <CheckCircle className="h-4 w-4" />
            Professionelle Transportlösungen
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-gray-900 mb-6 tracking-tight">
            Unsere <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">Dienstleistungen</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Von LKW-Transporten bis hin zu Luftfracht - wir bieten umfassende Transportlösungen 
            für alle Ihre <span className="font-semibold text-gray-800">Bedürfnisse</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {services.map((service, index) => (
            <Card key={index} className={`hover-lift shadow-professional hover:shadow-professional-lg transition-all duration-500 h-full border-0 bg-gradient-to-br ${service.gradient} backdrop-blur-sm animate-fade-in group`} style={{animationDelay: `${index * 0.1}s`}}>
              <CardHeader className="text-center pb-6 relative">
                <div className="flex justify-center mb-6 relative">
                  <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-professional group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold font-display text-gray-900 mb-3 tracking-tight">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-gray-700 text-base leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                      <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full mr-3 flex-shrink-0"></div>
                      <span className="font-medium text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-12 lg:p-16 shadow-professional-lg border border-white/50 animate-scale-in">
            <h3 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-6 tracking-tight">
              Maßgeschneiderte <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">Lösungen</span>
            </h3>
            <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
              Jeder Transport ist einzigartig. Wir entwickeln individuelle Lösungen, 
              die perfekt zu Ihren Anforderungen passen.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "Schweizweit", "EU-Europa", "24/7 Service", "Versicherungsschutz", 
                "GPS Tracking", "Expressdienst", "Lagerung", "Beratung"
              ].map((badge, index) => (
                <span 
                  key={index} 
                  className="bg-white/90 backdrop-blur-sm text-gray-700 px-6 py-3 rounded-2xl font-semibold text-sm shadow-professional hover:shadow-red hover:bg-red-50 transition-all duration-300 cursor-default border border-gray-200/50"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;