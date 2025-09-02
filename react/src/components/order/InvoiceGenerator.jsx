import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Home, Plus, CheckCircle, User, Car, Clipboard } from "lucide-react";

export default function InvoiceGenerator({ order, onNewOrder, onGoHome }) {
  // בדיקה שהאובייקט order קיים
  if (!order) {
    return <div className="text-center p-8">טוען נתונים...</div>;
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(order.orderNumber)}`;

  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleDateString('he-IL');
    } catch (error) {
      return new Date().toLocaleDateString('he-IL');
    }
  };

  const generateInvoicePDF = () => {
    const invoiceContent = `
    <!DOCTYPE html>
    <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>חשבונית - ${order.orderNumber || 'N/A'}</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 40px; 
            direction: rtl; 
            background: #f8fafc;
          }
          .invoice-container { 
            max-width: 800px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 12px; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
            overflow: hidden;
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px; 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
          }
          .logo { 
            width: 80px; 
            height: 80px; 
            background: rgba(255,255,255,0.2); 
            border-radius: 12px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-weight: bold; 
            font-size: 18px;
          }
          .invoice-title { font-size: 32px; font-weight: bold; margin-bottom: 8px; }
          .invoice-subtitle { font-size: 16px; opacity: 0.9; }
          .content { padding: 40px; }
          .section { 
            margin-bottom: 30px; 
            padding: 20px; 
            border-radius: 8px; 
            border-left: 4px solid #667eea;
          }
          .customer-section { background: #f0f4ff; }
          .service-section { background: #f0fff4; }
          .total-section { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 25px; 
            text-align: center; 
            margin: 20px 0;
            border-radius: 8px;
          }
          .total-amount { font-size: 36px; font-weight: bold; margin-bottom: 8px; }
          .qr-section {
            text-align: center;
            margin-top: 40px;
          }
          .qr-section img {
            margin-top: 10px;
            border: 4px solid #eee;
            border-radius: 12px;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div>
              <h1 class="invoice-title">חשבונית</h1>
              <p class="invoice-subtitle">מספר: ${order.orderNumber || 'N/A'}</p>
              <p class="invoice-subtitle">תאריך: ${formatDate(order.requestedAt)}</p>
            </div>
            <div class="logo">🚗 LOGO</div>
          </div>
          
          <div class="content">
            <div class="section customer-section">
              <h3 class="section-title">פרטי לקוח</h3>
              <p>שם: ${order.customerName || 'לא צוין'}</p>
              <p>טלפון: ${order.phone || 'לא צוין'}</p>
              <p>מספר רכב: ${order.carNumber || 'לא צוין'}</p>
              <p>סוג רכב: ${order.carType || 'לא צוין'}</p>
            </div>

            <div class="section service-section">
              <h3 class="section-title">פרטי השירות</h3>
              <p>שירותים: ${order.serviceType || 'לא צוין'}</p>
              <p>רמת לכלוך: ${order.dirtLevel || 'לא צוין'}/5</p>
              <p>זמן משוער: ${order.timeEstimateMin || 'לא צוין'} דקות</p>
            </div>

            <div class="total-section">
              <div class="total-amount">${order.priceNis || '0'}₪</div>
              <p>סכום לתשלום</p>
            </div>

            <div class="qr-section">
              <h3>קוד QR להזמנה</h3>
              <img src="${qrUrl}" alt="QR Code" />
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

    const blob = new Blob([invoiceContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${order.orderNumber || 'unknown'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyOrderNumber = async () => {
    try {
      if (!order.orderNumber) {
        console.error("אין מספר הזמנה להעתיק");
        return;
      }
      await navigator.clipboard.writeText(order.orderNumber);
      console.log("Order number copied to clipboard:", order.orderNumber);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const copyQrCodeImage = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      console.log("QR Code image copied to clipboard");
    } catch (err) {
      console.error("Failed to copy QR Code image: ", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Success Message */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-8 rounded-xl shadow-lg">
          <div className="bg-white/20 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold mb-4">ההזמנה התקבלה בהצלחה!</h2>
          <div className="bg-white/20 p-4 rounded-lg mt-6">
            <p className="text-lg mb-2">מספר ההזמנה שלך:</p>
            <div className="flex items-center justify-center gap-4">
              <p className="text-3xl font-mono font-bold bg-white text-gray-900 px-6 py-3 rounded-lg">
                {order.orderNumber || 'N/A'}
              </p>
              <Button
                onClick={copyOrderNumber}
                variant="outline"
                className="bg-white/20 border-2 border-white text-white hover:bg-white hover:text-gray-900"
              >
                <Clipboard className="w-4 h-4 ml-2" />
                העתק
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">פרטי הלקוח</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">שם:</span>
              <span className="font-medium">{order.customerName || 'לא צוין'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">טלפון:</span>
              <span className="font-medium">{order.phone || 'לא צוין'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">רכב:</span>
              <span className="font-medium">{order.carNumber || 'לא צוין'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-lg">
              <Car className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">פרטי השירות</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">שירותים:</span>
              <span className="font-medium">{order.serviceType || 'לא צוין'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">זמן:</span>
              <span className="font-medium">{order.timeEstimateMin || 'לא צוין'} דקות</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Summary */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 text-white rounded-xl p-8">
        <h3 className="text-2xl font-bold text-center mb-6">סיכום תמחור</h3>
        <div className="text-center mt-6 pt-6 border-t border-white/20">
          <p className="text-3xl font-bold">{order.priceNis || '0'}₪</p>
          <p className="text-lg opacity-90">סכום כולל</p>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">מה הלאה?</h3>
        <div className="text-center text-gray-700 space-y-3">
          <p className="font-medium">✅ ההזמנה שלך התקבלה ועובר לטיפול</p>
          <p>📞 נהיה בקשר בקרוב לתיאום הגעה</p>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="text-center bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">קוד QR להזמנה</h3>
        <img src={qrUrl} alt="QR Code" className="mx-auto border-4 border-gray-200 rounded-lg" />
        <Button
          onClick={copyQrCodeImage}
          variant="outline"
          className="mt-4 border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 rounded-lg px-6 py-3 font-medium flex items-center gap-2 mx-auto"
        >
          <Clipboard className="w-4 h-4" />
          העתק קוד QR
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          onClick={generateInvoicePDF}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg px-6 py-3 font-medium"
        >
          <Download className="w-5 h-5 ml-2" />
          הורד חשבונית
        </Button>

        <Button
          onClick={onNewOrder}
          variant="outline"
          className="border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 rounded-lg px-6 py-3 font-medium"
        >
          <Plus className="w-5 h-5 ml-2" />
          הזמנה חדשה
        </Button>

        <Button
          onClick={onGoHome}
          variant="outline"
          className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg px-6 py-3 font-medium"
        >
          <Home className="w-5 h-5 ml-2" />
          חזור לבית
        </Button>
      </div>
    </div>
  );
}