import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { CheckCircle, Users, Award, Clock, TrendingUp, Shield, Globe } from "lucide-react";

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('about');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const values = [
    {
      icon: <CheckCircle className="h-10 w-10 text-green-600" />,
      title: "Zuverlässigkeit",
      description: "Pünktliche und sichere Lieferung ist unser Versprechen"
    },
    {
      icon: <Users className="h-10 w-10 text-red-600" />,
      title: "Professionalität", 
      description: "Erfahrenes Team mit jahrelanger Branchenexpertise"
    },
    {
      icon: <Award className="h-10 w-10 text-yellow-600" />,
      title: "Qualität",
      description: "Höchste Standards in allen Transportbereichen"
    },
    {
      icon: <Clock className="h-10 w-10 text-blue-600" />,
      title: "Flexibilität",
      description: "Individuelle Lösungen für jeden Kundenwunsch"
    }
  ];

  return (
    <section id="about" className="py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute top-32 right-20 w-64 h-64 bg-gradient-to-br from-red-100 to-red-50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-20 w-80 h-80 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Content */}
          <div className={`transition-all duration-1000 ${
            isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'
          }`}>
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <TrendingUp className="h-4 w-4" />
              Wachsende Tradition
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-gray-900 mb-8 tracking-tight leading-tight">
              Über <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">Ammann & Co Transport</span>
            </h2>
            
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p className="text-xl font-light">
                Willkommen bei Ammann & Co Transport - Ihrem <span className="font-semibold text-red-600">zukünftigen Partner</span> für 
                professionelle Transportdienstleistungen in der Schweiz und darüber hinaus.
              </p>
              <p>
                Wir befinden uns derzeit in der spannenden Aufbauphase unseres Unternehmens 
                und arbeiten intensiv daran, Ihnen bald <span className="font-semibold text-gray-900">erstklassige Transportlösungen</span> 
                anbieten zu können.
              </p>
              <p>
                Unser Ziel ist es, durch modernste Fahrzeugflotten, erfahrene Fahrer und 
                innovative Logistiklösungen neue <span className="font-semibold text-gray-900">Standards in der Transportbranche</span> zu setzen.
              </p>
            </div>

            <div className="mt-12">
              <h3 className="text-2xl font-bold font-display text-gray-900 mb-8 tracking-tight">
                Unsere Werte
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <div key={index} className={`flex items-start space-x-4 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 group animate-fade-in`} style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="flex-shrink-0 p-2 bg-white rounded-xl shadow-professional group-hover:shadow-professional-lg transition-all duration-300">
                      {value.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-1 font-display">{value.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats/Info Cards */}
          <div className={`space-y-8 transition-all duration-1000 ${
            isVisible ? 'animate-fade-in' : 'opacity-0 translate-x-10'
          }`}>
            <Card className="bg-gradient-to-br from-red-50 via-red-25 to-white border-red-100 hover-lift shadow-professional hover:shadow-red transition-all duration-500">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-gray-900 tracking-tight">
                    Aktueller Status
                  </h3>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Planungsphase", status: "Abgeschlossen", color: "green" },
                    { label: "Fahrzeugbeschaffung", status: "In Arbeit", color: "blue" },
                    { label: "Personalrekrutierung", status: "Laufend", color: "blue" },
                    { label: "Betriebsstart", status: "Q2 2025", color: "orange" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <span className="text-gray-700 font-medium">{item.label}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.color === 'green' ? 'bg-green-100 text-green-700' :
                        item.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-50 via-gray-25 to-white border-gray-200 hover-lift shadow-professional hover:shadow-professional-lg transition-all duration-500">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gray-100 rounded-xl">
                    <Globe className="h-6 w-6 text-gray-600" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-gray-900 tracking-tight">
                    Geplante Kapazitäten
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { number: "15+", label: "LKW Flotte", color: "red" },
                    { number: "8+", label: "Kühlfahrzeuge", color: "blue" },
                    { number: "24/7", label: "Service", color: "green" },
                    { number: "EU", label: "Abdeckung", color: "purple" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-gray-200/50">
                      <div className={`text-3xl font-bold font-display mb-1 ${
                        stat.color === 'red' ? 'text-red-600' :
                        stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'green' ? 'text-green-600' :
                        'text-purple-600'
                      }`}>
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 via-blue-25 to-white border-blue-100 hover-lift shadow-professional hover:shadow-professional-lg transition-all duration-500">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-gray-900 tracking-tight">
                    Qualitätsversprechen
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Modernste Sicherheitsstandards, vollumfänglicher Versicherungsschutz und 
                  transparente Kommunikation bei jedem Transport.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;