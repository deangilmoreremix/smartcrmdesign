import React from 'react';
import { MoreHorizontal, Mail, Phone, MapPin, Building } from 'lucide-react';
import Avatar from './ui/Avatar';
import CallButton from './CallButton';
import { getInitials } from '../utils/avatars';
import { useTheme } from '../contexts/ThemeContext';

interface ContactCardProps {
  contact: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    position?: string;
    avatar?: string;
    status: 'hot' | 'warm' | 'cold';
    source: string;
    tags: string[];
  };
}

const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  const { isDark } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-800';
      case 'warm': return isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-800';
      case 'cold': return isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-800';
      default: return isDark ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`${isDark ? 'bg-gray-800/50' : 'bg-white'} backdrop-blur-xl border ${isDark ? 'border-white/10' : 'border-gray-200'} rounded-2xl p-6 hover:${isDark ? 'bg-gray-800/70' : 'bg-gray-50'} transition-all duration-300 group`}>
      <div className="flex items-start justify-between mb-4">
        <Avatar 
          src={contact.avatar}
          alt={contact.name}
          size="lg"
          fallback={getInitials(contact.name)}
          status="online"
        />
        <button className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'} transition-colors opacity-0 group-hover:opacity-100`}>
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      
      <div className="space-y-3">
        <div>
          <h3 className={`font-medium ${isDark ? 'text-white group-hover:text-green-400' : 'text-gray-900 group-hover:text-green-600'} transition-colors`}>
            {contact.name}
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{contact.position}</p>
          {contact.company && (
            <div className={`flex items-center mt-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              <Building size={12} className="mr-1" />
              {contact.company}
            </div>
          )}
        </div>
        
        <div className={`flex items-center space-x-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
          <span>Source:</span>
          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{contact.source}</span>
        </div>
        
        <div className="flex flex-wrap gap-1">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
            {contact.status}
          </span>
          {contact.tags.slice(0, 2).map((tag, i) => (
            <span
              key={i}
              className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <button className={`p-2 ${isDark ? 'bg-white/10 hover:bg-green-400/20' : 'bg-gray-100 hover:bg-green-100'} rounded-lg transition-colors`}>
            <Mail className={`h-4 w-4 ${isDark ? 'text-gray-400 hover:text-green-400' : 'text-gray-500 hover:text-green-600'}`} />
          </button>
          
          {/* Video/Audio Call Buttons */}
          <CallButton 
            contact={contact} 
            variant="icon" 
            size="md" 
          />
        </div>
      </div>
    </div>
  );
};

export default ContactCard;