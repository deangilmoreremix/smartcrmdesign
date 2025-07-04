import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { BarChart3, TrendingUp, Calendar, Search, Bell, User } from 'lucide-react';

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  title = 'Dashboard Overview',
  subtitle = 'Welcome back! Here\'s an overview of your sales performance'
}) => {
  const { isDark } = useTheme();
  
  // Get current date
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{subtitle}</p>
        </div>
        
        <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm flex items-center`}>
          <Calendar size={16} className="mr-2" />
          {formattedDate}
        </div>
      </div>
      
      {/* KPI Summary */}
      <div className={`mt-6 p-4 rounded-xl border ${
        isDark 
          ? 'border-white/10 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10' 
          : 'border-blue-100 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${
              isDark ? 'bg-blue-500/20' : 'bg-blue-100'
            } mr-3`}>
              <BarChart3 className={`h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Monthly Revenue
              </div>
              <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                $247,890
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${
              isDark ? 'bg-purple-500/20' : 'bg-purple-100'
            } mr-3`}>
              <TrendingUp className={`h-6 w-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Growth Rate
              </div>
              <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                +12.5%
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${
              isDark ? 'bg-green-500/20' : 'bg-green-100'
            } mr-3`}>
              <User className={`h-6 w-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                New Customers
              </div>
              <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                34
              </div>
            </div>
          </div>
          
          <div className={`px-4 py-2 rounded-lg ${
            isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-white hover:bg-gray-50'
          } flex items-center space-x-2 cursor-pointer transition-colors`}>
            <Search size={16} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Search analytics...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;