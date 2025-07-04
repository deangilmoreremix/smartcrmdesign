import React, { useState } from 'react';
import { Building2, Plus, Edit3, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useContactStore } from '../store/contactStore';
import CompanyLogoUploader from './CompanyLogoUploader';
import Avatar from './ui/Avatar';
import { getInitials } from '../utils/avatars';

interface Company {
  id: string;
  name: string;
  logo?: string;
  contactsCount: number;
  dealsCount: number;
}

const CompanyLogoManager: React.FC = () => {
  const { isDark } = useTheme();
  const { contacts } = useContactStore();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showUploader, setShowUploader] = useState(false);

  // Extract unique companies from contacts
  const companies: Company[] = React.useMemo(() => {
    const companyMap = new Map<string, Company>();
    
    Object.values(contacts).forEach(contact => {
      if (contact.company) {
        const existing = companyMap.get(contact.company);
        if (existing) {
          existing.contactsCount++;
        } else {
          companyMap.set(contact.company, {
            id: contact.company.toLowerCase().replace(/\s+/g, '-'),
            name: contact.company,
            logo: '', // This would come from customer database
            contactsCount: 1,
            dealsCount: 0 // This would be calculated from deals
          });
        }
      }
    });
    
    return Array.from(companyMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [contacts]);

  const handleUploadSuccess = (logoUrl: string) => {
    if (selectedCompany) {
      // Update the company logo in local state
      setSelectedCompany(prev => prev ? { ...prev, logo: logoUrl } : null);
      
      // Close uploader
      setShowUploader(false);
      
      // You could also update a companies store here if you had one
      console.log(`Logo updated for ${selectedCompany.name}: ${logoUrl}`);
    }
  };

  const handleUploadError = (error: string) => {
    console.error('Logo upload failed:', error);
  };

  if (showUploader && selectedCompany) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowUploader(false)}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              ←
            </button>
            <div>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Upload Logo for {selectedCompany.name}
              </h2>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {selectedCompany.contactsCount} contacts • {selectedCompany.dealsCount} deals
              </p>
            </div>
          </div>
        </div>

        {/* Logo Uploader */}
        <CompanyLogoUploader
          customerId={selectedCompany.id}
          currentLogoUrl={selectedCompany.logo}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          className="max-w-2xl"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl ${
            isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
          }`}>
            <Building2 size={20} />
          </div>
          <div>
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Company Logo Management
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage logos for {companies.length} companies
            </p>
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((company) => (
          <div
            key={company.id}
            className={`p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
              isDark 
                ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' 
                : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md'
            }`}
            onClick={() => {
              setSelectedCompany(company);
              setShowUploader(true);
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Avatar
                  src={company.logo}
                  alt={company.name}
                  size="lg"
                  fallback={getInitials(company.name)}
                  className="border-2 border-white/20"
                />
                <div className="flex-1">
                  <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {company.name}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {company.contactsCount} contacts
                  </p>
                </div>
              </div>
              <button
                className={`p-1 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${
                  isDark 
                    ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCompany(company);
                  setShowUploader(true);
                }}
              >
                <Edit3 size={14} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  company.logo 
                    ? (isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-800')
                    : (isDark ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600')
                }`}>
                  {company.logo ? 'Has Logo' : 'No Logo'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{company.dealsCount} deals</span>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Company Card */}
        <div
          className={`p-4 rounded-xl border-2 border-dashed transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
            isDark 
              ? 'border-white/20 hover:border-white/40 hover:bg-white/5' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
              isDark ? 'bg-white/10' : 'bg-gray-100'
            }`}>
              <Plus className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Add New Company
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Create company profile
            </p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {companies.length === 0 && (
        <div className="text-center py-12">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
            isDark ? 'bg-white/10' : 'bg-gray-100'
          }`}>
            <Building2 className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            No Companies Found
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
            Companies will appear here as you add contacts with company information.
          </p>
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
            Add First Company
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyLogoManager;