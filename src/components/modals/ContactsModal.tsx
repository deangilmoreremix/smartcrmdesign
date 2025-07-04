import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { X, Search, User, UserPlus, Filter, MoreHorizontal, Check, Trash } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { useContactStore } from '../../store/contactStore';
import { getInitials } from '../../utils/avatars';

interface ContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContact?: (contactId: string) => void;
  selectionMode?: boolean;
}

const ContactsModal: React.FC<ContactsModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelectContact,
  selectionMode = false
}) => {
  const { isDark } = useTheme();
  const { contacts } = useContactStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'hot' | 'warm' | 'cold'>('all');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  if (!isOpen) return null;

  // Filter contacts based on search and filter
  const filteredContacts = Object.values(contacts).filter(contact => {
    const matchesSearch = searchQuery === '' || 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.company && contact.company.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || contact.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Toggle contact selection
  const toggleContactSelection = (contactId: string) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId));
    } else {
      setSelectedContacts([...selectedContacts, contactId]);
    }
  };

  // Handle contact click
  const handleContactClick = (contactId: string) => {
    if (selectionMode) {
      toggleContactSelection(contactId);
    } else if (onSelectContact) {
      onSelectContact(contactId);
      onClose();
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-800';
      case 'warm': return isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-800';
      case 'cold': return isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-800';
      default: return isDark ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto flex justify-center items-center bg-black bg-opacity-50">
      <div 
        className={`relative w-full max-w-3xl mx-4 rounded-xl shadow-2xl ${
          isDark ? 'bg-gray-900' : 'bg-white'
        } max-h-[90vh] flex flex-col`}
      >
        {/* Header */}
        <div className={`p-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'} flex items-center justify-between`}>
          <div className="flex items-center">
            <User className={`mr-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} size={20} />
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {selectionMode ? 'Select Contacts' : 'Contacts'}
            </h2>
            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
              isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}>
              {filteredContacts.length}
            </span>
          </div>
          
          <button 
            onClick={onClose} 
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            }`}
          >
            <X size={20} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
          </button>
        </div>
        
        {/* Search and Filters */}
        <div className={`p-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`} size={16} />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-800 border-white/10 text-white placeholder:text-gray-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                } focus:outline-none focus:ring-2 ${
                  isDark ? 'focus:ring-blue-500' : 'focus:ring-blue-500'
                }`}
              />
            </div>
            
            <div className="flex gap-2">
              {['all', 'hot', 'warm', 'cold'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter as any)}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    selectedFilter === filter 
                      ? isDark 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-blue-500 text-white'
                      : isDark 
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
              
              <button className={`p-2 rounded-lg ${
                isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
                <Filter size={16} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.length === 0 ? (
            <div className="p-8 text-center">
              <User size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                No contacts found
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {searchQuery ? `No results for "${searchQuery}"` : 'Try adjusting your search or filters'}
              </p>
            </div>
          ) : (
            <div className={`divide-y ${isDark ? 'divide-white/10' : 'divide-gray-200'}`}>
              {filteredContacts.map((contact) => (
                <div 
                  key={contact.id}
                  onClick={() => handleContactClick(contact.id)}
                  className={`p-4 flex items-center hover:${
                    isDark ? 'bg-white/5' : 'bg-gray-50'
                  } transition-colors cursor-pointer`}
                >
                  {selectionMode && (
                    <div className="mr-3">
                      <div className={`w-5 h-5 rounded-sm border flex items-center justify-center ${
                        selectedContacts.includes(contact.id)
                          ? 'bg-blue-500 border-blue-500'
                          : isDark 
                            ? 'border-gray-600' 
                            : 'border-gray-300'
                      }`}>
                        {selectedContacts.includes(contact.id) && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>
                    </div>
                  )}
                  
                  <Avatar
                    src={contact.avatar}
                    alt={contact.name}
                    size="md"
                    fallback={getInitials(contact.name)}
                    className="mr-4"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {contact.name}
                      </h3>
                      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getStatusColor(contact.status)}`}>
                        {contact.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      {contact.position && (
                        <span className={`truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {contact.position}
                          {contact.company && ' at '}
                        </span>
                      )}
                      
                      {contact.company && (
                        <span className={`truncate font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {contact.company}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center mt-1 text-xs">
                      <Mail className={`w-3.5 h-3.5 mr-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {contact.email}
                      </span>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle more options
                      }}
                      className={`p-2 rounded-full ${
                        isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200'
                      }`}
                    >
                      <MoreHorizontal size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer Actions */}
        <div className={`p-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'} flex items-center justify-between`}>
          {selectionMode ? (
            <>
              <div className="text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                  {selectedContacts.length} selected
                </span>
              </div>
              
              <div className="flex gap-3">
                <button className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                  isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  <Trash size={16} />
                  <span>Delete</span>
                </button>
                
                <button className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-blue-600">
                  <Check size={16} />
                  <span>Apply</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div></div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Close
                </button>
                
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-blue-600">
                  <UserPlus size={16} />
                  <span>Add Contact</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactsModal;

export { ContactsModal }