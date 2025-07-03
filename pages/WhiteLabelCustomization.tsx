import { useState, useEffect } from 'react';
import { Palette, Upload, Eye, Save, RotateCcw, Sparkles, Globe, Code, Monitor, Mail } from 'lucide-react';
import { useTenant } from '../components/TenantProvider';
import { ConditionalRender } from '../components/RoleBasedAccess';

interface BrandingConfig {
  logo?: string;
  favicon?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  companyName: string;
  tagline?: string;
  customDomain?: string;
  customCSS?: string;
  footerText?: string;
  loginPageConfig: {
    backgroundImage?: string;
    welcomeMessage?: string;
    supportEmail?: string;
  };
  emailConfig: {
    fromName?: string;
    replyToEmail?: string;
    emailSignature?: string;
    headerLogo?: string;
  };
  features: {
    showPoweredBy: boolean;
    customFavicon: boolean;
    customEmailTemplates: boolean;
    advancedBranding: boolean;
    whiteLabel: boolean;
  };
}

export default function WhiteLabelCustomization() {
  const [config, setConfig] = useState<BrandingConfig>({
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    accentColor: '#10B981',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    companyName: '',
    loginPageConfig: {},
    emailConfig: {},
    features: {
      showPoweredBy: true,
      customFavicon: false,
      customEmailTemplates: false,
      advancedBranding: false,
      whiteLabel: false,
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | 'email'>('desktop');
  const [activeTab, setActiveTab] = useState('basic');

  const { tenant, applyBranding } = useTenant();

  useEffect(() => {
    fetchBrandingConfig();
  }, [tenant]);

  const fetchBrandingConfig = async () => {
    try {
      setIsLoading(true);
      if (tenant) {
        const response = await fetch(`/api/white-label/tenants/${tenant.id}/branding`);
        if (response.ok) {
          const brandingData = await response.json();
          setConfig({ ...config, ...brandingData });
        }
      }
    } catch (error) {
      console.error('Failed to fetch branding config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveBrandingConfig = async () => {
    try {
      setSaving(true);
      if (tenant) {
        const response = await fetch(`/api/white-label/tenants/${tenant.id}/branding`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config),
        });

        if (response.ok) {
          alert('Branding configuration saved successfully!');
          applyBranding(); // Apply changes immediately
        } else {
          alert('Failed to save branding configuration');
        }
      }
    } catch (error) {
      alert('Error saving branding configuration');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset to default branding? This will lose all customizations.')) {
      setConfig({
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        accentColor: '#10B981',
        backgroundColor: '#FFFFFF',
        textColor: '#1F2937',
        companyName: '',
        loginPageConfig: {},
        emailConfig: {},
        features: {
          showPoweredBy: true,
          customFavicon: false,
          customEmailTemplates: false,
          advancedBranding: false,
          whiteLabel: false,
        },
      });
    }
  };

  const uploadFile = async (file: File, type: 'logo' | 'favicon' | 'background') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const response = await fetch('/api/white-label/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { url } = await response.json();
        return url;
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
    return null;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon' | 'background') => {
    const file = event.target.files?.[0];
    if (file) {
      const url = await uploadFile(file, type);
      if (url) {
        if (type === 'logo') {
          setConfig({ ...config, logo: url });
        } else if (type === 'favicon') {
          setConfig({ ...config, favicon: url });
        } else if (type === 'background') {
          setConfig({
            ...config,
            loginPageConfig: { ...config.loginPageConfig, backgroundImage: url }
          });
        }
      }
    }
  };

  const presetThemes = [
    { name: 'Default Blue', primary: '#3B82F6', secondary: '#1E40AF', accent: '#10B981' },
    { name: 'Professional Gray', primary: '#6B7280', secondary: '#374151', accent: '#059669' },
    { name: 'Elegant Purple', primary: '#8B5CF6', secondary: '#7C3AED', accent: '#F59E0B' },
    { name: 'Modern Green', primary: '#10B981', secondary: '#059669', accent: '#3B82F6' },
    { name: 'Warm Orange', primary: '#F97316', secondary: '#EA580C', accent: '#EF4444' },
    { name: 'Dark Mode', primary: '#1F2937', secondary: '#111827', accent: '#3B82F6' },
  ];

  const applyTheme = (theme: typeof presetThemes[0]) => {
    setConfig({
      ...config,
      primaryColor: theme.primary,
      secondaryColor: theme.secondary,
      accentColor: theme.accent,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading branding configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Palette className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  White-Label Customization
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Customize your brand identity and user experience
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={resetToDefaults}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
              <button
                onClick={saveBrandingConfig}
                disabled={isSaving}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'basic', label: 'Basic Branding', icon: Palette },
                  { id: 'advanced', label: 'Advanced', icon: Sparkles },
                  { id: 'domain', label: 'Domain & URLs', icon: Globe },
                  { id: 'code', label: 'Custom Code', icon: Code },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Basic Branding Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                {/* Company Information */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Company Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={config.companyName}
                        onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Your Company Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tagline
                      </label>
                      <input
                        type="text"
                        value={config.tagline || ''}
                        onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Your company tagline"
                      />
                    </div>
                  </div>
                </div>

                {/* Logo Upload */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Logo & Assets
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Company Logo
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        {config.logo ? (
                          <img src={config.logo} alt="Logo" className="h-16 mx-auto mb-2" />
                        ) : (
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'logo')}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="cursor-pointer text-sm text-purple-600 hover:text-purple-700"
                        >
                          Upload Logo
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Favicon
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        {config.favicon ? (
                          <img src={config.favicon} alt="Favicon" className="h-8 mx-auto mb-2" />
                        ) : (
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'favicon')}
                          className="hidden"
                          id="favicon-upload"
                        />
                        <label
                          htmlFor="favicon-upload"
                          className="cursor-pointer text-sm text-purple-600 hover:text-purple-700"
                        >
                          Upload Favicon
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Color Scheme */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Color Scheme
                  </h3>
                  
                  {/* Preset Themes */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Quick Themes
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {presetThemes.map((theme) => (
                        <button
                          key={theme.name}
                          onClick={() => applyTheme(theme)}
                          className="p-3 border border-gray-200 rounded-lg hover:border-purple-300 text-left"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.primary }}></div>
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.secondary }}></div>
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.accent }}></div>
                          </div>
                          <span className="text-sm font-medium">{theme.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Colors */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Primary Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.primaryColor}
                          onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                          className="w-12 h-10 border border-gray-300 rounded"
                        />
                        <input
                          type="text"
                          value={config.primaryColor}
                          onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Secondary Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.secondaryColor}
                          onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                          className="w-12 h-10 border border-gray-300 rounded"
                        />
                        <input
                          type="text"
                          value={config.secondaryColor}
                          onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Accent Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.accentColor}
                          onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                          className="w-12 h-10 border border-gray-300 rounded"
                        />
                        <input
                          type="text"
                          value={config.accentColor}
                          onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Tab */}
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                {/* Login Page Customization */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Login Page Customization
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Welcome Message
                      </label>
                      <input
                        type="text"
                        value={config.loginPageConfig.welcomeMessage || ''}
                        onChange={(e) => setConfig({
                          ...config,
                          loginPageConfig: { ...config.loginPageConfig, welcomeMessage: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Welcome to our platform"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Background Image
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        {config.loginPageConfig.backgroundImage ? (
                          <img src={config.loginPageConfig.backgroundImage} alt="Background" className="h-20 mx-auto mb-2 object-cover rounded" />
                        ) : (
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'background')}
                          className="hidden"
                          id="background-upload"
                        />
                        <label
                          htmlFor="background-upload"
                          className="cursor-pointer text-sm text-purple-600 hover:text-purple-700"
                        >
                          Upload Background
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Configuration */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Email Branding
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        From Name
                      </label>
                      <input
                        type="text"
                        value={config.emailConfig.fromName || ''}
                        onChange={(e) => setConfig({
                          ...config,
                          emailConfig: { ...config.emailConfig, fromName: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Your Company"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Reply-To Email
                      </label>
                      <input
                        type="email"
                        value={config.emailConfig.replyToEmail || ''}
                        onChange={(e) => setConfig({
                          ...config,
                          emailConfig: { ...config.emailConfig, replyToEmail: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="noreply@yourcompany.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Feature Toggles */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    White-Label Features
                  </h3>
                  <div className="space-y-4">
                    {[
                      { key: 'showPoweredBy', label: 'Show "Powered by" branding', description: 'Display platform attribution' },
                      { key: 'customFavicon', label: 'Custom favicon support', description: 'Use your own favicon' },
                      { key: 'customEmailTemplates', label: 'Custom email templates', description: 'Branded email communications' },
                      { key: 'advancedBranding', label: 'Advanced branding options', description: 'CSS customization and more' },
                      { key: 'whiteLabel', label: 'Complete white-label mode', description: 'Remove all platform branding' },
                    ].map((feature) => (
                      <div key={feature.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{feature.label}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                        </div>
                        <button
                          onClick={() => setConfig({
                            ...config,
                            features: {
                              ...config.features,
                              [feature.key]: !config.features[feature.key as keyof typeof config.features]
                            }
                          })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            config.features[feature.key as keyof typeof config.features] ? 'bg-purple-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              config.features[feature.key as keyof typeof config.features] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Domain Tab */}
            {activeTab === 'domain' && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Domain Configuration
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Custom Domain
                    </label>
                    <input
                      type="text"
                      value={config.customDomain || ''}
                      onChange={(e) => setConfig({ ...config, customDomain: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="crm.yourcompany.com"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Point your domain's DNS to our servers to use a custom domain
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Custom Code Tab */}
            {activeTab === 'code' && (
              <ConditionalRender resource="custom_branding">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Custom CSS
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Additional CSS
                    </label>
                    <textarea
                      value={config.customCSS || ''}
                      onChange={(e) => setConfig({ ...config, customCSS: e.target.value })}
                      className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                      placeholder="/* Add your custom CSS here */"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Custom CSS will be injected into your application
                    </p>
                  </div>
                </div>
              </ConditionalRender>
            )}
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            {/* Preview Controls */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Live Preview
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-purple-100 text-purple-600' : 'text-gray-500'}`}
                  >
                    <Monitor className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-purple-100 text-purple-600' : 'text-gray-500'}`}
                  >
                    <div className="h-4 w-4 border-2 border-current rounded-sm"></div>
                  </button>
                  <button
                    onClick={() => setPreviewMode('email')}
                    className={`p-2 rounded ${previewMode === 'email' ? 'bg-purple-100 text-purple-600' : 'text-gray-500'}`}
                  >
                    <Mail className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Preview Content */}
              <div className={`border rounded-lg overflow-hidden ${
                previewMode === 'mobile' ? 'max-w-sm mx-auto' : ''
              }`}>
                {previewMode === 'desktop' || previewMode === 'mobile' ? (
                  <div 
                    className="p-6"
                    style={{ 
                      backgroundColor: config.backgroundColor,
                      color: config.textColor 
                    }}
                  >
                    {/* Header Preview */}
                    <div 
                      className="flex items-center justify-between p-4 rounded-lg mb-4"
                      style={{ backgroundColor: config.primaryColor }}
                    >
                      <div className="flex items-center gap-3">
                        {config.logo && (
                          <img src={config.logo} alt="Logo" className="h-8" />
                        )}
                        <span className="text-white font-semibold">{config.companyName || 'Your Company'}</span>
                      </div>
                    </div>

                    {/* Content Preview */}
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold" style={{ color: config.textColor }}>
                        Welcome to {config.companyName || 'Your Company'}
                      </h2>
                      {config.tagline && (
                        <p className="text-gray-600">{config.tagline}</p>
                      )}
                      
                      <button 
                        className="px-4 py-2 rounded-lg text-white font-medium"
                        style={{ backgroundColor: config.accentColor }}
                      >
                        Get Started
                      </button>
                      
                      <button 
                        className="px-4 py-2 rounded-lg font-medium ml-2"
                        style={{ 
                          backgroundColor: config.secondaryColor,
                          color: 'white'
                        }}
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Email Preview */
                  <div className="p-4 bg-gray-100">
                    <div className="bg-white rounded-lg p-6 max-w-md">
                      {config.emailConfig.headerLogo && (
                        <img src={config.emailConfig.headerLogo} alt="Logo" className="h-12 mb-4" />
                      )}
                      <h3 className="text-lg font-semibold mb-4">
                        Email from {config.emailConfig.fromName || config.companyName || 'Your Company'}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        This is how your emails will appear to customers.
                      </p>
                      <div className="border-t pt-4 text-sm text-gray-500">
                        {config.emailConfig.emailSignature || `Best regards,\n${config.companyName || 'Your Company'} Team`}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <button
                  onClick={saveBrandingConfig}
                  className="w-full p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save & Apply
                </button>
                <button
                  onClick={() => window.open('/', '_blank')}
                  className="w-full p-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Preview Live
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}