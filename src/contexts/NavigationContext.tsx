import React, { createContext, useContext } from 'react';
import { useAITools } from '../components/AIToolsProvider';

interface NavigationContextType {
  scrollToSection: (sectionId: string) => void;
  openAITool: (toolName: string) => void;
  navigateToFeature: (feature: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { openTool } = useAITools();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  const openAITool = (toolName: string) => {
    openTool(toolName);
  };

  const navigateToFeature = (feature: string) => {
    switch (feature) {
      case 'dashboard':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'contacts':
        scrollToSection('contacts-section');
        break;
      case 'pipeline':
        scrollToSection('pipeline-section');
        break;
      case 'ai-goals':
        scrollToSection('ai-section');
        break;
      case 'tasks':
        scrollToSection('tasks-section');
        break;
      case 'analytics':
        scrollToSection('analytics-section');
        break;
      case 'apps':
        scrollToSection('apps-section');
        break;
      default:
        console.log(`Navigation to ${feature} not implemented`);
    }
  };

  return (
    <NavigationContext.Provider value={{ scrollToSection, openAITool, navigateToFeature }}>
      {children}
    </NavigationContext.Provider>
  );
};