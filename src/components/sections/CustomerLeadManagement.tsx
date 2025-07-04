import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Users, UserPlus } from 'lucide-react';
import LeadsSection from '../LeadsSection';
import NewLeadsSection from '../dashboard/NewLeadsSection';
import CustomerProfile from '../dashboard/CustomerProfile';

const CustomerLeadManagement: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mr-3">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Customer & Lead Management</h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage and nurture your prospect relationships
            </p>
          </div>
        </div>
        
        <button className={`flex items-center space-x-2 px-4 py-2 ${
          isDark ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
        } rounded-lg transition-colors`}>
          <UserPlus size={16} />
          <span>Add Contact</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Contact Cards / Leads Section - takes 2 columns */}
        <div className="lg:col-span-2">
          <NewLeadsSection />
        </div>
        
        {/* Customer Profile */}
        <div className="lg:col-span-1">
          <CustomerProfile />
        </div>
      </div>
      
      {/* Full Leads Section as fallback/alternative */}
      <div className="mb-8 hidden">
        <LeadsSection />
      </div>
    </div>
  );
};

export default CustomerLeadManagement;