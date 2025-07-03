import React, { useState, useEffect } from 'react';
import { useAppointmentStore } from '../store/appointmentStore';
import { Calendar, Clock, Video, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AppointmentWidgetProps {
  limit?: number;
  showHeader?: boolean;
  className?: string;
}

const AppointmentWidget: React.FC<AppointmentWidgetProps> = ({
  limit = 3,
  showHeader = true,
  className = ''
}) => {
  const { appointments, getUpcomingAppointments, selectAppointment } = useAppointmentStore();
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  
  useEffect(() => {
    // Get the upcoming appointments
    const upcoming = getUpcomingAppointments(limit);
    setUpcomingAppointments(upcoming);
  }, [appointments, limit]);
  
  // Format date for display
  const formatDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };
  
  // Get appointment type icon
  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video size={16} className="text-purple-500" />;
      case 'phone':
        return <Phone size={16} className="text-blue-500" />;
      case 'in-person':
        return <MapPin size={16} className="text-green-500" />;
      default:
        return <Calendar size={16} className="text-gray-500" />;
    }
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      {showHeader && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Upcoming Appointments</h3>
          <Link to="/appointments" className="text-sm text-blue-600 hover:text-blue-800">
            View All
          </Link>
        </div>
      )}
      
      {upcomingAppointments.length > 0 ? (
        <div className="space-y-3">
          {upcomingAppointments.map(appointment => (
            <div 
              key={appointment.id} 
              className="border rounded-lg p-3 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
              onClick={() => selectAppointment(appointment.id)}
            >
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center">
                    {getAppointmentTypeIcon(appointment.type)}
                    <h4 className="font-medium text-sm ml-2">{appointment.title}</h4>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{appointment.contactName}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-xs text-gray-600">
                    <Clock size={12} className="mr-1" />
                    {formatDate(appointment.date)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{appointment.duration} min</p>
                </div>
              </div>
              
              <div className="mt-2 flex justify-between items-center">
                {appointment.type === 'video' && (
                  <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded flex items-center">
                    <Video size={10} className="mr-1" />
                    Video Call
                  </span>
                )}
                {appointment.type === 'phone' && (
                  <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded flex items-center">
                    <Phone size={10} className="mr-1" />
                    Phone Call
                  </span>
                )}
                {appointment.type === 'in-person' && (
                  <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded flex items-center">
                    <MapPin size={10} className="mr-1" />
                    In Person
                  </span>
                )}
                
                <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center">
                  Details
                  <ArrowRight size={10} className="ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <Calendar size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500">No upcoming appointments</p>
          <Link 
            to="/appointments"
            className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800"
          >
            Schedule one now
          </Link>
        </div>
      )}
    </div>
  );
};

export default AppointmentWidget;