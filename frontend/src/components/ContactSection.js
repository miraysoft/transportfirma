import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    const element = document.getElementById('contact');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(`${API}/contact`, formData);
      
      if (response.data.success) {
        toast.success(response.data.message);
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          service: "",
          message: ""
        });
      }
    } catch (error) {
      console.error("Contact form error:", error);
      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 gradient-professional relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-10 w-96 h-96 bg-red-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-red-100 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className={`text-center mb-20 transition-all duration-1000 ${
          isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <MessageCircle className="h-4 w-4" />
            Jetzt Kontakt aufnehmen
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-gray-900 mb-6 tracking-tight">
            Kontakt <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">aufnehmen</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Haben Sie Fragen oder möchten Sie mehr über unsere <span className="font-semibold text-gray-800">zukünftigen Services</span> erfahren? 
            Wir freuen uns auf Ihre Nachricht!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className={`space-y-8 transition-all duration-1000 ${
            isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-10'
          }`}>
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-professional border border-white/50">
              <h3 className="text-3xl font-bold font-display text-gray-900 mb-8 tracking-tight">
                Kontaktinformationen
              </h3>
              <div className="space-y-6">
                {[
                  {
                    icon: <Phone className="h-7 w-7 text-red-600" />,
                    title: "Telefon",
                    content: "+41 79 247 00 05",
                    href: "tel:+41792470005",
                    gradient: "from-red-50 to-red-100"
                  },
                  {
                    icon: <Mail className="h-7 w-7 text-red-600" />,
                    title: "E-Mail",
                    content: "info@ammanncotransport.ch",
                    href: "mailto:info@ammanncotransport.ch",
                    gradient: "from-blue-50 to-blue-100"
                  },
                  {
                    icon: <MapPin className="h-7 w-7 text-red-600" />,
                    title: "Standort",
                    content: "Schweiz",
                    gradient: "from-green-50 to-green-100"
                  },
                  {
                    icon: <Clock className="h-7 w-7 text-red-600" />,
                    title: "Erreichbarkeit",
                    content: "Mo-Fr: 08:00 - 18:00 Uhr",
                    gradient: "from-purple-50 to-purple-100"
                  }
                ].map((item, index) => (
                  <div key={index} className={`flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r ${item.gradient} hover:shadow-professional transition-all duration-300 group`}>
                    <div className="p-3 bg-white rounded-xl shadow-professional group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-lg mb-1 font-display">{item.title}</p>
                      {item.href ? (
                        <a href={item.href} className="text-red-600 hover:text-red-700 transition-colors duration-200 font-semibold">
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-gray-700 font-medium">{item.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-gradient-to-br from-red-50 via-red-25 to-orange-50 border-red-200 shadow-professional hover-lift">
              <CardHeader>
                <CardTitle className="text-2xl font-bold font-display text-red-900 tracking-tight flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-xl">
                    <MessageCircle className="h-6 w-6 text-red-600" />
                  </div>
                  Frühe Anfragen willkommen!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-800 leading-relaxed">
                  Obwohl wir uns noch im Aufbau befinden, nehmen wir gerne bereits 
                  jetzt Ihre Anfragen entgegen. So können wir Sie über unseren 
                  Betriebsstart informieren und Ihre Transportbedürfnisse von 
                  Anfang an optimal berücksichtigen.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className={`transition-all duration-1000 ${
            isVisible ? 'animate-fade-in' : 'opacity-0 translate-x-10'
          }`}>
            <Card className="bg-white/70 backdrop-blur-xl shadow-professional-lg border border-white/50 hover-lift">
              <CardHeader className="pb-6">
                <CardTitle className="text-3xl font-bold font-display text-gray-900 tracking-tight flex items-center gap-3">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <Send className="h-7 w-7 text-red-600" />
                  </div>
                  Anfrage senden
                </CardTitle>
              </CardHeader>
              <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Ihr vollständiger Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-Mail *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="ihre.email@beispiel.ch"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+41 XX XXX XX XX"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      Unternehmen
                    </label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Ihr Unternehmen"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                    Interessiert an
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Bitte wählen...</option>
                    <option value="lkw">LKW-Transport</option>
                    <option value="kuehl">Kühlfahrzeuge</option>
                    <option value="luft">Luftfracht</option>
                    <option value="post">Postversand</option>
                    <option value="beratung">Allgemeine Beratung</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Nachricht *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Beschreiben Sie Ihre Transportanforderungen oder Fragen..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
                >
                  Anfrage senden
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  * Pflichtfelder. Ihre Daten werden vertraulich behandelt.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;