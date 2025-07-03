import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, Info, Lightbulb, Target } from 'lucide-react';
import { useEnhancedHelp } from '../../contexts/EnhancedHelpContext';

interface HelpTooltipProps {
  content: string;
  title?: string;
  type?: 'info' | 'tip' | 'feature' | 'goal';
  placement?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
  persistent?: boolean;
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({
  content,
  title,
  type = 'info',
  placement = 'top',
  trigger = 'hover',
  size = 'md',
  className = '',
  children,
  showIcon = true,
  persistent = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const { showTours } = useEnhancedHelp();

  // Don't render if help system is disabled
  if (!showTours) {
    return children ? <>{children}</> : null;
  }

  // Icon mapping based on type
  const getIcon = () => {
    switch (type) {
      case 'info':
        return <Info className="w-4 h-4" />;
      case 'tip':
        return <Lightbulb className="w-4 h-4" />;
      case 'feature':
        return <HelpCircle className="w-4 h-4" />;
      case 'goal':
        return <Target className="w-4 h-4" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'text-xs max-w-48',
    md: 'text-sm max-w-64',
    lg: 'text-base max-w-80',
  };

  // Color classes based on type
  const typeClasses = {
    info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200',
    tip: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200',
    feature: 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700 text-purple-800 dark:text-purple-200',
    goal: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200',
  };

  // Placement classes
  const placementClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  // Arrow classes
  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-current',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-current',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-current',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-current',
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setIsVisible(true);
      setShouldAnimate(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover' && !persistent) {
      setIsVisible(false);
      setShouldAnimate(false);
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible);
      setShouldAnimate(!isVisible);
    }
  };

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        trigger === 'click' &&
        tooltipRef.current &&
        triggerRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
        setShouldAnimate(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [trigger]);

  const tooltipContent = (
    <>
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 px-3 py-2 border rounded-lg shadow-lg
            ${sizeClasses[size]}
            ${typeClasses[type]}
            ${placementClasses[placement]}
            ${shouldAnimate ? 'tooltip-bounce' : ''}
            ${persistent ? 'tooltip-wiggle' : ''}
          `}
          role="tooltip"
        >
          {title && (
            <div className="font-semibold mb-1 flex items-center gap-1">
              {showIcon && getIcon()}
              {title}
            </div>
          )}
          <div className={title ? '' : 'flex items-center gap-1'}>
            {!title && showIcon && getIcon()}
            {content}
          </div>
          
          {/* Tooltip arrow */}
          <div
            className={`
              absolute w-0 h-0 border-4
              ${arrowClasses[placement]}
            `}
            style={{
              borderColor: type === 'info' ? '#dbeafe' : 
                          type === 'tip' ? '#fef3c7' :
                          type === 'feature' ? '#ede9fe' : '#d1fae5'
            }}
          />
        </div>
      )}
    </>
  );

  // If children are provided, wrap them with the tooltip trigger
  if (children) {
    return (
      <div
        ref={triggerRef}
        className={`relative inline-block ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {children}
        {tooltipContent}
      </div>
    );
  }

  // If no children, render as a standalone help icon
  return (
    <div
      ref={triggerRef}
      className={`
        relative inline-flex items-center justify-center
        w-5 h-5 rounded-full cursor-help
        text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300
        help-button-glow
        ${className}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      aria-label="Help"
    >
      {getIcon()}
      {tooltipContent}
    </div>
  );
};

export default HelpTooltip;