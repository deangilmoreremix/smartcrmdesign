import React from 'react';
import { Plus, UserPlus, Calendar, Mail } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useDealStore } from '../../store/dealStore';
import { useContactStore } from '../../store/contactStore';
import Avatar from '../ui/Avatar';
import { getInitials } from '../../utils/avatars';

const QuickActions = () => {
  const { isDark } = useTheme();
  const { deals } = useDealStore();
  const { contacts } = useContactStore();
  
  // Get active deals
  const activeDeals = Object.values(deals).filter(deal => 
    deal.stage !== 'closed-won' && deal.stage !== 'closed-lost'
  );
  
  // Get deals with contacts for avatar display
  const dealsWithContacts = activeDeals
    .map(deal => ({
      ...deal,
      contact: contacts[deal.contactId]
    }))
    .filter(deal => deal.contact); // Only include deals with valid contacts
  
  // Get contacts for the contact button
  const activeContacts = Object.values(contacts);

  // Render avatar stack for buttons
  const renderAvatarStack = (items: any[], maxVisible: number = 3) => {
    const visibleItems = items.slice(0, maxVisible);
    const remainingCount = Math.max(0, items.length - maxVisible);
    
    return (
      <div className="flex items-center mt-3">
        <div className="flex -space-x-2">
          {visibleItems.map((item, index) => {
            // If the item is a deal with contact property, use the contact
            // Otherwise assume it's a contact directly
            const contact = 'contact' in item ? item.contact : item;
            
            return (
              <div key={index} className="relative" style={{ zIndex: maxVisible - index }}>
                <Avatar
                  src={contact.avatar}
                  alt={contact.name}
                  size="sm"
                  fallback={getInitials(contact.name)}
                  className="border-2 border-white dark:border-transparent"
                />
              </div>
            );
          })}
          {remainingCount > 0 && (
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 border-white dark:border-transparent ${
              isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              +{remainingCount}
            </div>
          )}
        </div>
        <span className="text-white/90 text-sm font-medium ml-2">
          {items.length} {items === dealsWithContacts ? 'deals' : 'contacts'}
        </span>
      </div>
    );
  };

  const actions = [
    {
      title: 'New Deal',
      description: 'Create a new deal',
      icon: Plus,
      color: 'from-green-500 to-emerald-500',
      hoverColor: 'hover:from-green-600 hover:to-emerald-600',
      data: dealsWithContacts
    },
    {
      title: 'Add Contact',
      description: 'Add new contact',
      icon: UserPlus,
      color: 'from-blue-500 to-cyan-500',
      hoverColor: 'hover:from-blue-600 hover:to-cyan-600',
      data: activeContacts
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
      <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>Quick Actions</h2>
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
            
            {/* Render avatar stack if data is available */}
            {'data' in action && action.data.length > 0 && renderAvatarStack(action.data)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;