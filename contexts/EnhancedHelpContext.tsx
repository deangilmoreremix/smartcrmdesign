import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TourProgress {
  tourId: string;
  currentStep: number;
  completed: boolean;
  completedAt?: Date;
  startedAt?: Date;
  skipped?: boolean;
}

interface HelpSettings {
  autoStartTours: boolean;
  showTooltipAnimations: boolean;
  tourSpeed: 'slow' | 'normal' | 'fast';
  enableKeyboardShortcuts: boolean;
  showProgressIndicators: boolean;
  enableSoundEffects: boolean;
}

interface HelpContextType {
  // Tour management
  showTours: boolean;
  completedTours: string[];
  tourProgress: Record<string, TourProgress>;
  helpSettings: HelpSettings;
  
  // Tour actions
  setShowTours: (show: boolean) => void;
  markTourCompleted: (tourId: string, skipped?: boolean) => void;
  isTourCompleted: (tourId: string) => boolean;
  resetTours: () => void;
  updateTourProgress: (tourId: string, step: number) => void;
  getTourProgress: (tourId: string) => TourProgress | undefined;
  
  // Settings
  updateHelpSettings: (settings: Partial<HelpSettings>) => void;
  
  // Analytics
  getTourAnalytics: () => {
    totalToursStarted: number;
    totalToursCompleted: number;
    averageCompletionRate: number;
    mostPopularTours: string[];
  };
}

const defaultHelpSettings: HelpSettings = {
  autoStartTours: true,
  showTooltipAnimations: true,
  tourSpeed: 'normal',
  enableKeyboardShortcuts: true,
  showProgressIndicators: true,
  enableSoundEffects: false,
};

const EnhancedHelpContext = createContext<HelpContextType | undefined>(undefined);

export const EnhancedHelpProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showTours, setShowTours] = useState(true);
  const [completedTours, setCompletedTours] = useState<string[]>([]);
  const [tourProgress, setTourProgress] = useState<Record<string, TourProgress>>({});
  const [helpSettings, setHelpSettings] = useState<HelpSettings>(defaultHelpSettings);

  // Load persisted data from localStorage
  useEffect(() => {
    try {
      const savedTours = localStorage.getItem('help-completed-tours');
      const savedProgress = localStorage.getItem('help-tour-progress');
      const savedSettings = localStorage.getItem('help-settings');
      
      if (savedTours) {
        setCompletedTours(JSON.parse(savedTours));
      }
      
      if (savedProgress) {
        setTourProgress(JSON.parse(savedProgress));
      }
      
      if (savedSettings) {
        setHelpSettings({ ...defaultHelpSettings, ...JSON.parse(savedSettings) });
      }
    } catch (error) {
      console.warn('Failed to load help system data from localStorage:', error);
    }
  }, []);

  // Persist data to localStorage
  useEffect(() => {
    localStorage.setItem('help-completed-tours', JSON.stringify(completedTours));
  }, [completedTours]);

  useEffect(() => {
    localStorage.setItem('help-tour-progress', JSON.stringify(tourProgress));
  }, [tourProgress]);

  useEffect(() => {
    localStorage.setItem('help-settings', JSON.stringify(helpSettings));
  }, [helpSettings]);

  const markTourCompleted = (tourId: string, skipped = false) => {
    setCompletedTours(prev => [...prev.filter(id => id !== tourId), tourId]);
    setTourProgress(prev => ({
      ...prev,
      [tourId]: {
        ...prev[tourId],
        tourId,
        completed: true,
        completedAt: new Date(),
        skipped,
      }
    }));
  };

  const isTourCompleted = (tourId: string) => {
    return completedTours.includes(tourId);
  };

  const resetTours = () => {
    setCompletedTours([]);
    setTourProgress({});
    localStorage.removeItem('help-completed-tours');
    localStorage.removeItem('help-tour-progress');
  };

  const updateTourProgress = (tourId: string, step: number) => {
    setTourProgress(prev => ({
      ...prev,
      [tourId]: {
        ...prev[tourId],
        tourId,
        currentStep: step,
        completed: false,
        startedAt: prev[tourId]?.startedAt || new Date(),
      }
    }));
  };

  const getTourProgress = (tourId: string) => {
    return tourProgress[tourId];
  };

  const updateHelpSettings = (newSettings: Partial<HelpSettings>) => {
    setHelpSettings(prev => ({ ...prev, ...newSettings }));
  };

  const getTourAnalytics = () => {
    const progressEntries = Object.values(tourProgress);
    const totalToursStarted = progressEntries.length;
    const totalToursCompleted = progressEntries.filter(p => p.completed).length;
    const averageCompletionRate = totalToursStarted > 0 ? (totalToursCompleted / totalToursStarted) * 100 : 0;
    
    // Count tour starts to find most popular
    const tourCounts = progressEntries.reduce((acc, progress) => {
      acc[progress.tourId] = (acc[progress.tourId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostPopularTours = Object.entries(tourCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tourId]) => tourId);

    return {
      totalToursStarted,
      totalToursCompleted,
      averageCompletionRate,
      mostPopularTours,
    };
  };

  return (
    <EnhancedHelpContext.Provider
      value={{
        showTours,
        completedTours,
        tourProgress,
        helpSettings,
        setShowTours,
        markTourCompleted,
        isTourCompleted,
        resetTours,
        updateTourProgress,
        getTourProgress,
        updateHelpSettings,
        getTourAnalytics,
      }}
    >
      {children}
    </EnhancedHelpContext.Provider>
  );
};

export const useEnhancedHelp = () => {
  const context = useContext(EnhancedHelpContext);
  if (context === undefined) {
    throw new Error('useEnhancedHelp must be used within an EnhancedHelpProvider');
  }
  return context;
};