import React from 'react';
import { Check, Clock, Truck, Car as CarWashIcon, Star } from 'lucide-react';

const TrackingStatus = ({ currentStatus }) => {
  const statuses = [
    { name: 'ממתין', icon: Clock },
    { name: 'בדרך', icon: Truck },
    { name: 'שטיפה', icon: CarWashIcon },
    { name: 'הושלם', icon: Star },
  ];


  const currentStatusIndex = statuses.findIndex(s => s.name === currentStatus);

  return (
    <div className="w-full">
      <div className="flex items-center">
        {statuses.map((status, index) => {
          const isActive = index <= currentStatusIndex;

          return (
            <React.Fragment key={status.name}>
              <div className="flex flex-col items-center">
                <div 
                  className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                    isActive ? 'bg-blue-500 border-blue-600' : 'bg-gray-200 border-gray-300'
                  }`}
                >
                  <status.icon className={`w-6 h-6 md:w-8 md:h-8 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                </div>
                <p className={`mt-2 text-center text-xs md:text-sm font-medium transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {status.name}
                </p>
              </div>

              {index < statuses.length - 1 && (
                <div 
                  className={`flex-1 h-2 transition-all duration-500 ${
                    index < currentStatusIndex ? 'bg-blue-500' : 'bg-gray-200'
                  }`} 
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      {currentStatus === 'בוטל' && (
        <div className="mt-6 text-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p className="font-bold">ההזמנה בוטלה</p>
        </div>
      )}
    </div>
  );
};

export default TrackingStatus;