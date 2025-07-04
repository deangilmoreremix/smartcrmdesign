import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useContactStore } from '../../store/contactStore';
import { Calendar, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { getInitials } from '../../utils/avatars';

const RecentActivity: React.FC = () => {
  const { isDark } = useTheme();
  const { contacts } = useContactStore();
  
  // Updated upcomingDeals with contactId instead of direct avatar
  const upcomingDeals = [
    {
      id: 1,
      company: 'TechCorp Solutions',
      value: '$85,000',
      probability: '85%',
      dueDate: 'Tomorrow',
      contactId: '1', // Changed from contact+avatar to contactId
      status: 'online'
    },
    {
      id: 2,
      company: 'Innovation Labs',
      value: '$120,000',
      probability: '60%',
      dueDate: 'Friday',
      contactId: '2',
      status: 'offline'
    },
    {
      id: 3,
      company: 'Global Dynamics',
      value: '$95,500',
      probability: '75%',
      dueDate: 'Next Week',
      contactId: '3',
      status: 'online'
    }
  ];

  const recentActivities = [
    {
      type: 'deal',
      icon: TrendingUp,
      title: 'Deal moved to negotiation',
      description: 'TechCorp Solutions - $85,000',
      time: '2 hours ago',
      color: 'text-blue-600'
    },
    {
      type: 'task',
      icon: CheckCircle,
      title: 'Task completed',
      description: 'Follow-up call with Innovation Labs',
      time: '4 hours ago',
      color: 'text-green-600'
    },
    {
      type: 'meeting',
      icon: Calendar,
      title: 'Meeting scheduled',
      description: 'Product demo with Global Dynamics',
      time: '6 hours ago',
      color: 'text-purple-600'
    },
    {
      type: 'alert',
      icon: AlertCircle,
      title: 'Deal at risk',
      description: 'No activity on Enterprise Corp deal',
      time: '1 day ago',
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Upcoming Deals */}
      <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Upcoming Deals</h3>
          <Calendar className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
        </div>
        
        <div className="space-y-4">
          {upcomingDeals.map((deal) => {
            // Get contact data using contactId
            const contact = contacts[deal.contactId];
            
            return (
              <div key={deal.id} className={`flex items-center justify-between p-4 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50/80 hover:bg-gray-100/80'} rounded-xl transition-colors`}>
                <div className="flex items-center space-x-3">
                  {contact && (
                    <Avatar
                      src={contact.avatar}
                      alt={contact.name}
                      size="sm"
                      fallback={getInitials(contact.name)}
                      status={deal.status as 'online' | 'offline' | 'away' | 'busy'}
                    />
                  )}
                  <div>
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} text-sm`}>{deal.company}</h4>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {contact ? contact.name : 'Unknown Contact'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} text-sm`}>{deal.value}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{deal.probability} • {deal.dueDate}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h3>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>24 completed</span>
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>•</span>
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>8 pending</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {recentActivities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={index} className={`flex items-start space-x-3 p-3 ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/80'} rounded-lg transition-colors`}>
                <div className={`p-2 rounded-lg ${activity.color} ${isDark ? 'bg-opacity-10' : 'bg-opacity-10'}`}>
                  <Icon className={`w-4 h-4 ${isDark ? activity.color : activity.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} text-sm`}>{activity.title}</h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{activity.description}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-1`}>{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;