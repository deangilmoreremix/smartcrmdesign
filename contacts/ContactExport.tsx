import React, { useState } from 'react';
import { useContactStore } from '../../store/contactStore';
import { Contact } from '../../types';
import { CSVLink } from 'react-csv';
import { Download, RefreshCw, CheckCircle, AlertCircle, Filter } from 'lucide-react';

interface ContactExportProps {
  className?: string;
  selectedContactIds?: string[];
}

const ContactExport: React.FC<ContactExportProps> = ({ 
  className = '', 
  selectedContactIds 
}) => {
  const { contacts } = useContactStore();
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<'all' | 'selected' | 'filtered'>('all');

  // Filter contacts based on selection
  const getContactsToExport = () => {
    const allContacts = Object.values(contacts);
    
    switch(exportFormat) {
      case 'selected':
        return selectedContactIds && selectedContactIds.length > 0 
          ? allContacts.filter(contact => selectedContactIds.includes(contact.id))
          : [];
      case 'filtered':
        // This would typically use some filter criteria, but for simplicity we'll just return all
        return allContacts;
      case 'all':
      default:
        return allContacts;
    }
  };

  // Prepare data for CSV export
  const getExportData = () => {
    const contactsToExport = getContactsToExport();
    
    return contactsToExport.map(contact => ({
      Name: contact.name,
      Email: contact.email || '',
      Phone: contact.phone || '',
      Company: contact.company || '',
      Position: contact.position || '',
      Status: contact.status || 'lead',
      Score: contact.score || '',
      LastContact: contact.lastContact ? contact.lastContact.toISOString() : '',
      Industry: contact.industry || '',
      Location: contact.location || '',
      Notes: contact.notes || ''
    }));
  };

  const csvHeaders = [
    { label: "Name", key: "Name" },
    { label: "Email", key: "Email" },
    { label: "Phone", key: "Phone" },
    { label: "Company", key: "Company" },
    { label: "Position", key: "Position" },
    { label: "Status", key: "Status" },
    { label: "Score", key: "Score" },
    { label: "Last Contact", key: "LastContact" },
    { label: "Industry", key: "Industry" },
    { label: "Location", key: "Location" },
    { label: "Notes", key: "Notes" }
  ];

  // Simulate export completion
  const handleExportStart = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      
      // Reset success message after delay
      setTimeout(() => {
        setExportSuccess(false);
      }, 3000);
    }, 1000);
  };

  const contactsToExport = getContactsToExport();
  const exportFilename = `contacts_export_${new Date().toISOString().slice(0,10)}.csv`;
  
  return (
    <div className={className}>
      {exportError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md flex items-center mb-4">
          <AlertCircle className="h-5 w-5 mr-2" />
          {exportError}
        </div>
      )}
      
      {exportSuccess && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md flex items-center mb-4">
          <CheckCircle className="h-5 w-5 mr-2" />
          Successfully exported {contactsToExport.length} contacts
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Export Options
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setExportFormat('all')}
            className={`py-2 px-3 text-sm rounded-md ${
              exportFormat === 'all'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
          >
            All Contacts
          </button>
          <button
            onClick={() => setExportFormat('selected')}
            disabled={!selectedContactIds || selectedContactIds.length === 0}
            className={`py-2 px-3 text-sm rounded-md ${
              exportFormat === 'selected'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : selectedContactIds && selectedContactIds.length > 0
                  ? 'bg-gray-100 text-gray-700 border border-gray-300'
                  : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
            }`}
          >
            Selected ({selectedContactIds?.length || 0})
          </button>
          <button
            onClick={() => setExportFormat('filtered')}
            className={`py-2 px-3 text-sm rounded-md ${
              exportFormat === 'filtered'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
          >
            <div className="flex items-center justify-center">
              <Filter size={14} className="mr-1" />
              Filtered
            </div>
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">
        {contactsToExport.length > 0
          ? `Ready to export ${contactsToExport.length} contacts`
          : 'No contacts selected for export'}
      </p>
      
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Total contacts: {Object.values(contacts).length}
        </p>
        
        {contactsToExport.length > 0 && (
          <CSVLink
            data={getExportData()}
            headers={csvHeaders}
            filename={exportFilename}
            className={`flex items-center px-4 py-2 rounded-md ${
              isExporting 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            target="_blank"
            onClick={handleExportStart}
          >
            {isExporting ? (
              <>
                <RefreshCw size={18} className="mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download size={18} className="mr-2" />
                Export to CSV
              </>
            )}
          </CSVLink>
        )}
      </div>
    </div>
  );
};

export default ContactExport;