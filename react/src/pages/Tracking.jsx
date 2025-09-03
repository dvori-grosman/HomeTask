import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import TrackingStatus from "../components/tracking/TrackingStatus";
import { Search, Loader, AlertCircle, MapPin, Car, User, QrCode, FileText, Clipboard, Camera } from "lucide-react";
import QRScanner from "@/components/tracking/QRScanner";

export default function Tracking() {
  const [searchValue, setSearchValue] = useState("");
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState("orderNumber"); // "orderNumber" or "qrCode"
  const [showScanner, setShowScanner] = useState(false);

  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleDateString('he-IL');
    } catch (error) {
      return new Date().toLocaleDateString('he-IL');
    }
  };

  const searchOrder = async () => {
    if (!searchValue.trim()) {
      setError("נא להזין מספר הזמנה או קוד QR");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // אם זה קוד QR, נחלץ את מספר ההזמנה
      let orderNumber = searchValue.trim();
      
      if (searchType === "qrCode") {
        // אם זה QR code, הוא כבר מכיל את מספר ההזמנה
        // (לפי הקוד המקורי, ה-QR מכיל את orderNumber)
        orderNumber = searchValue.trim();
      }
      
      const response = await fetch(`http://localhost:4000/api/orders/getOrder/${orderNumber}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`שגיאה: ${errorText}`);
      }
      
      const orderData = await response.json();
      console.log("Order data:", orderData);
      setOrder(orderData);
      setError(null);
    } catch (err) {
      console.error("שגיאה בחיפוש הזמנה:", err);
      setError(err.message || "אירעה שגיאה בחיפוש ההזמנה. אנא נסה שוב.");
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchOrder();
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setSearchValue(text.trim());
        // אם זה נראה כמו קוד QR (בדרך כלל יותר ארוך)
        if (text.length > 10) {
          setSearchType("qrCode");
        }
        setError(null);
      } else {
        setError("הלוח ריק - אין מה להדביק");
      }
    } catch (err) {
      console.error("שגיאה בקריאת הלוח:", err);
      setError("לא ניתן לקרוא מהלוח - נסה להדביק ידנית");
    }
  };

  const handlePaste = async (e) => {
    // נתן זמן קטן לטקסט להיכנס לשדה
    setTimeout(() => {
      const pastedText = e.target.value;
      // בדיקה אם זה נראה כמו QR code (בדרך כלל מכיל את מספר ההזמנה)
      if (pastedText && pastedText.length > 5) {
        setSearchType("qrCode");
      }
    }, 10);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">מעקב אחר הזמנה</h1>
          <p className="text-lg text-gray-600">הזן מספר הזמנה או הדבק קוד QR כדי לעקוב אחר הסטטוס</p>
        </div>

        {/* Search Type Selector */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => {
              setSearchType("orderNumber");
              setSearchValue("");
              setError(null);
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              searchType === "orderNumber"
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            מספר הזמנה
          </button>
          <button
            onClick={() => {
              setSearchType("qrCode");
              setSearchValue("");
              setError(null);
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              searchType === "qrCode"
                ? "bg-purple-500 text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <QrCode className="w-4 h-4" />
            קוד QR
          </button>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={handleKeyPress}
                onPaste={handlePaste}
                placeholder={
                  searchType === "orderNumber" 
                    ? "הזן מספר הזמנה (לדוגמה: CW1234567890)"
                    : "הדבק את קוד ה-QR כאן (Ctrl+V)"
                }
                className={`text-center text-lg font-mono ${
                  searchType === "qrCode" ? "bg-purple-50 border-purple-200" : ""
                }`}
                disabled={isLoading}
              />
              {searchType === "qrCode" && (
                <QrCode className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
              )}
            </div>
            
            {/* Paste from Clipboard Button */}
            {searchType === "qrCode" && (
              <>
                <Button
                  onClick={handlePasteFromClipboard}
                  disabled={isLoading}
                  variant="outline"
                  className="border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 text-purple-600 px-4"
                  title="הדבק מהלוח"
                >
                  <Clipboard className="w-5 h-5" />
                </Button>
                <Button
                  onClick={() => setShowScanner(true)}
                  disabled={isLoading}
                  variant="outline"
                  className="border-2 border-green-200 hover:border-green-400 hover:bg-green-50 text-green-600 px-4"
                  title="סרוק עם המצלמה"
                >
                  <Camera className="w-5 h-5" />
                </Button>
              </>
            )}
            
            <Button
              onClick={searchOrder}
              disabled={isLoading}
              className={`px-8 ${
                searchType === "qrCode"
                  ? "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              } text-white`}
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Search Type Instructions */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            {searchType === "orderNumber" ? (
              <div className="text-center text-gray-600">
                <FileText className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <p className="font-medium">חיפוש לפי מספר הזמנה</p>
                <p className="text-sm">הזן את מספר ההזמנה שקיבלת במייל או ב-SMS</p>
              </div>
            ) : (
              <div className="text-center text-gray-600">
                <QrCode className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <p className="font-medium">חיפוש לפי קוד QR</p>
                <p className="text-sm">העתק את קוד ה-QR מהחשבונית והדבק כאן</p>
                <p className="text-xs text-purple-600 mt-1">
                  💡 לחץ על הכפתור 📋 להדבקה מהירה מהלוח או 📷 לסריקה עם המצלמה
                </p>
              </div>
            )}
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Order Details */}
      {order && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-xl mb-6">
              <h2 className="text-2xl font-bold">הזמנה נמצאה!</h2>
              <p className="text-lg mt-2">מספר הזמנה: <span className="font-mono font-bold">{order.orderNumber}</span></p>
            </div>
          </div>
          
          {/* Status Display */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6 border-2 border-green-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800 mb-2">סטטוס הזמנה</div>
                <div className="inline-block bg-white px-6 py-3 rounded-full shadow-md">
                  <span className="text-xl font-bold text-blue-600">{order.status || 'ממתין לעדכון'}</span>
                </div>
                <div className="mt-4 text-gray-600">
                  <p>ההזמנה שלך בטיפול - נעדכן אותך בהתקדמות</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                פרטי לקוח
              </h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium">שם:</span>
                  <span>{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">טלפון:</span>
                  <span>{order.phone}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Car className="w-5 h-5 text-green-500" />
                פרטי רכב
              </h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium">מספר:</span>
                  <span className="font-mono">{order.carNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">סוג:</span>
                  <span>{order.carType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">שירותים:</span>
                  <span>{order.serviceType}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-900 to-blue-900 text-white rounded-lg p-6 mt-6">
            <h3 className="text-lg font-bold mb-4">פרטי השירות</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-blue-200 mb-1">תאריך מבוקש</p>
                <p className="text-lg font-semibold">{formatDate(order.requestedAt)}</p>
              </div>
              <div className="text-center">
                <p className="text-blue-200 mb-1">זמן משוער</p>
                <p className="text-lg font-semibold">{order.timeEstimateMin} דקות</p>
              </div>
              <div className="text-center">
                <p className="text-blue-200 mb-1">עלות</p>
                <p className="text-3xl font-bold text-yellow-400">{order.priceNis}₪</p>
              </div>
            </div>
          </div>
          
          {order.location && order.location.address && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 mt-6 border border-purple-100">
              <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-500" />
                מיקום השירות
              </h3>
              <p className="text-gray-700 text-lg">{order.location.address}</p>
            </div>
          )}

          {/* Additional Actions */}
          <div className="mt-8 text-center">
            <Button
              onClick={() => {
                setOrder(null);
                setSearchValue("");
                setError(null);
              }}
              variant="outline"
              className="border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
            >
              חיפוש הזמנה חדשה
            </Button>
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScan={(data) => {
            setSearchValue(data);
            setShowScanner(false);
            // Automatically search after scan
            setTimeout(() => searchOrder(), 500);
          }}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
