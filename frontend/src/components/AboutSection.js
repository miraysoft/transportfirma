import React from "react";
import { Card, CardContent } from "./ui/card";
import { CheckCircle, Users, Award, Clock } from "lucide-react";

const AboutSection = () => {
  const values = [
    {
      icon: <CheckCircle className="h-8 w-8 text-green-600" />,
      title: "Zuverlässigkeit",
      description: "Pünktliche und sichere Lieferung ist unser Versprechen"
    },
    {
      icon: <Users className="h-8 w-8 text-red-600" />,
      title: "Professionalität",
      description: "Erfahrenes Team mit jahrelanger Branchenexpertise"
    },
    {
      icon: <Award className="h-8 w-8 text-purple-600" />,
      title: "Qualität",
      description: "Höchste Standards in allen Transportbereichen"
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-600" />,
      title: "Flexibilität",
      description: "Individuelle Lösungen für jeden Kundenwunsch"
    }
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Über Ammann & Co Transport
            </h2>
            <div className="space-y-4 text-lg text-gray-700">
              <p>
                Willkommen bei Ammann & Co Transport - Ihrem zukünftigen Partner für 
                professionelle Transportdienstleistungen in der Schweiz und darüber hinaus.
              </p>
              <p>
                Wir befinden uns derzeit in der spannenden Aufbauphase unseres Unternehmens 
                und arbeiten intensiv daran, Ihnen bald erstklassige Transportlösungen 
                anbieten zu können.
              </p>
              <p>
                Unser Ziel ist es, durch modernste Fahrzeugflotten, erfahrene Fahrer und 
                innovative Logistiklösungen neue Standards in der Transportbranche zu setzen.
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Unsere Werte
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {values.map((value, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {value.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{value.title}</h4>
                      <p className="text-sm text-gray-600">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats/Info Cards */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Aktueller Status
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Planungsphase</span>
                    <span className="text-green-600 font-semibold">✓ Abgeschlossen</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Fahrzeugbeschaffung</span>
                    <span className="text-blue-600 font-semibold">In Arbeit</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Personalrekrutierung</span>
                    <span className="text-blue-600 font-semibold">Laufend</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Betriebsstart</span>
                    <span className="text-orange-600 font-semibold">Q2 2025</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Geplante Kapazitäten
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">15+</div>
                    <div className="text-sm text-gray-600">LKW Flotte</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">8+</div>
                    <div className="text-sm text-gray-600">Kühlfahrzeuge</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">24/7</div>
                    <div className="text-sm text-gray-600">Service</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">EU</div>
                    <div className="text-sm text-gray-600">Abdeckung</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;