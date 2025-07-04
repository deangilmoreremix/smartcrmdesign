import React from 'react';
import { Plus, UserPlus, Calendar, Mail, Target, Phone } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      title: 'New Deal',
      description: 'Create a new deal',
      icon: Plus,
      color: 'from-green-500 to-emerald-500',
      hoverColor: 'hover:from-green-600 hover:to-emerald-600'
    },
    {
      title: 'Add Contact',
      description: 'Add new contact',
      icon: UserPlus,
      color: 'from-blue-500 to-cyan-500',
      hoverColor: 'hover:from-blue-600 hover:to-cyan-600'
    },
    {
      title: 'Schedule Meeting',
      description: 'Book a meeting',
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
      hoverColor: 'hover:from-purple-600 hover:to-pink-600'
    },
    {
      title: 'Send Email',
      description: 'Compose email',
      icon: Mail,
      color: 'from-orange-500 to-red-500',
      hoverColor: 'hover:from-orange-600 hover:to-red-600'
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`bg-gradient-to-r ${action.color} ${action.hoverColor} rounded-2xl p-6 text-left transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{action.title}</h3>
                <p className="text-sm text-white/80">{action.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;