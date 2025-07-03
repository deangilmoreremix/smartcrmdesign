import React, { useState, useEffect } from 'react';
import { useFormStore, FormSubmission } from '../../store/formStore';
import { 
  Download, 
  Mail, 
  Phone, 
  Calendar, 
  Search, 
  Filter, 
  User, 
  Eye, 
  X, 
  ArrowDown, 
  ArrowUp 
} from 'lucide-react';
import { CSVLink } from 'react-csv';

interface FormSubmissionsViewProps {
  formId: string;
}

const FormSubmissionsView: React.FC<FormSubmissionsViewProps> = ({ formId }) => {
  const { forms, getFormSubmissions } = useFormStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('submittedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const form = forms[formId];
  const submissions = getFormSubmissions(formId);
  
  // Filter submissions by search term
  const filteredSubmissions = submissions.filter(submission => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const contactName = submission.contact?.name?.toLowerCase() || '';
    const contactEmail = submission.contact?.email?.toLowerCase() || '';
    
    // Search in contact name, email, or any data field
    return (
      contactName.includes(searchLower) ||
      contactEmail.includes(searchLower) ||
      Object.values(submission.data).some(value => 
        String(value).toLowerCase().includes(searchLower)
      )
    );
  });
  
  // Sort submissions
  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    if (sortField === 'submittedAt') {
      return sortDirection === 'asc' 
        ? a.submittedAt.getTime() - b.submittedAt.getTime()
        : b.submittedAt.getTime() - a.submittedAt.getTime();
    }
    
    if (sortField === 'contact.name') {
      const aName = a.contact?.name || '';
      const bName = b.contact?.name || '';
      return sortDirection === 'asc' 
        ? aName.localeCompare(bName)
        : bName.localeCompare(aName);
    }
    
    if (sortField === 'contact.email') {
      const aEmail = a.contact?.email || '';
      const bEmail = b.contact?.email || '';
      return sortDirection === 'asc' 
        ? aEmail.localeCompare(bEmail)
        : bEmail.localeCompare(aEmail);
    }
    
    return 0;
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedSubmissions.length / itemsPerPage);
  const paginatedSubmissions = sortedSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Format date and time
  const formatDateTime = (date: Date) => {
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };
  
  // Toggle sort
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // View submission details
  const viewSubmissionDetail = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setShowDetailModal(true);
  };
  
  // Prepare data for CSV export
  const exportData = sortedSubmissions.map(submission => {
    // Start with contact information
    const exportRow: Record<string, any> = {
      'Submission Date': formatDateTime(submission.submittedAt),
      'Name': submission.contact?.name || '',
      'Email': submission.contact?.email || '',
      'Phone': submission.contact?.phone || ''
    };
    
    // Add all form fields
    Object.entries(submission.data).forEach(([key, value]) => {
      exportRow[key] = Array.isArray(value) ? value.join(', ') : value;
    });
    
    return exportRow;
  });
  
  if (!form) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        Form not found
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-lg font-medium">Form Submissions ({submissions.length})</h3>
          
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input 
                type="text"
                placeholder="Search submissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {filteredSubmissions.length > 0 && (
              <CSVLink
                data={exportData}
                filename={`${form.name.replace(/\s+/g, '_')}_submissions.csv`}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download size={16} className="mr-1.5" />
                Export
              </CSVLink>
            )}
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {filteredSubmissions.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('contact.name')}
                >
                  <div className="flex items-center">
                    <span>Contact</span>
                    {sortField === 'contact.name' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp size={14} className="ml-1" /> : 
                        <ArrowDown size={14} className="ml-1" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Form Responses
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('submittedAt')}
                >
                  <div className="flex items-center">
                    <span>Submitted At</span>
                    {sortField === 'submittedAt' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp size={14} className="ml-1" /> : 
                        <ArrowDown size={14} className="ml-1" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referrer
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedSubmissions.map(submission => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {submission.contact?.name && (
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
                          <User size={16} />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{submission.contact.name}</div>
                          <div className="text-sm text-gray-500">{submission.contact.email}</div>
                        </div>
                      </div>
                    )}
                    {!submission.contact?.name && submission.contact?.email && (
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                          <Mail size={16} />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm text-gray-900">{submission.contact.email}</div>
                        </div>
                      </div>
                    )}
                    {!submission.contact?.name && !submission.contact?.email && (
                      <div className="text-sm text-gray-500">Anonymous</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-h-20 overflow-y-auto">
                      {Object.entries(submission.data).slice(0, 3).map(([key, value], index) => (
                        <div key={index} className="text-sm">
                          <span className="text-gray-500 font-medium">{key}:</span>{' '}
                          <span className="text-gray-900">
                            {Array.isArray(value) ? value.join(', ') : String(value).substring(0, 50)}
                            {!Array.isArray(value) && String(value).length > 50 ? '...' : ''}
                          </span>
                        </div>
                      ))}
                      {Object.keys(submission.data).length > 3 && (
                        <div className="text-sm text-blue-600 cursor-pointer" onClick={() => viewSubmissionDetail(submission)}>
                          + {Object.keys(submission.data).length - 3} more fields
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={14} className="mr-1.5" />
                      {formatDateTime(submission.submittedAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {submission.referrer ? (
                      <span className="truncate max-w-[150px] inline-block">{submission.referrer}</span>
                    ) : (
                      'Direct'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => viewSubmissionDetail(submission)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-2">No submissions found</p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, sortedSubmissions.length)}
              </span>{' '}
              of <span className="font-medium">{sortedSubmissions.length}</span> results
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      )}
      
      {/* Submission Detail Modal */}
      {showDetailModal && selectedSubmission && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">Submission Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="px-6 py-4">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h4>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      {selectedSubmission.contact?.name && (
                        <div className="flex items-center">
                          <User size={16} className="text-gray-400 mr-2" />
                          <span className="text-gray-900">{selectedSubmission.contact.name}</span>
                        </div>
                      )}
                      {selectedSubmission.contact?.email && (
                        <div className="flex items-center">
                          <Mail size={16} className="text-gray-400 mr-2" />
                          <a href={`mailto:${selectedSubmission.contact.email}`} className="text-blue-600 hover:underline">
                            {selectedSubmission.contact.email}
                          </a>
                        </div>
                      )}
                      {selectedSubmission.contact?.phone && (
                        <div className="flex items-center">
                          <Phone size={16} className="text-gray-400 mr-2" />
                          <a href={`tel:${selectedSubmission.contact.phone}`} className="text-blue-600 hover:underline">
                            {selectedSubmission.contact.phone}
                          </a>
                        </div>
                      )}
                      {(!selectedSubmission.contact?.name && !selectedSubmission.contact?.email && !selectedSubmission.contact?.phone) && (
                        <div className="text-gray-500">No contact information provided</div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Form Responses</h4>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      {Object.entries(selectedSubmission.data).map(([key, value], index) => (
                        <div key={index}>
                          <span className="font-medium text-gray-700">{key}:</span>{' '}
                          <span className="text-gray-900">
                            {Array.isArray(value) ? value.join(', ') : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Submission Details</h4>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center">
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        <span className="text-gray-900">{formatDateTime(selectedSubmission.submittedAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <Globe size={16} className="text-gray-400 mr-2" />
                        <span className="text-gray-900">{selectedSubmission.referrer || 'Direct'}</span>
                      </div>
                      <div className="flex items-center">
                        <Shield size={16} className="text-gray-400 mr-2" />
                        <span className="text-gray-900">{selectedSubmission.ip || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200/60 shadow-sm text-sm font-semibold rounded-full text-gray-700 hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormSubmissionsView;

// Helper components for icons
const Globe = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const Shield = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);