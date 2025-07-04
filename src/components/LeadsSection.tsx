import React from 'react';
import { useContactStore } from '../store/contactStore';
import ContactCard from './ContactCard';
import { Plus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const LeadsSection = () => {
  const { contacts } = useContactStore();
  const { isDark } = useTheme();
  
  // Get first 4 contacts as new leads
  const newLeads = Object.values(contacts).slice(0, 4);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>New Leads</h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{newLeads.length} active leads</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {newLeads.filter(lead => lead.status === 'hot').length} hot
          </span>
          <button className={`px-4 py-2 ${isDark ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-green-100 text-green-700 border-green-200'} border rounded-lg hover:${isDark ? 'bg-green-500/30' : 'bg-green-200'} transition-colors flex items-center`}>
            <Plus size={16} className="mr-1" />
            Add Lead
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {newLeads.map((lead) => (
          <ContactCard key={lead.id} contact={lead} />
        ))}
      </div>
    </div>
  );
};

export default LeadsSection;