import React, { useState, useEffect } from 'react';
import { TourProvider, useTour } from '@reactour/tour';
import { useHotkeys } from 'react-hotkeys-hook';
import { Play, Pause, SkipForward, RotateCcw, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Tour step interface
export interface TourStep {
  selector: string;
  content: React.ReactNode | string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: () => void;
  actionBefore?: () => Promise<void>;
  actionAfter?: () => Promise<void>;
  disableActions?: boolean;
  highlightedSelectors?: string[];
  mutationObservables?: string[];
  navDotAriaLabel?: string;
  stepInteraction?: boolean;
}

// Tour configuration
export interface TourConfig {
  steps: TourStep[];
  tourId: string;
  defaultOpen?: boolean;
  className?: string;
  maskClassName?: string;
  showPrevNextButtons?: boolean;
  showCloseButton?: boolean;
  showNavigation?: boolean;
  showDots?: boolean;
  disableInteraction?: boolean;
  disableKeyboardNavigation?: boolean;
  onStart?: () => void;
  onComplete?: () => void;
  onSkip?: () => void;
}

// Custom tour component with enhanced UI
const TourComponent: React.FC<{
  config: TourConfig;
  isOpen: boolean;
  onClose: () => void;
}> = ({ config, isOpen, onClose }) => {
  const {
    currentStep,
    steps,
    isOpen: tourIsOpen,
    setIsOpen,
    setCurrentStep,
    meta,
  } = useTour();

  const [isPaused, setIsPaused] = useState(false);
  const [autoProgress, setAutoProgress] = useState(false);

  // Keyboard shortcuts
  useHotkeys('escape', () => {
    if (tourIsOpen) {
      onClose();
    }
  }, { enabled: tourIsOpen });

  useHotkeys('space', (e) => {
    e.preventDefault();
    setIsPaused(!isPaused);
  }, { enabled: tourIsOpen });

  useHotkeys('arrowleft', () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, { enabled: tourIsOpen });

  useHotkeys('arrowright', () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, { enabled: tourIsOpen });

  // Auto-progress functionality
  useEffect(() => {
    if (!autoProgress || isPaused || !tourIsOpen) return;

    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setAutoProgress(false);
        config.onComplete?.();
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [currentStep, autoProgress, isPaused, tourIsOpen, steps.length, setCurrentStep, config]);

  if (!tourIsOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="tour-overlay"
    >
      {/* Custom tour controls */}
      <div className="fixed top-4 right-4 z-[9999] flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 border">
        <button
          onClick={() => setAutoProgress(!autoProgress)}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={autoProgress ? 'Pause auto-progress' : 'Enable auto-progress'}
        >
          {autoProgress && !isPaused ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={isPaused ? 'Resume' : 'Pause'}
          disabled={!autoProgress}
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

        <button
          onClick={() => setCurrentStep(0)}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Restart tour"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            config.onSkip?.();
            onClose();
          }}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Skip tour"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        <button
          onClick={onClose}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Close tour"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress indicator */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] bg-white dark:bg-gray-800 rounded-full shadow-lg px-4 py-2 border">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">
            Step {currentStep + 1} of {steps.length}
          </span>
          <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced tour provider component
export const ComprehensiveTour: React.FC<{
  config: TourConfig;
  children: React.ReactNode;
}> = ({ config, children }) => {
  const [isOpen, setIsOpen] = useState(config.defaultOpen || false);

  const tourProviderConfig = {
    steps: config.steps,
    defaultOpen: isOpen,
    onAfterOpen: config.onStart,
    onBeforeClose: config.onComplete,
    styles: {
      popover: (base: any) => ({
        ...base,
        '--reactour-accent': '#3b82f6',
        borderRadius: '12px',
        backgroundColor: 'white',
        color: '#1f2937',
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        border: '1px solid #e5e7eb',
        maxWidth: '400px',
      }),
      maskArea: (base: any) => ({
        ...base,
        rx: 8,
      }),
      badge: (base: any) => ({
        ...base,
        backgroundColor: '#3b82f6',
        fontSize: '0.875rem',
      }),
      controls: (base: any) => ({
        ...base,
        marginTop: '16px',
      }),
      navigation: (base: any) => ({
        ...base,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
      }),
    },
    padding: 10,
    maskId: 'tour-mask',
    className: `comprehensive-tour ${config.className || ''}`,
    maskClassName: config.maskClassName,
    showPrevNextButtons: config.showPrevNextButtons !== false,
    showCloseButton: config.showCloseButton !== false,
    showNavigation: config.showNavigation !== false,
    showDots: config.showDots !== false,
    disableInteraction: config.disableInteraction,
    disableKeyboardNavigation: config.disableKeyboardNavigation,
    ContentComponent: ({ setCurrentStep, currentStep, transition, isHighlightingObserved, ...rest }: any) => (
      <div className="p-4">
        <div className="mb-4">
          {typeof config.steps[currentStep]?.content === 'string' ? (
            <div dangerouslySetInnerHTML={{ __html: config.steps[currentStep].content as string }} />
          ) : (
            config.steps[currentStep]?.content
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            
            <button
              onClick={() => {
                if (currentStep === config.steps.length - 1) {
                  config.onComplete?.();
                  setIsOpen(false);
                } else {
                  setCurrentStep(currentStep + 1);
                }
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            >
              {currentStep === config.steps.length - 1 ? 'Finish' : 'Next'}
              {currentStep < config.steps.length - 1 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
          
          <span className="text-xs text-gray-500">
            {currentStep + 1} / {config.steps.length}
          </span>
        </div>
      </div>
    ),
  };

  return (
    <TourProvider {...tourProviderConfig}>
      {children}
      <TourComponent
        config={config}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          config.onComplete?.();
        }}
      />
    </TourProvider>
  );
};

// Tour trigger component
export const TourTrigger: React.FC<{
  tourId: string;
  children: React.ReactNode;
  onStart?: () => void;
  className?: string;
}> = ({ children, onStart, className = '' }) => {
  const { setIsOpen } = useTour();

  const handleStartTour = () => {
    onStart?.();
    setIsOpen(true);
  };

  return (
    <button
      onClick={handleStartTour}
      className={`tour-trigger ${className}`}
    >
      {children}
    </button>
  );
};

export default ComprehensiveTour;