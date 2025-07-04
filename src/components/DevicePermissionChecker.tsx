import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Mic, 
  Monitor, 
  AlertTriangle, 
  CheckCircle, 
  Settings,
  RefreshCw,
  X,
  Palette,
  LayoutGrid,
  RotateCcw, 
  Move3D, 
  Eye, 
  EyeOff, 
  ChevronDown,
  Check
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useDashboardLayout } from '../contexts/DashboardLayoutContext';

interface DevicePermissions {
  camera: 'granted' | 'denied' | 'prompt' | 'unknown';
  microphone: 'granted' | 'denied' | 'prompt' | 'unknown';
  screen: 'granted' | 'denied' | 'prompt' | 'unknown';
}

interface DeviceAvailability {
  cameras: MediaDeviceInfo[];
  microphones: MediaDeviceInfo[];
  speakers: MediaDeviceInfo[];
}

type SettingsTab = 'devices' | 'layout';

const DevicePermissionChecker: React.FC = () => {
  const { isDark } = useTheme();
  const { 
    sectionOrder, 
    setSectionOrder, 
    resetToDefault, 
    getSectionConfig 
  } = useDashboardLayout();
  
  const [activeTab, setActiveTab] = useState<SettingsTab>('devices');
  const [permissions, setPermissions] = useState<DevicePermissions>({
    camera: 'unknown',
    microphone: 'unknown',
    screen: 'unknown'
  });
  const [devices, setDevices] = useState<DeviceAvailability>({
    cameras: [],
    microphones: [],
    speakers: []
  });
  const [isChecking, setIsChecking] = useState(false);
  const [showChecker, setShowChecker] = useState(false);
  const [testStream, setTestStream] = useState<MediaStream | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Check permissions on component mount
  useEffect(() => {
    if (showChecker) {
      checkPermissions();
      enumerateDevices();
    }
  }, [showChecker]);

  // Cleanup test stream on unmount
  useEffect(() => {
    return () => {
      if (testStream) {
        testStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [testStream]);

  const checkPermissions = async () => {
    setIsChecking(true);
    
    try {
      // Check camera permission
      const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      
      // Check microphone permission
      const microphonePermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      
      setPermissions({
        camera: cameraPermission.state,
        microphone: microphonePermission.state,
        screen: 'prompt' // Screen sharing is always prompt-based
      });
      
    } catch (error) {
      console.error('Error checking permissions:', error);
      // Fallback to testing with getUserMedia
      await testPermissions();
    } finally {
      setIsChecking(false);
    }
  };

  const testPermissions = async () => {
    const newPermissions: DevicePermissions = {
      camera: 'unknown',
      microphone: 'unknown',
      screen: 'prompt'
    };

    // Test camera
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      newPermissions.camera = 'granted';
      cameraStream.getTracks().forEach(track => track.stop());
    } catch (error) {
      newPermissions.camera = 'denied';
    }

    // Test microphone
    try {
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      newPermissions.microphone = 'granted';
      micStream.getTracks().forEach(track => track.stop());
    } catch (error) {
      newPermissions.microphone = 'denied';
    }

    setPermissions(newPermissions);
  };

  const enumerateDevices = async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      
      setDevices({
        cameras: deviceList.filter(device => device.kind === 'videoinput'),
        microphones: deviceList.filter(device => device.kind === 'audioinput'),
        speakers: deviceList.filter(device => device.kind === 'audiooutput')
      });
    } catch (error) {
      console.error('Error enumerating devices:', error);
    }
  };

  const requestPermission = async (type: 'camera' | 'microphone' | 'screen') => {
    setIsChecking(true);
    
    try {
      switch (type) {
        case 'camera':
          const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
          setTestStream(cameraStream);
          setPermissions(prev => ({ ...prev, camera: 'granted' }));
          break;
          
        case 'microphone':
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          if (testStream) {
            testStream.getTracks().forEach(track => track.stop());
          }
          setTestStream(micStream);
          setPermissions(prev => ({ ...prev, microphone: 'granted' }));
          break;
          
        case 'screen':
          const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
            video: true, 
            audio: true 
          });
          if (testStream) {
            testStream.getTracks().forEach(track => track.stop());
          }
          setTestStream(screenStream);
          setPermissions(prev => ({ ...prev, screen: 'granted' }));
          
          // Screen share automatically ends when user stops it
          screenStream.getVideoTracks()[0].addEventListener('ended', () => {
            setPermissions(prev => ({ ...prev, screen: 'prompt' }));
            setTestStream(null);
          });
          break;
      }
      
      // Re-enumerate devices after permission grant
      await enumerateDevices();
      
    } catch (error) {
      console.error(`Error requesting ${type} permission:`, error);
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setPermissions(prev => ({ ...prev, [type]: 'denied' }));
        }
      }
    } finally {
      setIsChecking(false);
    }
  };

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case 'granted': return <CheckCircle className="text-green-400" size={16} />;
      case 'denied': return <AlertTriangle className="text-red-400" size={16} />;
      case 'prompt': return <Settings className="text-yellow-400" size={16} />;
      default: return <RefreshCw className="text-gray-400" size={16} />;
    }
  };

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'granted': return isDark ? 'text-green-400' : 'text-green-600';
      case 'denied': return isDark ? 'text-red-400' : 'text-red-600';
      case 'prompt': return isDark ? 'text-yellow-400' : 'text-yellow-600';
      default: return isDark ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getPermissionText = (permission: string) => {
    switch (permission) {
      case 'granted': return 'Granted';
      case 'denied': return 'Denied';
      case 'prompt': return 'Required';
      default: return 'Unknown';
    }
  };

  // Layout settings functions
  const handleSectionToggle = (sectionId: string, enabled: boolean) => {
    if (enabled) {
      // Add section back to the order if not present
      if (!sectionOrder.includes(sectionId)) {
        setSectionOrder([...sectionOrder, sectionId]);
      }
    } else {
      // Remove section from order
      setSectionOrder(sectionOrder.filter(id => id !== sectionId));
    }
  };

  const allSections = [
    'ai-section',
    'pipeline-section', 
    'contacts-section',
    'tasks-section',
    'apps-section',
    'analytics-section'
  ];

  // Settings button
  if (!showChecker) {
    return (
      <button
        onClick={() => setShowChecker(true)}
        className={`fixed top-4 left-4 p-3 rounded-xl ${
          isDark 
            ? 'bg-gray-800/90 hover:bg-gray-700/90 border-white/10' 
            : 'bg-white/90 hover:bg-gray-50/90 border-gray-200'
        } backdrop-blur-xl border shadow-lg transition-all duration-200 z-40`}
        title="Settings"
      >
        <Settings size={20} className={`${isDark ? 'text-white' : 'text-gray-700'}`} />
      </button>
    );
  }

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className={`w-80 ${
        isDark ? 'bg-gray-900/95' : 'bg-white/95'
      } backdrop-blur-xl border ${
        isDark ? 'border-white/20' : 'border-gray-200'
      } rounded-2xl shadow-xl p-6`}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Settings
          </h3>
          <button
            onClick={() => setShowChecker(false)}
            className={`p-1 rounded-lg ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors`}
          >
            <X size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mb-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('devices')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'devices' 
                ? (isDark ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600')
                : (isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')
            }`}
          >
            <div className="flex items-center space-x-2">
              <Camera size={16} />
              <span>Device Settings</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('layout')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'layout' 
                ? (isDark ? 'text-purple-400 border-b-2 border-purple-400' : 'text-purple-600 border-b-2 border-purple-600')
                : (isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')
            }`}
          >
            <div className="flex items-center space-x-2">
              <LayoutGrid size={16} />
              <span>Layout Settings</span>
            </div>
          </button>
        </div>

        {/* Device Settings Tab */}
        {activeTab === 'devices' && (
          <div className="space-y-6">
            {/* Permission Status */}
            <div className="space-y-3 mb-6">
              {/* Camera */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Camera size={18} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Camera
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {devices.cameras.length} device(s) found
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getPermissionIcon(permissions.camera)}
                  <span className={`text-sm font-medium ${getPermissionColor(permissions.camera)}`}>
                    {getPermissionText(permissions.camera)}
                  </span>
                  {permissions.camera !== 'granted' && (
                    <button
                      onClick={() => requestPermission('camera')}
                      disabled={isChecking}
                      className={`text-xs px-2 py-1 rounded ${
                        isDark 
                          ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400' 
                          : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                      } transition-colors disabled:opacity-50`}
                    >
                      Allow
                    </button>
                  )}
                </div>
              </div>

              {/* Microphone */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mic size={18} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Microphone
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {devices.microphones.length} device(s) found
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getPermissionIcon(permissions.microphone)}
                  <span className={`text-sm font-medium ${getPermissionColor(permissions.microphone)}`}>
                    {getPermissionText(permissions.microphone)}
                  </span>
                  {permissions.microphone !== 'granted' && (
                    <button
                      onClick={() => requestPermission('microphone')}
                      disabled={isChecking}
                      className={`text-xs px-2 py-1 rounded ${
                        isDark 
                          ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400' 
                          : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                      } transition-colors disabled:opacity-50`}
                    >
                      Allow
                    </button>
                  )}
                </div>
              </div>

              {/* Screen Sharing */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Monitor size={18} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Screen Sharing
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Required for screen sharing
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getPermissionIcon(permissions.screen)}
                  <span className={`text-sm font-medium ${getPermissionColor(permissions.screen)}`}>
                    {getPermissionText(permissions.screen)}
                  </span>
                  <button
                    onClick={() => requestPermission('screen')}
                    disabled={isChecking}
                    className={`text-xs px-2 py-1 rounded ${
                      isDark 
                        ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400' 
                        : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                    } transition-colors disabled:opacity-50`}
                  >
                    Test
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={checkPermissions}
                disabled={isChecking}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                } transition-colors disabled:opacity-50`}
              >
                <RefreshCw size={14} className={isChecking ? 'animate-spin' : ''} />
                <span className="text-sm">Refresh</span>
              </button>
              <button
                onClick={() => window.open('chrome://settings/content/camera', '_blank')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg ${
                  isDark 
                    ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400' 
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                } transition-colors`}
              >
                <Settings size={14} />
                <span className="text-sm">Settings</span>
              </button>
            </div>

            {/* Status Info */}
            <div className={`mt-4 p-3 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                💡 <strong>Tip:</strong> Grant camera and microphone permissions for the best video calling experience. 
                You can manage these in your browser settings.
              </p>
            </div>

            {/* Test Stream Preview */}
            {testStream && (
              <div className="mt-4">
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <video
                    autoPlay
                    playsInline
                    muted
                    ref={(video) => {
                      if (video && testStream) {
                        video.srcObject = testStream;
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => {
                    if (testStream) {
                      testStream.getTracks().forEach(track => track.stop());
                      setTestStream(null);
                    }
                  }}
                  className={`w-full mt-2 py-2 px-3 rounded-lg text-sm ${
                    isDark 
                      ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' 
                      : 'bg-red-100 hover:bg-red-200 text-red-700'
                  } transition-colors`}
                >
                  Stop Test
                </button>
              </div>
            )}
          </div>
        )}

        {/* Layout Settings Tab */}
        {activeTab === 'layout' && (
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="space-y-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`w-full flex items-center justify-between p-3 rounded-lg ${
                  isDark 
                    ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400' 
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                } transition-colors`}
              >
                <div className="flex items-center space-x-2">
                  <Move3D size={16} />
                  <span className="text-sm font-medium">Drag & Drop Mode</span>
                </div>
                <div className={`w-5 h-5 rounded border-2 ${
                  showPreview 
                    ? 'bg-blue-500 border-blue-500' 
                    : `border-gray-400 ${isDark ? 'dark:border-gray-600' : ''}`
                } flex items-center justify-center`}>
                  {showPreview && <Check size={12} className="text-white" />}
                </div>
              </button>

              <button
                onClick={resetToDefault}
                className={`w-full flex items-center justify-center space-x-2 p-3 rounded-lg ${
                  isDark 
                    ? 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400' 
                    : 'bg-orange-50 hover:bg-orange-100 text-orange-700'
                } transition-colors`}
              >
                <RotateCcw size={16} />
                <span className="text-sm font-medium">Reset Layout</span>
              </button>
            </div>

            {/* Section Visibility Controls */}
            <div className="border-t border-gray-200 dark:border-white/10 pt-4">
              <h4 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                Section Visibility
              </h4>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {allSections.map((sectionId) => {
                  const config = getSectionConfig(sectionId);
                  const isEnabled = sectionOrder.includes(sectionId);
                  
                  if (!config) return null;
                  
                  return (
                    <div
                      key={sectionId}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                      } transition-colors`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${config.color}`}></div>
                        <div>
                          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {config.title}
                          </p>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {config.description}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleSectionToggle(sectionId, !isEnabled)}
                        className={`p-1 rounded-md transition-colors ${
                          isEnabled 
                            ? `${isDark ? 'text-green-400 hover:bg-green-400/20' : 'text-green-600 hover:bg-green-100'}` 
                            : `${isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-100'}`
                        }`}
                        title={isEnabled ? 'Hide Section' : 'Show Section'}
                      >
                        {isEnabled ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section Order Preview */}
            {showPreview && (
              <div className="border-t border-gray-200 dark:border-white/10 pt-4 mt-4">
                <h4 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                  Current Order
                </h4>
                <div className="space-y-1">
                  {sectionOrder.map((sectionId, index) => {
                    const config = getSectionConfig(sectionId);
                    if (!config) return null;
                    
                    return (
                      <div
                        key={sectionId}
                        className={`flex items-center space-x-3 p-2 rounded-md ${
                          isDark ? 'bg-white/5' : 'bg-gray-50'
                        }`}
                      >
                        <span className={`text-xs font-mono ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {index + 1}
                        </span>
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.color}`}></div>
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {config.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className={`mt-4 p-3 rounded-lg ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'} border`}>
              <p className={`text-xs ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                💡 <strong>Tip:</strong> Hover over any section and drag the handle (⋮⋮) to reorder. Changes are saved automatically.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevicePermissionChecker;