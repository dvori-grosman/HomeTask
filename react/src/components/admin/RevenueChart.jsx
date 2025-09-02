import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { format } from "date-fns";
import { he } from "date-fns/locale";

export default function RevenueChart({ orders }) {
  // בדיקה שהמערך תקין
  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            אין נתונים להצגה
          </h2>
        </div>
      </div>
    );
  }

  // דיבאג - בואו נראה מה יש במערך
  console.log('Orders received in RevenueChart:', orders);
  const prepareChartData = () => {
    const dailyRevenue = {};
    const dailyOrders = {};

    orders.forEach(order => {
      try {
        // בדיקה שהתאריך תקין לפני השימוש
        if (!order.createdAt) {
          console.warn('Order without createdAt:', order);
          return;
        }
        
        const orderDate = new Date(order.createdAt);
        if (isNaN(orderDate.getTime())) {
          console.warn('Invalid createdAt date:', order.createdAt, 'for order:', order);
          return;
        }
        
        const date = format(orderDate, 'yyyy-MM-dd');
        dailyRevenue[date] = (dailyRevenue[date] || 0) + (order.priceNis || 0);
        dailyOrders[date] = (dailyOrders[date] || 0) + 1;
      } catch (error) {
        console.error('Error processing order date:', error, 'Order:', order);
      }
    });

    return Object.keys(dailyRevenue)
      .sort()
      .slice(-7) // Last 7 days
      .map(date => {
        try {
          return {
            date: format(new Date(date), 'dd/MM'),
            revenue: dailyRevenue[date],
            orders: dailyOrders[date]
          };
        } catch (error) {
          console.error('Error formatting date for chart:', date, error);
          return null;
        }
      })
      .filter(Boolean); // מסנן ערכי null
  };

  const serviceTypeData = () => {
    const serviceCounts = {};
    orders.forEach(order => {
      // serviceType הוא מחרוזת במודל החדש, לא מערך
      const service = order.serviceType;
      if (service) {
        serviceCounts[service] = (serviceCounts[service] || 0) + 1;
      }
    });

    return Object.entries(serviceCounts).map(([service, count]) => ({
      service,
      count
    }));
  };

  const chartData = prepareChartData();
  const serviceData = serviceTypeData();

  return (
    <div className="space-y-8">
      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          הכנסות יומיות - 7 הימים האחרונים
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280" 
                fontSize={12}
                fontWeight="500"
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12}
                fontWeight="500"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontWeight: '500'
                }}
                formatter={(value, name) => [
                  name === 'revenue' ? `${value}₪` : value,
                  name === 'revenue' ? 'הכנסה' : 'הזמנות'
                ]}
              />
              <Bar 
                dataKey="revenue" 
                fill="url(#colorGradient)" 
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#764ba2" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders Chart */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          מספר הזמנות יומי
        </h2>
        <div className="bg-white rounded-lg p-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280" 
                  fontSize={12}
                  fontWeight="500"
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={12}
                  fontWeight="500"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontWeight: '500'
                  }}
                  formatter={(value) => [value, 'הזמנות']}
                />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#667eea" 
                  strokeWidth={3}
                  dot={{ fill: '#667eea', stroke: '#fff', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#667eea', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Service Types Chart */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          פילוח שירותים
        </h2>
        <div className="bg-white rounded-lg p-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  type="number"
                  stroke="#6b7280" 
                  fontSize={12}
                  fontWeight="500"
                />
                <YAxis 
                  type="category"
                  dataKey="service" 
                  stroke="#6b7280" 
                  fontSize={12}
                  fontWeight="500"
                  width={80}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontWeight: '500'
                  }}
                  formatter={(value) => [value, 'כמות']}
                />
                <Bar 
                  dataKey="count" 
                  fill="url(#serviceGradient)" 
                  radius={[0, 4, 4, 0]}
                />
                <defs>
                  <linearGradient id="serviceGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}