import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, User, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios"; // הוסף את הייבוא של axios

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null); // הוסף מצב לשגיאות

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // אפס את השגיאה

    try {
      const response = await axios.post("http://localhost:4000/api/admin/login", {
        email: formData.username, // הנח ששם המשתמש הוא ה-email
        password: formData.password
      });

      const { token } = response.data;
      
      console.log("Login successful, token:", token);
      // שמירת הטוקן ב-localStorage
      localStorage.setItem('admin-token', token);
      localStorage.setItem('admin-username', formData.username);

      setIsLoading(false);
      // סימון כ"מחובר"
      localStorage.setItem('admin-logged-in', 'true');
      // הפנייה לעמוד הניהול
      navigate(createPageUrl("Admin"));
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.message || 'שגיאה בהתחברות'); // הצג את הודעת השגיאה
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">פאנל ניהול</h1>
            <p className="text-gray-600">התחבר למערכת הניהול</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-gray-700 font-medium mb-2 block">שם משתמש</Label>
              <div className="relative">
                <Input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="הזן שם משתמש"
                  className="pl-12 border-2 border-gray-200 rounded-lg focus:border-blue-500 transition-colors h-12"
                  required
                />
                <User className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
              </div>
            </div>

            <div>
              <Label className="text-gray-700 font-medium mb-2 block">סיסמה</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="הזן סיסמה"
                  className="pl-12 pr-12 border-2 border-gray-200 rounded-lg focus:border-blue-500 transition-colors h-12"
                  required
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>} {/* הצג שגיאות */}

            <Button
              type="submit"
              disabled={isLoading || !formData.username || !formData.password}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg shadow-lg font-semibold text-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  מתחבר...
                </div>
              ) : (
                "התחבר לפאנל"
              )}
            </Button>
          </form>

        
        </div>

        <div className="text-center mt-8">
          <p className="text-white/70 text-sm">
            מערכת ניהול שטיפת רכבים פרימיום
          </p>
        </div>
      </div>
    </div>
  );
}
