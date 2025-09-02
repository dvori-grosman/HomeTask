import React from "react";
import { DollarSign, Calendar, Clock, MapPin, TrendingUp, Users } from "lucide-react";

export default function AdminStats({ stats, orders }) {
  const getStatusCounts = () => {
    const counts = {};
    orders.forEach(order => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  const statCards = [
    {
      title: "סך הזמנות",
      value: stats.totalOrders,
      icon: Calendar,
      color: "from-blue-500 to-purple-600"
    },
    {
      title: "הכנסות כוללות",
      value: `${stats.totalRevenue.toLocaleString()}₪`,
      icon: DollarSign,
      color: "from-green-500 to-teal-600"
    },
    {
      title: "זמן עבודה מצטבר",
      value: `${Math.round(stats.totalTime / 60)} שעות`,
      icon: Clock,
      color: "from-orange-500 to-red-600"
    },
    {
      title: "קילומטרים כוללים",
      value: `${stats.totalDistance} ק״מ`,
      icon: MapPin,
      color: "from-purple-500 to-pink-600"
    }
  ];

  const statusColors = {
    "ממתין": "from-yellow-500 to-orange-500",
    "אושר": "from-green-500 to-emerald-500", 
    "בביצוע": "from-blue-500 to-cyan-500",
    "הושלם": "from-purple-500 to-violet-500",
    "בוטל": "from-gray-500 to-slate-500"
  };

  return (
    <div className="space-y-8">
      {/* Main Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 card-hover"
          >
            <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-lg w-fit mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          פילוח לפי סטטוס
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div
              key={status}
              className="bg-gray-50 rounded-lg p-6 text-center"
            >
              <div className={`bg-gradient-to-r ${statusColors[status]} text-white rounded-lg p-4 mb-3`}>
                <div className="text-2xl font-bold">{count}</div>
              </div>
              <div className="font-medium text-gray-900">{status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">הכנסה ממוצעת</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString() : 0}₪
          </p>
          <p className="text-gray-600">לכל הזמנה</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 p-2 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">זמן ממוצע</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {stats.totalOrders > 0 ? Math.round(stats.totalTime / stats.totalOrders) : 0} דקות
          </p>
          <p className="text-gray-600">לכל הזמנה</p>
        </div>
      </div>
    </div>
  );
}