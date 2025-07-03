import React, { useState } from 'react';
import { AIInsightsPanel } from '../contacts/AIInsightsPanel';
import { AutomationPanel } from '../contacts/AutomationPanel';
import { CommunicationHub } from '../contacts/CommunicationHub';
import { ContactAnalytics } from '../contacts/ContactAnalytics';
import { ContactJourneyTimeline } from '../contacts/ContactJourneyTimeline';
import { ModernButton } from '../ui/ModernButton';
import { Contact } from '../../types/contact';
import {
  X,
  Users,
  BarChart2,
  Calendar,
  MessageSquare,
  Zap,
  ExternalLink
} from 'lucide-react';

interface ContactDetailViewProps {
  contact: Contact;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (contactId: string, updates: Partial<Contact>) => Promise<Contact>;
}

export const ContactDetailView: React.FC<ContactDetailViewProps> = ({
  contact,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<
    'insights' | 'communication' | 'journey' | 'analytics' | 'automation'
  >('insights');

  if (!isOpen) return null;

  const tabs = [
    { id: 'insights', label: 'AI Insights', icon: Users },
    { id: 'communication', label: 'Communication', icon: MessageSquare },
    { id: 'journey', label: 'Journey', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'automation', label: 'Automation', icon: Zap },
  ];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-start justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-7xl h-[95vh] overflow-hidden flex flex-col animate-slide-in shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{contact.name}</h2>
              <p className="text-gray-600">
                {contact.title} at {contact.company}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <ModernButton
              variant="outline"
              size="sm"
              onClick={() => window.open(`mailto:${contact.email}`, '_blank')}
              className="flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Contact</span>
            </ModernButton>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'insights' && <AIInsightsPanel contact={contact} />}
          {activeTab === 'communication' && <CommunicationHub contact={contact} />}
          {activeTab === 'journey' && <ContactJourneyTimeline contact={contact} />}
          {activeTab === 'analytics' && <ContactAnalytics contact={contact} />}
          {activeTab === 'automation' && <AutomationPanel contact={contact} />}
        </div>
      </div>
    </div>
  );
};

export default ContactDetailView;