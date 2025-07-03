import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  Settings, 
  ExternalLink,
  Play,
  Pause,
  RefreshCw,
  Shield,
  Zap,
  Mail,
  MessageSquare,
  Calendar,
  Share2,
  Phone,
  FileText,
  Database,
  Globe,
  Link,
  Plus,
  Info
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  isActive: boolean;
  usageCount: number;
  lastUsed?: Date;
  features: string[];
  setupRequired: boolean;
  apiEndpoint?: string;
}

interface ComposioIntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIntegrationToggle?: (integrationId: string, enabled: boolean) => void;
  onIntegrationConnect?: (integrationId: string) => void;
}

const ComposioIntegrationsModal: React.FC<ComposioIntegrationsModalProps> = ({
  isOpen,
  onClose,
  onIntegrationToggle,
  onIntegrationConnect
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Available Composio integrations
  const availableIntegrations: Integration[] = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Send messages, connect with prospects, and manage professional network',
      category: 'social',
      icon: <Share2 className="h-5 w-5" />,
      status: 'connected',
      isActive: true,
      usageCount: 24,
      lastUsed: new Date(),
      features: ['Send Messages', 'Connect Requests', 'Profile Access', 'Company Research'],
      setupRequired: false,
      apiEndpoint: '/api/composio/linkedin'
    },
    {
      id: 'email',
      name: 'Email (SMTP)',
      description: 'Automated email sending and tracking for outreach campaigns',
      category: 'communication',
      icon: <Mail className="h-5 w-5" />,
      status: 'connected',
      isActive: true,
      usageCount: 156,
      lastUsed: new Date(Date.now() - 3600000),
      features: ['Send Emails', 'Template Management', 'Open Tracking', 'Reply Detection'],
      setupRequired: false,
      apiEndpoint: '/api/composio/email'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      description: 'Send WhatsApp messages and manage conversations',
      category: 'communication',
      icon: <MessageSquare className="h-5 w-5" />,
      status: 'disconnected',
      isActive: false,
      usageCount: 0,
      features: ['Send Messages', 'Media Sharing', 'Template Messages', 'Status Updates'],
      setupRequired: true,
      apiEndpoint: '/api/composio/whatsapp'
    },
    {
      id: 'calendar',
      name: 'Google Calendar',
      description: 'Schedule meetings and manage calendar events automatically',
      category: 'productivity',
      icon: <Calendar className="h-5 w-5" />,
      status: 'connected',
      isActive: true,
      usageCount: 42,
      lastUsed: new Date(Date.now() - 7200000),
      features: ['Create Events', 'Schedule Meetings', 'Availability Check', 'Reminders'],
      setupRequired: false,
      apiEndpoint: '/api/composio/calendar'
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      description: 'Post updates, engage with content, and build social presence',
      category: 'social',
      icon: <Globe className="h-5 w-5" />,
      status: 'connected',
      isActive: true,
      usageCount: 18,
      lastUsed: new Date(Date.now() - 1800000),
      features: ['Post Tweets', 'Schedule Content', 'Engage with Posts', 'Analytics'],
      setupRequired: false,
      apiEndpoint: '/api/composio/twitter'
    },
    {
      id: 'sms',
      name: 'SMS (Twilio)',
      description: 'Send SMS messages for instant communication',
      category: 'communication',
      icon: <Phone className="h-5 w-5" />,
      status: 'error',
      isActive: false,
      usageCount: 8,
      lastUsed: new Date(Date.now() - 86400000),
      features: ['Send SMS', 'Delivery Status', 'Two-way Messaging', 'Shortcodes'],
      setupRequired: true,
      apiEndpoint: '/api/composio/sms'
    },
    {
      id: 'reddit',
      name: 'Reddit',
      description: 'Engage with communities and share content on Reddit',
      category: 'social',
      icon: <FileText className="h-5 w-5" />,
      status: 'disconnected',
      isActive: false,
      usageCount: 0,
      features: ['Post Content', 'Comment on Posts', 'Community Management', 'Analytics'],
      setupRequired: true,
      apiEndpoint: '/api/composio/reddit'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Team communication and notifications',
      category: 'productivity',
      icon: <MessageSquare className="h-5 w-5" />,
      status: 'disconnected',
      isActive: false,
      usageCount: 0,
      features: ['Send Messages', 'Channel Management', 'File Sharing', 'Notifications'],
      setupRequired: true,
      apiEndpoint: '/api/composio/slack'
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'CRM integration and contact management',
      category: 'crm',
      icon: <Database className="h-5 w-5" />,
      status: 'disconnected',
      isActive: false,
      usageCount: 0,
      features: ['Contact Sync', 'Deal Management', 'Email Integration', 'Analytics'],
      setupRequired: true,
      apiEndpoint: '/api/composio/hubspot'
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'Enterprise CRM integration and automation',
      category: 'crm',
      icon: <Shield className="h-5 w-5" />,
      status: 'disconnected',
      isActive: false,
      usageCount: 0,
      features: ['Lead Management', 'Opportunity Tracking', 'Custom Objects', 'Reports'],
      setupRequired: true,
      apiEndpoint: '/api/composio/salesforce'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Tools', count: availableIntegrations.length },
    { id: 'communication', name: 'Communication', count: availableIntegrations.filter(i => i.category === 'communication').length },
    { id: 'social', name: 'Social Media', count: availableIntegrations.filter(i => i.category === 'social').length },
    { id: 'productivity', name: 'Productivity', count: availableIntegrations.filter(i => i.category === 'productivity').length },
    { id: 'crm', name: 'CRM', count: availableIntegrations.filter(i => i.category === 'crm').length }
  ];

  useEffect(() => {
    setIntegrations(availableIntegrations);
  }, []);

  // Filter integrations
  const filteredIntegrations = integrations.filter(integration => {
    const categoryMatch = selectedCategory === 'all' || integration.category === selectedCategory;
    const searchMatch = searchQuery === '' || 
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'disconnected': return 'text-gray-600 bg-gray-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      case 'pending': return <RefreshCw className="h-4 w-4 animate-spin" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleToggleIntegration = async (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (!integration) return;

    if (integration.status === 'disconnected') {
      // Connect integration
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setIntegrations(prev => prev.map(i => 
          i.id === integrationId 
            ? { ...i, status: 'connected' as const, isActive: true }
            : i
        ));
        
        onIntegrationConnect?.(integrationId);
      } catch (error) {
        console.error('Failed to connect integration:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Toggle active state
      setIntegrations(prev => prev.map(i => 
        i.id === integrationId 
          ? { ...i, isActive: !i.isActive }
          : i
      ));
      
      onIntegrationToggle?.(integrationId, !integration.isActive);
    }
  };

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const activeCount = integrations.filter(i => i.isActive).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-5xl h-full max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="relative z-20 flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                <Link className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Composio Integrations</h1>
                <p className="text-gray-600">Manage your external tool connections and automations</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Stats */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">{connectedCount} Connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">{activeCount} Active</span>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all duration-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search integrations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Settings className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Categories</h3>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
              <div className="p-6">
                {/* Info Banner */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-800">Composio Integration Platform</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Connect external tools to automate your workflow. Each integration enables AI agents to perform real actions on your behalf.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Integrations Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredIntegrations.map((integration) => (
                    <div
                      key={integration.id}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {integration.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                            <p className="text-sm text-gray-600">{integration.description}</p>
                          </div>
                        </div>
                        
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                          {getStatusIcon(integration.status)}
                          <span className="capitalize">{integration.status}</span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Features</h4>
                        <div className="flex flex-wrap gap-1">
                          {integration.features.slice(0, 3).map((feature, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                            >
                              {feature}
                            </span>
                          ))}
                          {integration.features.length > 3 && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              +{integration.features.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Usage Stats */}
                      {integration.status === 'connected' && (
                        <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Usage</span>
                            <div className="font-medium text-gray-900">{integration.usageCount} times</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Last Used</span>
                            <div className="font-medium text-gray-900">
                              {integration.lastUsed ? new Intl.RelativeTimeFormat().format(
                                Math.round((integration.lastUsed.getTime() - Date.now()) / (1000 * 60 * 60)), 'hour'
                              ) : 'Never'}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        {integration.status === 'disconnected' ? (
                          <button
                            onClick={() => handleToggleIntegration(integration.id)}
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                          >
                            {loading ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                            Connect
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleToggleIntegration(integration.id)}
                              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                integration.isActive
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {integration.isActive ? (
                                <>
                                  <Pause className="h-4 w-4" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </button>
                            
                            <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                              <Settings className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Setup Required Warning */}
                      {integration.setupRequired && integration.status === 'disconnected' && (
                        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                          <div className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Additional setup required after connection
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {filteredIntegrations.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-2">
                      <Settings className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations found</h3>
                    <p className="text-gray-600">Try adjusting your search or category filter.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposioIntegrationsModal;