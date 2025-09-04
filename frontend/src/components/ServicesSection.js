import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Truck, Snowflake, Plane, Package } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: <Truck className="h-12 w-12 text-red-600" />,
      title: "LKW-Transport",
      description: "Professioneller Gütertransport mit modernen LKW-Flotten für nationale und internationale Strecken.",
      features: ["Vollladungen", "Teilladungen", "Sondertransporte", "Termintreue Lieferung"]
    },
    {
      icon: <Snowflake className="h-12 w-12 text-red-600" />,
      title: "Kühlfahrzeuge",
      description: "Temperaturgeführte Transporte für sensible Güter mit modernster Kühltechnik.",
      features: ["Frischewaren", "Tiefkühlprodukte", "Pharmazeutika", "Temperaturüberwachung"]
    },
    {
      icon: <Plane className="h-12 w-12 text-red-600" />,
      title: "Luftfracht",
      description: "Schnelle und sichere Luftfracht-Services für eilige und hochwertige Sendungen.",
      features: ["Express-Lieferung", "Internationale Verbindungen", "Sichere Verpackung", "Tracking"]
    },
    {
      icon: <Package className="h-12 w-12 text-red-600" />,
      title: "Postversand",
      description: "Zuverlässige Paket- und Briefzustellung für Privat- und Geschäftskunden.",
      features: ["Briefversand", "Paketdienst", "Express-Optionen", "Nachverfolgung"]
    }
  ];

  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Unsere Dienstleistungen
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Von LKW-Transporten bis hin zu Luftfracht - wir bieten umfassende Transportlösungen für alle Ihre Bedürfnisse.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 h-full">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  {service.icon}
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-blue-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Maßgeschneiderte Lösungen
            </h3>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              Jeder Transport ist einzigartig. Wir entwickeln individuelle Lösungen, die perfekt zu Ihren Anforderungen passen.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <span className="bg-white px-4 py-2 rounded-full">Schweizweit</span>
              <span className="bg-white px-4 py-2 rounded-full">EU-Europa</span>
              <span className="bg-white px-4 py-2 rounded-full">24/7 Service</span>
              <span className="bg-white px-4 py-2 rounded-full">Versicherungsschutz</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;