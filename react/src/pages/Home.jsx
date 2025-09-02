import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Calendar, Star, Clock, MapPin, Sparkles, Shield, CheckCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const features = [
    {
      icon: MapPin,
      title: "שירות עד הבית",
      description: "אנחנו מגיעים אליך - בבית, בעבודה או בכל מקום נוח לך"
    },
    {
      icon: Clock,
      title: "זמינות גמישה",
      description: "תזמן את השטיפה מתי שנוח לך - 7 ימים בשבוע"
    },
    {
      icon: Sparkles,
      title: "איכות מקצועית",
      description: "ציוד מקצועי וחומרי ניקוי איכותיים לתוצאה מושלמת"
    },
    {
      icon: Shield,
      title: "ביטוח מלא",
      description: "כל השירותים שלנו מבוטחים לשקט הנפש שלך"
    }
  ];

  const services = [
    { 
      name: "שטיפה חיצונית", 
      price: "החל מ-70₪", 
      description: "שטיפה יסודית של החלק החיצוני",
      features: ["שטיפה עם מים בלחץ", "ייבוש עם מגבות מיקרופייבר", "ניקוי חישוקים"]
    },
    { 
      name: "שטיפה מלאה", 
      price: "החל מ-120₪", 
      description: "שטיפה מלאה פנים וחוץ",
      features: ["שטיפה חיצונית", "שטיפת פנים מקיפה", "ניקוי חלונות פנימיים"]
    },
    { 
      name: "פוליש מקצועי", 
      price: "תוספת 50₪", 
      description: "פוליש מקצועי לברק מושלם",
      features: ["הסרת שריטות קלות", "החזרת ברק לצבע", "הגנה מפני UV"]
    },
    { 
      name: "ציפוי ווקס", 
      price: "תוספת 30₪", 
      description: "שכבת הגנה איכותית לצבע הרכב",
      features: ["הגנה לטווח ארוך", "ברק מושלם", "דוחה מים ולכלוך"]
    }
  ];

  const reviews = [
    { 
      name: "יוסי כהן", 
      text: "שירות מעולה! הגיעו בזמן והרכב נראה כמו חדש. מאוד מקצועיים ואדיבים.", 
      rating: 5,
      location: "תל אביב"
    },
    { 
      name: "שרה לוי", 
      text: "נוח ומקצועי. בהחלט נזמין שוב. המחירים הוגנים והאיכות גבוהה.", 
      rating: 5,
      location: "רמת גן"
    },
    { 
      name: "דוד מזרחי", 
      text: "הפוליש שהם עשו פשוט הפך את הרכב. ממליץ בחום על השירות!", 
      rating: 5,
      location: "הרצליה"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            רכב נקי ומבריק<br />
            <span className="text-blue-200">עד הבית שלכם</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
            שטיפת רכבים מקצועית עם ציוד מתקדם וחומרי ניקוי איכותיים
          </p>
          <Link to={createPageUrl("Order")}>
            <Button className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 rounded-lg shadow-lg btn-primary font-semibold">
              <Calendar className="w-6 h-6 ml-3" />
              הזמן שטיפה עכשיו
            </Button>
          </Link>
          
          <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Users className="w-8 h-8 mx-auto mb-3 text-blue-200" />
              <div className="text-2xl font-bold">500+</div>
              <div className="text-blue-200">לקוחות מרוצים</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Clock className="w-8 h-8 mx-auto mb-3 text-blue-200" />
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-blue-200">זמינות</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Shield className="w-8 h-8 mx-auto mb-3 text-blue-200" />
              <div className="text-2xl font-bold">100%</div>
              <div className="text-blue-200">מבוטח</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">למה לבחור בנו?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            אנחנו מתמחים בשטיפת רכבים מקצועית עם דגש על איכות, נוחות ושירות מהיר
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg card-hover text-center"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Services & Pricing */}
      <section className="bg-gray-100 py-20 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">השירותים שלנו</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            מגוון שירותי שטיפה המותאמים לכל צורך ותקציב
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg card-hover overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{service.name}</h3>
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-bold">
                    {service.price}
                  </div>
                </div>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 ml-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">מה הלקוחות אומרים</h2>
          <p className="text-xl text-gray-600">חוות דעת של לקוחות מרוצים</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg card-hover p-8"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">"{review.text}"</p>
              <div>
                <div className="font-bold text-gray-900">{review.name}</div>
                <div className="text-gray-500 text-sm">{review.location}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-bg text-white py-20 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            מוכן לרכב נקי ומבריק?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            תהליך הזמנה פשוט ומהיר - 2 דקות ואתה מסודר!
          </p>
          <Link to={createPageUrl("Order")}>
            <Button className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 rounded-lg shadow-lg btn-primary font-semibold">
              <Calendar className="w-6 h-6 ml-3" />
              בואו נתחיל - הזמן עכשיו
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}