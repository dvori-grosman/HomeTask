
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Calendar, Settings, Car, Search } from "lucide-react";

const navigationItems = [
  {
    title: "בית",
    url: createPageUrl("Home"),
    icon: Home,
  },
  {
    title: "הזמנה חדשה",
    url: createPageUrl("Order"),
    icon: Calendar,
  },
  {
    title: "מעקב הזמנה",
    url: createPageUrl("Tracking"),
    icon: Search,
  },
  {
    title: "פאנל מנהל",
    url: createPageUrl("AdminLogin"),
    icon: Settings,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <style>{`
        .gradient-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .card-hover {
          transition: all 0.3s ease;
        }
        
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
          transform: translateY(-2px);
        }
      `}</style>

      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg shadow-md">
                <Car className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">שטיפת רכבים פרימיום</h1>
                <p className="text-gray-600">שירות שטיפה מקצועי עד הבית</p>
              </div>
            </div>
            
            <nav className="hidden md:block">
              <div className="flex gap-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.url}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                      location.pathname === item.url
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="w-5 h-5" />
                      {item.title}
                    </div>
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white border-t border-gray-200 sticky top-0 z-10">
        <div className="grid grid-cols-4">
          {navigationItems.map((item, index) => (
            <Link
              key={item.title}
              to={item.url}
              className={`px-2 py-4 text-center transition-colors ${
                location.pathname === item.url 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">שטיפת רכבים פרימיום</h3>
              </div>
              <p className="text-gray-400">שירות מקצועי באיכות גבוהה עד הבית שלכם</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">השירותים שלנו</h4>
              <ul className="space-y-2 text-gray-400">
                <li>שטיפה חיצונית</li>
                <li>שטיפת פנים</li>
                <li>פוליש מקצועי</li>
                <li>ציפוי ווקס</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">יצירת קשר</h4>
              <div className="space-y-2 text-gray-400">
                <p>זמינים 24/7</p>
                <p>שירות מהיר ואמין</p>
                <p>ביטוח מלא</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 שטיפת רכבים פרימיום. כל הזכויות שמורות.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
