import React, { createContext, useContext, useState, useEffect } from 'react';

interface HelpContextType {
  showTours: boolean;
  showTooltips: boolean;
  completedTours: string[];
  setShowTours: (show: boolean) => void;
  setShowTooltips: (show: boolean) => void;
  markTourCompleted: (tourId: string) => void;
  isTourCompleted: (tourId: string) => boolean;
  startTour: (tourId: string) => void;
  activeTour: string | null;
  setActiveTour: (tourId: string | null) => void;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export const useHelp = () => {
  const context = useContext(HelpContext);
  if (!context) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  return context;
};

interface HelpProviderProps {
  children: React.ReactNode;
}

export const HelpProvider: React.FC<HelpProviderProps> = ({ children }) => {
  const [showTours, setShowTours] = useState(true);
  const [showTooltips, setShowTooltips] = useState(true);
  const [completedTours, setCompletedTours] = useState<string[]>([]);
  const [activeTour, setActiveTour] = useState<string | null>(null);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedShowTours = localStorage.getItem('help-show-tours');
    const savedShowTooltips = localStorage.getItem('help-show-tooltips');
    const savedCompletedTours = localStorage.getItem('help-completed-tours');

    if (savedShowTours !== null) {
      setShowTours(JSON.parse(savedShowTours));
    }
    if (savedShowTooltips !== null) {
      setShowTooltips(JSON.parse(savedShowTooltips));
    }
    if (savedCompletedTours) {
      setCompletedTours(JSON.parse(savedCompletedTours));
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('help-show-tours', JSON.stringify(showTours));
  }, [showTours]);

  useEffect(() => {
    localStorage.setItem('help-show-tooltips', JSON.stringify(showTooltips));
  }, [showTooltips]);

  useEffect(() => {
    localStorage.setItem('help-completed-tours', JSON.stringify(completedTours));
  }, [completedTours]);

  const markTourCompleted = (tourId: string) => {
    setCompletedTours(prev => {
      if (!prev.includes(tourId)) {
        return [...prev, tourId];
      }
      return prev;
    });
    setActiveTour(null);
  };

  const isTourCompleted = (tourId: string) => {
    return completedTours.includes(tourId);
  };

  const startTour = (tourId: string) => {
    if (showTours && !isTourCompleted(tourId)) {
      setActiveTour(tourId);
    }
  };

  const value: HelpContextType = {
    showTours,
    showTooltips,
    completedTours,
    setShowTours,
    setShowTooltips,
    markTourCompleted,
    isTourCompleted,
    startTour,
    activeTour,
    setActiveTour
  };

  return (
    <HelpContext.Provider value={value}>
      {children}
    </HelpContext.Provider>
  );
};

// Predefined tours for different pages
export const tourData = {
  dashboard: {
    id: 'dashboard',
    steps: [
      {
        id: 'welcome',
        target: '[data-tour="dashboard-welcome"]',
        title: 'Welcome to Smart CRM!',
        content: 'This is your main dashboard where you can get an overview of your business performance.',
        placement: 'bottom' as const,
        highlight: true
      },
      {
        id: 'quick-actions',
        target: '[data-tour="quick-actions"]',
        title: 'Quick Actions',
        content: 'Use these buttons to quickly create new contacts, deals, or schedule meetings.',
        placement: 'bottom' as const,
        action: {
          type: 'click' as const,
          text: 'Try clicking "New Contact" to create your first contact'
        },
        highlight: true
      },
      {
        id: 'ai-tools',
        target: '[data-tour="ai-tools-nav"]',
        title: 'AI Tools',
        content: 'Access powerful AI features like email composition, business analysis, and smart search.',
        placement: 'bottom' as const,
        highlight: true
      },
      {
        id: 'navigation',
        target: '[data-tour="main-nav"]',
        title: 'Navigation',
        content: 'Navigate between different sections: Contacts, Deals, Tasks, and AI Goals.',
        placement: 'right' as const,
        highlight: true
      }
    ]
  },
  contacts: {
    id: 'contacts',
    steps: [
      {
        id: 'contact-list',
        target: '[data-tour="contact-list"]',
        title: 'Contact Management',
        content: 'View and manage all your contacts here. Each contact card shows key information and AI insights.',
        placement: 'top' as const,
        highlight: true
      },
      {
        id: 'ai-actions',
        target: '[data-tour="contact-ai-actions"]',
        title: 'AI-Powered Actions',
        content: 'Use AI to score leads, personalize emails, and research prospects automatically.',
        placement: 'top' as const,
        action: {
          type: 'hover' as const,
          text: 'Hover over the AI action buttons to see what they do'
        },
        highlight: true
      },
      {
        id: 'contact-details',
        target: '[data-tour="contact-card"]',
        title: 'Contact Details',
        content: 'Click on any contact to view detailed information and take actions.',
        placement: 'left' as const,
        action: {
          type: 'click' as const,
          text: 'Click on a contact card to see their full profile'
        },
        highlight: true
      }
    ]
  },
  aiGoals: {
    id: 'ai-goals',
    steps: [
      {
        id: 'goals-overview',
        target: '[data-tour="goals-overview"]',
        title: 'AI Goals System',
        content: 'Automate your business processes with AI-powered goals. Each goal represents a complete workflow.',
        placement: 'bottom' as const,
        highlight: true
      },
      {
        id: 'goal-categories',
        target: '[data-tour="goal-filters"]',
        title: 'Goal Categories',
        content: 'Filter goals by category: Sales, Marketing, Analytics, and more to find what you need.',
        placement: 'bottom' as const,
        highlight: true
      },
      {
        id: 'goal-execution',
        target: '[data-tour="goal-card"]',
        title: 'Execute Goals',
        content: 'Click on any goal to see details and execute it. Watch as AI agents work together to complete tasks.',
        placement: 'top' as const,
        action: {
          type: 'click' as const,
          text: 'Click on a goal card to see how it works'
        },
        highlight: true
      }
    ]
  }
};

export default HelpProvider;