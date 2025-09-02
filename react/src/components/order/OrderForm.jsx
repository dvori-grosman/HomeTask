
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
// import { UploadFile } from "@/api/integrations";
import { Upload, MapPin, Calendar, Phone, Car } from "lucide-react";

export default function OrderForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    license_plate: "",
    car_type: "",
    service_type: "",
    preferred_date: "",
    preferred_time: "",
    location_lat: null,
    location_lng: null,
    location_address: "",
    car_image_url: "",
    dirt_level: 3,
    distance_km: 10
  });
  const [isUploading, setIsUploading] = useState(false);

  const carTypes = ['פרטי', 'מסחרי', 'ג׳יפ', 'וואן'];

  const serviceOptions = [
    { id: '1', label: 'חוץ' },
    { id: '2', label: 'חוץ+פנים' },
    { id: '3', label: 'פוליש' },
    { id: '4', label: 'ווקס' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (serviceId, checked) => {
    setFormData(prev => ({
      ...prev,
      service_type: checked
        ? [...prev.service_type, serviceId]
        : prev.service_type.filter(s => s !== serviceId)
    }));
  };

  const [carImageFile, setCarImageFile] = useState(null);


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    console.log("Uploading file:", file);
    console.log("File type:", URL.createObjectURL(file));
    setCarImageFile(URL.createObjectURL(file)); // שמירת הקובץ עצמו
    setFormData(prev => ({ ...prev, car_image: file })); // שמירת ה-URL הזמני

    setIsUploading(false);
  };


  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            location_lat: latitude,
            location_lng: longitude
          }));

          // קריאה ל-API של Google Maps כדי לקבל כתובת
          fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_API_KEY`)
            .then(response => response.json())
            .then(data => {
              if (data.results && data.results.length > 0) {
                const address = data.results[0].formatted_address;
                setFormData(prev => ({
                  ...prev,
                  location_address: address
                }));
              }
            })
            .catch(error => {
              console.error("שגיאה בקבלת כתובת:", error);
            });
        },
        (error) => {
          console.error("שגיאה בקבלת מיקום:", error);
          alert("לא הצלחנו לקבל את המיקום שלך. אנא הכנס כתובת ידנית.");
        }
      );
    } else {
      alert("הדפדפן שלך לא תומך בשירותי מיקום.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.customer_name || !formData.phone || !formData.license_plate ||
      !formData.car_type || formData.service_type.length === 0 ||
      !formData.preferred_date || !formData.preferred_time) {
      alert("נא למלא את כל השדות הנדרשים");
      return;
    }

    // נוודא שקואורדינטות ריקות ישלחו כ-null ולא כמחרוזות ריקות
    const cleanedData = {
      ...formData,
      location_lat: formData.location_lat === 32.0853 ? null : formData.location_lat,
      location_lng: formData.location_lng === 34.7818 ? null : formData.location_lng,
      // car_image_url: formData.car_image_url || ""
    };

    onSubmit(cleanedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* פרטי לקוח */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
            <Phone className="w-5 h-5 text-white" />
          </div>
          פרטי לקוח
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label className="text-gray-700 font-medium mb-2 block">שם מלא *</Label>
            <Input
              value={formData.customer_name}
              onChange={(e) => handleInputChange('customer_name', e.target.value)}
              placeholder="הכנס שם מלא"
              className="border-2 border-gray-200 rounded-lg focus:border-blue-500 transition-colors"
              required
            />
          </div>
          <div>
            <Label className="text-gray-700 font-medium mb-2 block">טלפון *</Label>
            <Input
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="050-1234567"
              className="border-2 border-gray-200 rounded-lg focus:border-blue-500 transition-colors"
              required
            />
          </div>
        </div>
      </div>

      {/* פרטי רכב */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-lg">
            <Car className="w-5 h-5 text-white" />
          </div>
          פרטי הרכב
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label className="text-gray-700 font-medium mb-2 block">מספר רכב *</Label>
            <Input
              value={formData.license_plate}
              onChange={(e) => handleInputChange('license_plate', e.target.value)}
              placeholder="123-45-678"
              className="border-2 border-gray-200 rounded-lg focus:border-green-500 transition-colors"
              required
            />
          </div>
          <div>
            <Label className="text-gray-700 font-medium mb-2 block">סוג רכב *</Label>
            <Select onValueChange={(value) => handleInputChange('car_type', value)}>
              <SelectTrigger className="border-2 border-gray-200 rounded-lg focus:border-green-500">
                <SelectValue placeholder="בחר סוג רכב" />
              </SelectTrigger>
              <SelectContent>
                {carTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* שירותים */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">בחירת שירותים *</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {serviceOptions.map(service => (
            <div key={service.id} className="bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-colors">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Checkbox
                  id={service.id}
                  checked={formData.service_type.includes(service.label)} // שומר את המחרוזת של השירות
                  onCheckedChange={(checked) => handleServiceChange(service.label, checked)} // שומר את המחרוזת של השירות
                  className="border-2 border-gray-300"
                />
                <Label htmlFor={service.id} className="font-medium text-gray-800 cursor-pointer">
                  {service.label}
                </Label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* תאריך ושעה */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-lg">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          מועד מועדף
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label className="text-gray-700 font-medium mb-2 block">תאריך *</Label>
            <Input
              type="date"
              value={formData.preferred_date}
              onChange={(e) => handleInputChange('preferred_date', e.target.value)}
              className="border-2 border-gray-200 rounded-lg focus:border-yellow-500 transition-colors"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div>
            <Label className="text-gray-700 font-medium mb-2 block">שעה *</Label>
            <Input
              type="time"
              value={formData.preferred_time}
              onChange={(e) => handleInputChange('preferred_time', e.target.value)}
              className="border-2 border-gray-200 rounded-lg focus:border-yellow-500 transition-colors"
              required
            />
          </div>
        </div>
      </div>

      {/* מיקום */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-2 rounded-lg">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          מיקום השירות
        </h3>
        <Button
          type="button"
          onClick={getCurrentLocation}
          className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg"
        >
          <MapPin className="w-4 h-4 ml-2" />
          השתמש במיקום הנוכחי
        </Button>
        {formData.location_lat !== null && formData.location_lng !== null && (
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <p className="text-gray-700 font-medium">
              ✅ מיקום נקלט: {formData.location_lat.toFixed(6)}, {formData.location_lng.toFixed(6)} - {formData.location_address}
            </p>
          </div>
        )}
      </div>

      {/* תמונת רכב */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-2 rounded-lg">
            <Upload className="w-5 h-5 text-white" />
          </div>
          תמונת הרכב (אופציונלי)
        </h3>
        <div className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="car-image-upload"
          />
          <Button
            type="button"
            onClick={() => document.getElementById('car-image-upload').click()}
            disabled={isUploading}
            variant="outline"
            className="border-2 border-dashed border-gray-300 hover:border-indigo-400 rounded-lg p-6 w-full"
          >
            <Upload className="w-6 h-6 ml-2" />
            {isUploading ? "מעלה תמונה..." : "העלה תמונת רכב"}
          </Button>
          {carImageFile && (
            <div className="text-center">
              <img
                src={carImageFile}
                alt="תמונת הרכב"
                className="w-48 h-32 object-cover rounded-lg shadow-md mx-auto"
              />
            </div>
          )}
        </div>
      </div>

      {/* רמת לכלוך */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">רמת לכלוך (1-5) *</h3>
        <div className="flex gap-4 justify-center">
          {[1, 2, 3, 4, 5].map(level => (
            <Button
              key={level}
              type="button"
              onClick={() => handleInputChange('dirt_level', level)}
              className={`w-16 h-16 rounded-xl font-bold transition-all ${formData.dirt_level === level
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg transform scale-110'
                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-red-300'
                }`}
            >
              {level}
            </Button>
          ))}
        </div>
        <p className="text-gray-600 text-center mt-4">
          1 = נקי יחסית • 5 = מלוכלך מאוד
        </p>
      </div>

      <div className="text-center pt-4">
        <Button
          type="submit"
          className="text-lg px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg shadow-lg btn-primary font-semibold"
        >
          המשך לסיכום ההזמנה
        </Button>
      </div>
    </form>
  );
}
