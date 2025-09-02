
import React, { useState } from "react";
// import { CarWashOrder } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import OrderForm from "../components/order/OrderForm";
import OrderSummary from "../components/order/OrderSummary";
import InvoiceGenerator from "../components/order/InvoiceGenerator";



export default function Order() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const calculateTime = (dirtLevel, services) => {
    let time = 30; // 30 דקות בסיס
    time += dirtLevel * 10; // 10 דקות כפול רמת לכלוך

    if (services.includes("פוליש")) time += 15;
    if (services.includes("ווקס")) time += 10;

    return time;
  };

   const copyQrCodeUrl = async () => {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${order.orderNumber}`; 
      try {
        await navigator.clipboard.writeText(qrUrl);
        console.log('QR Code URL copied to clipboard:', qrUrl);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    };

  const calculatePrice = (dirtLevel, distanceKm = 10) => {
    let price = 50; // 50 ₪ בסיס
    price += dirtLevel * 20; // 20 ₪ כפול רמת לכלוך
    price += distanceKm * 2; // 2 ₪ כפול ק״מ

    return price;
  };

  const handleFormSubmit = async (formData) => {
    const calculatedTime = calculateTime(formData.dirt_level, formData.service_type);
    const calculatedPrice = calculatePrice(formData.dirt_level, formData.distance_km || 10);

    const orderWithCalculations = {
      ...formData,
      calculated_time: calculatedTime,
      calculated_price: calculatedPrice,
      order_number: `CW${Date.now()}`,
      status: "ממתין לאישור" // סטטוס התחלתי
    };

    setOrderData(orderWithCalculations);
    setCurrentStep(2);
  };

  const handleOrderConfirm = async () => {
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // הוספת כל הנתונים לFormData - מיפוי מהמבנה החדש
      formDataToSend.append('customerName', orderData.customer_name);
      formDataToSend.append('phone', orderData.phone);
      formDataToSend.append('carNumber', orderData.license_plate);
      formDataToSend.append('carType', orderData.car_type);
      formDataToSend.append('serviceType', orderData.service_type.join(','));
      formDataToSend.append('requestedAt', `${orderData.preferred_date}T${orderData.preferred_time}`);
      formDataToSend.append('address', orderData.location_address);
      formDataToSend.append('lat', orderData.location_lat);
      formDataToSend.append('lng', orderData.location_lng);
      formDataToSend.append('dirtLevel', orderData.dirt_level);
      formDataToSend.append('distanceKm', orderData.distance_km || 0);
      formDataToSend.append('calculatedTime', orderData.calculated_time);
      formDataToSend.append('calculatedPrice', orderData.calculated_price);

      if (orderData.car_image) {
        formDataToSend.append('carImage', orderData.car_image_url); // הוספת קובץ התמונה ל-FormData
      }

      // שליחת הבקשה לשרת - שנה את הפורט לפי השרת שלך
      const response = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        let errorMessage = 'שגיאה ביצירת הזמנה';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // אם לא יכול לקרוא JSON, השתמש בהודעה כללית
          errorMessage = `שגיאה ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const order = await response.json();
      console.log("Order created:", order);



      setCompletedOrder(order);
      setCurrentStep(3);

    } catch (error) {
      console.error("שגיאה ביצירת הזמנה:", error);
      alert(`אירעה שגיאה: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };




  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-12 h-12 rounded-full font-bold text-lg flex items-center justify-center transition-all ${currentStep >= step
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-500'
                  }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 rounded-full mx-4 transition-all ${currentStep > step ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-200'
                  }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-sm font-medium text-gray-600">
          <span>פרטים</span>
          <span>סיכום</span>
          <span>אישור</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          הזמנה חדשה
        </h1>
        <p className="text-xl text-gray-600">
          מלא את הפרטים ותקבל הצעת מחיר מיידית
        </p>
      </div>

      {renderStepIndicator()}

      {currentStep === 1 && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            פרטי ההזמנה
          </h2>
          <OrderForm onSubmit={handleFormSubmit} />
        </div>
      )}

      {currentStep === 2 && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            סיכום ההזמנה
          </h2>
          <OrderSummary
            orderData={orderData}
            onConfirm={handleOrderConfirm}
            onBack={() => setCurrentStep(1)}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {currentStep === 3 && completedOrder && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            ההזמנה אושרה!
          </h2>
          <InvoiceGenerator
            order={completedOrder}
            onNewOrder={() => {
              setCurrentStep(1);
              setOrderData({});
              setCompletedOrder(null);
            }}
            onGoHome={() => navigate(createPageUrl("Home"))}
          />
        </div>
      )}
    </div>
  );
}
