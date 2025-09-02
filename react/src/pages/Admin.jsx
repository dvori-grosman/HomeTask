import React, { useState, useEffect } from "react";
import { BarChart, Car, Calendar, ShieldX, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import axios from 'axios'; // הוסף את השורה הזו אם היא חסרה

import AdminStats from "../components/admin/AdminStats";
import OrdersList from "../components/admin/OrdersList";
import RevenueChart from "../components/admin/RevenueChart";

export default function Admin() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]); // ודא שזה מוגדר כך
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("stats");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");

  useEffect(() => {
    // בדיקה פיקטיבית אם המשתמש "מחובר"
    const loggedIn = localStorage.getItem('admin-logged-in') === 'true';
    const username = localStorage.getItem('admin-username') || '';

    if (loggedIn) {
      setIsLoggedIn(true);
      setAdminUsername(username);
      loadOrders();
    } else {
      // אם לא מחובר, הפנה לעמוד התחברות
      navigate(createPageUrl("AdminLogin"));
    }
  }, [navigate]);

  const loadOrders = async () => {
    setIsLoading(true); // התחלת טעינה
    try {
      const token = localStorage.getItem('admin-token'); // קבלת הטוקן מה-localStorage
      const response = await axios.get('http://localhost:4000/api/orders', {
        headers: {
          Authorization: `Bearer ${token}` // הוסף את הטוקן לכותרת
        }
      });

      
      console.log("Token:", token);
      console.log("Fetched orders:", response.data); // בדיקת נתונים
      setOrders(response.data); // עדכון הזמנות
      if (!Array.isArray(orders)) {
        console.error('Expected orders to be an array but got:', orders);
        return; // או טיפול בשגיאה אחר
      }
    } catch (error) {
      console.error("שגיאה בטעינת הזמנות:", error);
    }
    setIsLoading(false); // סיום טעינה
  };

  const handleLogout = () => {
    // ניקוי מצב "מחובר" (פיקטיבי)
    localStorage.removeItem('admin-logged-in');
    localStorage.removeItem('admin-username');

    // הפנייה לעמוד התחברות
    navigate(createPageUrl("AdminLogin"));
  };

  const calculateStats = () => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.priceNis || 0), 0);
    const totalTime = orders.reduce((sum, order) => sum + (order.timeEstimateMin || 0), 0);
    const totalDistance = orders.reduce((sum, order) => sum + (order.distanceKm || 10), 0);

    return { totalOrders, totalRevenue, totalTime, totalDistance };
  };

  const stats = calculateStats();

  const renderTabButton = (tab, title, icon) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex-1 py-4 px-6 rounded-lg font-medium transition-all ${activeTab === tab
        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
        : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-2 border-gray-200'
        }`}
    >
      <div className="flex items-center justify-center gap-2">
        {icon}
        <span>{title}</span>
      </div>
    </button>
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900">טוען נתונים...</h2>
          <p className="text-gray-600 mt-2">אנא המתן בזמן שאנחנו טוענים את המידע</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    // זה לא אמור לקרות בגלל ה-useEffect, אבל לבטיחות
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* כותרת עם מידע משתמש ויציאה */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">פאנל ניהול</h1>
          <p className="text-xl text-gray-600">מעקב אחר כל ההזמנות והנתונים העסקיים</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">מחובר כ:</p>
              <p className="font-bold text-gray-900">{adminUsername}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-2 border-red-200 hover:border-red-300 hover:bg-red-50 text-red-700 hover:text-red-800"
            >
              <LogOut className="w-4 h-4 ml-2" />
              יציאה
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-50 rounded-xl p-4 mb-8">
        <div className="flex gap-2">
          {renderTabButton("stats", "סטטיסטיקות", <BarChart className="w-5 h-5" />)}
          {renderTabButton("orders", "הזמנות", <Car className="w-5 h-5" />)}
          {renderTabButton("charts", "גרפים", <Calendar className="w-5 h-5" />)}
        </div>
      </div>

      {activeTab === "stats" && (
        <AdminStats
          stats={stats}
          orders={orders}
        />
      )}

      {activeTab === "orders" && (
        <OrdersList
          orders={orders}
          onOrderUpdate={loadOrders}
        />
      )}

      {activeTab === "charts" && (
        <RevenueChart
          orders={orders}
        />
      )}
    </div>
  );
}