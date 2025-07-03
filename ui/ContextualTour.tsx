import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { useHelp } from '../../contexts/HelpContext';

interface TourStep {
  id: string;
  target: string; // CSS selector or element ID
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  action?: {
    type: 'click' | 'hover' | 'input';
    text: string;
  };
  highlight?: boolean;
}

interface ContextualTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  autoStart?: boolean;
  tourId: string;
}

const ContextualTour: React.FC<ContextualTourProps> = ({
  steps,
  isOpen,
  onClose,
  onComplete,
  autoStart = false,
  tourId,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [currentTarget, setCurrentTarget] = useState<Element | null>(null);
  const { markTourCompleted, isTourCompleted, showTours } = useHelp();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Don't render if tours are disabled or already completed
  if (!showTours || isTourCompleted(tourId)) {
    return null;
  }

  const currentStep = steps[currentStepIndex];

  // Find the target element for the current step
  useEffect(() => {
    if (!isOpen || !currentStep) return;

    const findTarget = () => {
      const target = document.querySelector(currentStep.target);
      if (target) {
        setCurrentTarget(target);
        
        // Add highlight class if specified
        if (currentStep.highlight) {
          target.classList.add('tour-highlight');
        }
        
        // Scroll target into view
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    };

    // Try to find target immediately
    findTarget();
    
    // If not found, retry after a delay (for dynamic content)
    if (!currentTarget) {
      const retryTimeout = setTimeout(findTarget, 100);
      return () => clearTimeout(retryTimeout);
    }
  }, [currentStep, isOpen, currentTarget]);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && isOpen && currentStepIndex < steps.length - 1) {
      intervalRef.current = setTimeout(() => {
        nextStep();
      }, 4000); // 4 seconds per step
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isPlaying, isOpen, currentStepIndex]);

  // Cleanup highlights when tour closes or step changes
  useEffect(() => {
    return () => {
      // Remove highlight from previous target
      if (currentTarget && currentStep?.highlight) {
        currentTarget.classList.remove('tour-highlight');
      }
    };
  }, [currentStepIndex, isOpen]);

  const nextStep = () => {
    // Remove highlight from current target
    if (currentTarget && currentStep?.highlight) {
      currentTarget.classList.remove('tour-highlight');
    }

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setCurrentTarget(null);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    // Remove highlight from current target
    if (currentTarget && currentStep?.highlight) {
      currentTarget.classList.remove('tour-highlight');
    }

    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setCurrentTarget(null);
    }
  };

  const completeTour = () => {
    // Remove highlight from current target
    if (currentTarget && currentStep?.highlight) {
      currentTarget.classList.remove('tour-highlight');
    }

    markTourCompleted(tourId);
    onComplete?.();
    onClose();
  };

  const skipTour = () => {
    // Remove highlight from current target
    if (currentTarget && currentStep?.highlight) {
      currentTarget.classList.remove('tour-highlight');
    }

    onClose();
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const getTooltipPosition = () => {
    if (!currentTarget) return { top: '50%', left: '50%' };

    const rect = currentTarget.getBoundingClientRect();
    const placement = currentStep.placement || 'bottom';

    switch (placement) {
      case 'top':
        return {
          top: `${rect.top - 10}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translate(-50%, -100%)'
        };
      case 'bottom':
        return {
          top: `${rect.bottom + 10}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translate(-50%, 0%)'
        };
      case 'left':
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.left - 10}px`,
          transform: 'translate(-100%, -50%)'
        };
      case 'right':
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.right + 10}px`,
          transform: 'translate(0%, -50%)'
        };
      default:
        return {
          top: `${rect.bottom + 10}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translate(-50%, 0%)'
        };
    }
  };

  if (!isOpen || !currentStep) return null;

  const tooltipStyle = getTooltipPosition();

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="fixed inset-0 z-40 tour-backdrop"
        onClick={skipTour}
      />

      {/* Tour Tooltip */}
      <div
        className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-sm w-80 p-4 tooltip-bounce"
        style={tooltipStyle}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
            <button
              onClick={togglePlayPause}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={isPlaying ? 'Pause tour' : 'Play tour'}
            >
              {isPlaying ? (
                <Pause className="w-3 h-3 text-gray-500" />
              ) : (
                <Play className="w-3 h-3 text-gray-500" />
              )}
            </button>
          </div>
          <button
            onClick={skipTour}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Close tour"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mb-4">
          <div
            className="bg-blue-600 h-1 rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {currentStep.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            {currentStep.content}
          </p>
          
          {currentStep.action && (
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 mb-3">
              <p className="text-xs font-medium text-blue-800 dark:text-blue-200">
                Try this: {currentStep.action.text}
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex gap-2">
            {currentStepIndex === steps.length - 1 ? (
              <button
                onClick={completeTour}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
              >
                Finish
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Skip option */}
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={skipTour}
            className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            Skip this tour
          </button>
        </div>
      </div>
    </>
  );
};

export default ContextualTour;