import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { Eye, Phone, Car, Clock, DollarSign } from "lucide-react";



export default function OrdersList({ orders, onOrderUpdate }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

const updateOrderStatus = async (orderNumber, newStatus) => {
  setIsUpdating(true);
  try {
    const token = localStorage.getItem('admin-token'); // קבלת הטוקן מה-localStorage

    const response = await fetch(`http://localhost:4000/api/orders/${orderNumber}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        status: newStatus
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);


    if (!response.ok) {
      let errorMessage = 'שגיאה בעדכון הסטטוס';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = `שגיאה ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const updatedOrder = await response.json();
    console.log('הזמנה עודכנה בהצלחה:', updatedOrder);

    // רענון רשימת ההזמנות
    onOrderUpdate();

    alert(`הסטטוס עודכן בהצלחה ל: ${newStatus}`);

  } catch (error) {
    console.error("שגיאה בעדכון סטטוס:", error);
    alert(`אירעה שגיאה בעדכון הסטטוס: ${error.message}`);
  }
  setIsUpdating(false);
};



  const getStatusColor = (status) => {
    const colors = {
      "ממתין": "bg-yellow-100 text-yellow-800 border-yellow-300",
      "בדרך": "bg-blue-100 text-blue-800 border-blue-300",
      "בעבודה": "bg-orange-100 text-orange-800 border-orange-300",
      "הושלם": "bg-green-100 text-green-800 border-green-300",
      "בוטל": "bg-gray-100 text-gray-800 border-gray-300"
    };
    return colors[status] || colors["ממתין"];
  };


  const statuses = ["ממתין", "בדרך", "שטיפה", "הושלם"];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          רשימת הזמנות ({orders.length})
        </h2>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id || order.id}
              className="bg-gray-50 rounded-lg border border-gray-200 p-6 card-hover"
            >
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-bold text-xl text-gray-900">
                      {order.customerName} {/* שונה מ-customer_name ל-customerName */}
                    </h3>
                    <Badge className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div className="space-y-2">
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">{order.phone}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-green-500" />
                        <span className="font-medium">{order.carNumber} ({order.carType})</span> {/* שונה מ-license_plate ו-car_type */}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span className="font-medium">{order.timeEstimateMin} דקות</span> {/* שונה מ-calculated_time ל-timeEstimateMin */}
                      </p>
                      <p className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-purple-500" />
                        <span className="font-medium">{order.priceNis}₪</span> {/* שונה מ-calculated_price ל-priceNis */}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">שירות:</span> {order.serviceType}</p> {/* שונה מ-service_type?.join(', ') ל-serviceType (מחרוזת) */}
                    <p><span className="font-medium">תאריך מבוקש:</span> {format(new Date(order.requestedAt), 'dd/MM/yyyy HH:mm')}</p> {/* שונה מ-preferred_date ו-preferred_time ל-requestedAt */}
                  </div>
                </div>

                <div className="flex flex-col gap-3">


                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.orderNumber, e.target.value)}
                    disabled={isUpdating}
                    className={`border-2 border-gray-200 rounded-lg bg-white font-medium text-sm p-2 focus:border-blue-500 transition-colors ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>

                </div>
              </div>

              {/* Expanded Details */}
              {selectedOrder?.id === (order._id || order.id) && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-3">פרטים נוספים</h4>
                      <div className="text-sm space-y-2">
                        <p><span className="font-medium text-gray-600">מספר הזמנה:</span> {order.orderNumber}</p> {/* שונה מ-order_number ל-orderNumber */}
                        <p><span className="font-medium text-gray-600">רמת לכלוך:</span> {order.dirtLevel}/5</p> {/* שונה מ-dirt_level ל-dirtLevel */}
                        <p><span className="font-medium text-gray-600">מרחק:</span> {order.distanceKm} ק״מ</p> {/* שונה מ-distance_km ל-distanceKm */}
                        <p><span className="font-medium text-gray-600">נוצר:</span> {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}</p> {/* שונה מ-created_date ל-createdAt */}
                        {order.trailerAssigned && (
                          <p><span className="font-medium text-gray-600">ניידת:</span> {order.trailerAssigned.trailerId}</p>
                        )}
                      </div>
                    </div>

                    {order.location?.address && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-bold text-gray-900 mb-3">מיקום</h4>
                        <p className="text-sm font-medium">{order.location.address}</p>
                        {order.location.lat && order.location.lng && (
                          <p className="text-sm text-gray-600 mt-2">
                            קואורדינטות: {order.location.lat.toFixed(6)}, {order.location.lng.toFixed(6)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {order.imageUrl && (
                    <div className="mt-4 text-center">
                      <h4 className="font-bold text-gray-900 mb-3">תמונת הרכב</h4>
                      <img
                        src={order.imageUrl}
                        alt="תמונת הרכב"
                        className="w-64 h-48 object-cover rounded-lg shadow-md mx-auto"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {orders.length === 0 && (
            <div className="text-center py-16">
              <Car className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-xl font-medium text-gray-500">אין הזמנות עדיין</p>
              <p className="text-gray-400 mt-2">כאשר לקוחות יזמינו שירותים, הם יופיעו כאן</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}