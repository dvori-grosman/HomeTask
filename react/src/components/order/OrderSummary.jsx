
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, DollarSign, Car, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";

export default function OrderSummary({ orderData, onConfirm, onBack, isSubmitting }) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* פרטי הלקוח */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
          <h4 className="font-bold text-gray-900 text-lg mb-4">פרטי הלקוח</h4>
          <div className="space-y-2 text-gray-700 font-medium">
            <p>שם: {orderData.customer_name}</p>
            <p>טלפון: {orderData.phone}</p>
            <p>מספר הזמנה: {orderData.order_number}</p>
          </div>
        </div>

        {/* פרטי הרכב */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
          <h4 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
            <Car className="w-5 h-5" />
            פרטי הרכב
          </h4>
          <div className="space-y-2 text-gray-700 font-medium">
            <p>מספר רכב: {orderData.license_plate}</p>
            <p>סוג: {orderData.car_type}</p>
            <p>רמת לכלוך: {orderData.dirt_level}/5</p>
          </div>
        </div>

        {/* שירותים */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
          <h4 className="font-bold text-gray-900 text-lg mb-4">שירותים נבחרים</h4>
          <ul className="space-y-2 text-gray-700 font-medium">
            {orderData.service_type.map(service => (
              <li key={service}>• {service}</li>
            ))}
          </ul>
        </div>

        {/* מועד ומיקום */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
          <h4 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            מועד ומיקום
          </h4>
          <div className="space-y-2 text-gray-700 font-medium">
            <p>תאריך: {format(new Date(orderData.preferred_date), 'dd/MM/yyyy', { locale: he })}</p>
            <p>שעה: {orderData.preferred_time}</p>
            {orderData.location_address && (
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>{orderData.location_address}</span>
              </p>
            )}
            {orderData.location_lat && orderData.location_lng && (
              <p className="text-sm text-gray-600">
                📍 מיקום מדויק נקלט
              </p>
            )}
          </div>
        </div>
      </div>

      {/* תמונת הרכב */}
      {orderData.car_image_url && (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h4 className="font-bold text-gray-900 text-lg mb-4">תמונת הרכב</h4>
          <img
            src={orderData.car_image_url}
            alt="תמונת הרכב"
            className="w-64 h-48 object-cover rounded-lg shadow-md mx-auto"
          />
        </div>
      )}

      {/* חישוב */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-xl p-8 text-white">
        <h4 className="font-bold text-2xl mb-6 text-center">
      סיכום זמן ועלות משוער    
        </h4>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-6 h-6" />
              <h5 className="font-bold text-xl">זמן משוער</h5>
            </div>
            <div className="space-y-2 text-sm">
              <p>זמן בסיס: 30 דקות</p>
              <p>רמת לכלוך ({orderData.dirt_level}): {orderData.dirt_level * 10} דקות</p>
              {orderData.service_type.includes("פוליש") && <p>פוליש: +15 דקות</p>}
              {orderData.service_type.includes("ווקס") && <p>ווקס: +10 דקות</p>}
              <div className="border-t border-white/30 pt-2 mt-4">
                <p className="text-xl font-bold">סה״כ: {orderData.calculated_time} דקות</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-6 h-6" />
              <h5 className="font-bold text-xl">מחיר</h5>
            </div>
            <div className="space-y-2 text-sm">
              <p>מחיר בסיס: 50₪</p>
              <p>רמת לכלוך ({orderData.dirt_level}): {orderData.dirt_level * 20}₪</p>
              <div className="border-t border-white/30 pt-2 mt-4">
                <p className="text-2xl font-bold">סה״כ: {orderData.calculated_price}₪</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* כפתורי פעולה */}
      <div className="flex justify-between gap-4">
        <Button
          type="button"
          onClick={onBack}
          className="bg-gray-400 hover:bg-gray-500 text-white rounded-lg px-8 py-3 font-medium"
          disabled={isSubmitting}
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          חזור לעריכה
        </Button>
        
        <Button
          onClick={onConfirm}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-lg px-8 py-3 font-medium text-lg"
        >
          {isSubmitting ? "שולח הזמנה..." : "אשר הזמנה"}
        </Button>
      </div>
    </div>
  );
}
