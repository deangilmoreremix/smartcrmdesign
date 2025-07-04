import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import VideoCallOverlay from './components/VideoCallOverlay';
import VideoCallPreviewWidget from './components/VideoCallPreviewWidget';
import DevicePermissionChecker from './components/DevicePermissionChecker';
import { AIToolsProvider } from './components/AIToolsProvider';
import { EnhancedHelpProvider } from './contexts/EnhancedHelpContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { DashboardLayoutProvider } from './contexts/DashboardLayoutContext';
import { VideoCallProvider } from './contexts/VideoCallContext';
import { ContactsModal } from './components/modals/ContactsModal';
import './components/styles/design-system.css';

function App() {
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);

  return (
    <ThemeProvider>
      <VideoCallProvider>
        <AIToolsProvider>
          <NavigationProvider>
            <DashboardLayoutProvider>
              <EnhancedHelpProvider>
                <div className="min-h-screen h-full w-full flex flex-col transition-all duration-300 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 bg-gradient-to-br from-gray-50 via-white to-gray-100">
                  <DevicePermissionChecker />
                  <Navbar />
                  <div className="flex-1 w-full overflow-hidden">
                    <Dashboard />
                  </div>
                  <VideoCallOverlay />
                  <VideoCallPreviewWidget />
                  
                  {/* ContactsModal rendered at the root level */}
                  <ContactsModal
                    isOpen={isContactsModalOpen}
                    onClose={() => setIsContactsModalOpen(false)}
                  />
                </div>
              </EnhancedHelpProvider>
            </DashboardLayoutProvider>
          </NavigationProvider>
        </AIToolsProvider>
      </VideoCallProvider>
    </ThemeProvider>
  );
}

export default App;