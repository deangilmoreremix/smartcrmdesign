import React, { useState, useRef } from 'react';
import { Info, Lightbulb, HelpCircle, Target, X } from 'lucide-react';
import { 
  useFloating, 
  autoUpdate, 
  offset, 
  flip, 
  shift, 
  arrow, 
  useHover, 
  useClick, 
  useFocus,
  useDismiss, 
  useRole, 
  useInteractions, 
  FloatingPortal, 
  FloatingArrow,
  safePolygon,
  type Placement 
} from '@floating-ui/react';
import { useHotkeys } from 'react-hotkeys-hook';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedHelpTooltipProps {
  content: string;
  title?: string;
  type?: 'info' | 'tip' | 'feature' | 'goal';
  placement?: Placement;
  trigger?: 'hover' | 'click' | 'focus';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
  persistent?: boolean;
  delay?: number;
  offsetValue?: number;
  interactive?: boolean;
  maxWidth?: number;
  disabled?: boolean;
  onShow?: () => void;
  onHide?: () => void;
  showClose?: boolean;
  animated?: boolean;
}

const EnhancedHelpTooltip: React.FC<EnhancedHelpTooltipProps> = ({
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
  delay = 200,
  offsetValue = 8,
  interactive = false,
  maxWidth = 320,
  disabled = false,
  onShow,
  onHide,
  showClose = false,
  animated = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef<SVGSVGElement>(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      setIsOpen(open);
      if (open) {
        onShow?.();
      } else {
        onHide?.();
      }
    },
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(offsetValue),
      flip({
        fallbackAxisSideDirection: 'start',
        crossAxis: false,
      }),
      shift({ padding: 8 }),
      arrow({
        element: arrowRef,
        padding: 8,
      }),
    ],
  });

  const hover = useHover(context, {
    enabled: trigger === 'hover' && !disabled,
    delay: { open: delay, close: persistent ? 0 : 150 },
    handleClose: interactive ? safePolygon() : null,
  });

  const click = useClick(context, {
    enabled: trigger === 'click' && !disabled,
  });

  const focus = useFocus(context, {
    enabled: trigger === 'focus' && !disabled,
  });

  const dismiss = useDismiss(context, {
    enabled: !persistent,
  });

  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    click,
    focus,
    dismiss,
    role,
  ]);

  // Keyboard shortcuts
  useHotkeys('escape', () => {
    if (isOpen && !persistent) {
      setIsOpen(false);
    }
  }, { enabled: isOpen });

  // Icon mapping
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
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3',
  };

  // Type-based styling
  const typeStyles = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-700',
      text: 'text-blue-800 dark:text-blue-200',
      arrow: '#dbeafe',
    },
    tip: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-700',
      text: 'text-yellow-800 dark:text-yellow-200',
      arrow: '#fef3c7',
    },
    feature: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-700',
      text: 'text-purple-800 dark:text-purple-200',
      arrow: '#ede9fe',
    },
    goal: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-700',
      text: 'text-green-800 dark:text-green-200',
      arrow: '#d1fae5',
    },
  };

  const currentStyle = typeStyles[type];

  // Animation variants
  const tooltipVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: placement.includes('top') ? 10 : placement.includes('bottom') ? -10 : 0,
      x: placement.includes('left') ? 10 : placement.includes('right') ? -10 : 0,
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: {
        duration: 0.15,
      }
    }
  };

  const TooltipContent = () => (
    <motion.div
      ref={refs.setFloating}
      style={{
        ...floatingStyles,
        maxWidth: `${maxWidth}px`,
        zIndex: 9999,
      }}
      {...getFloatingProps()}
      className={`
        ${currentStyle.bg}
        ${currentStyle.border}
        ${currentStyle.text}
        ${sizeClasses[size]}
        border rounded-lg shadow-lg backdrop-blur-sm
        ${className}
      `}
      variants={animated ? tooltipVariants : undefined}
      initial={animated ? 'hidden' : undefined}
      animate={animated ? 'visible' : undefined}
      exit={animated ? 'exit' : undefined}
      role="tooltip"
    >
      {/* Close button for persistent tooltips */}
      {(showClose || persistent) && (
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-1 right-1 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          aria-label="Close tooltip"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Title section */}
      {title && (
        <div className="font-semibold mb-2 flex items-center gap-2">
          {showIcon && getIcon()}
          <span className={showClose || persistent ? 'pr-6' : ''}>{title}</span>
        </div>
      )}

      {/* Content section */}
      <div className={`${title ? '' : 'flex items-start gap-2'} ${showClose && !title ? 'pr-6' : ''}`}>
        {!title && showIcon && (
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
        )}
        <div className="flex-1">
          {typeof content === 'string' ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            content
          )}
        </div>
      </div>

      {/* Floating Arrow */}
      <FloatingArrow
        ref={arrowRef}
        context={context}
        fill={currentStyle.arrow}
        stroke={currentStyle.border.includes('blue') ? '#93c5fd' : 
              currentStyle.border.includes('yellow') ? '#fcd34d' :
              currentStyle.border.includes('purple') ? '#c084fc' : '#86efac'}
        strokeWidth={1}
      />
    </motion.div>
  );

  // If children are provided, wrap them
  if (children) {
    return (
      <>
        <div
          ref={refs.setReference}
          {...getReferenceProps()}
          className={disabled ? 'cursor-not-allowed opacity-50' : 'cursor-help'}
        >
          {children}
        </div>
        
        <FloatingPortal>
          <AnimatePresence>
            {isOpen && <TooltipContent />}
          </AnimatePresence>
        </FloatingPortal>
      </>
    );
  }

  // Default tooltip trigger
  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        className={`
          inline-flex items-center justify-center w-5 h-5 rounded-full 
          ${currentStyle.bg} ${currentStyle.border} ${currentStyle.text}
          border transition-all duration-200 hover:scale-110
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-help'}
          ${className}
        `}
        disabled={disabled}
        aria-label={title || 'Help information'}
      >
        {getIcon()}
      </button>

      <FloatingPortal>
        <AnimatePresence>
          {isOpen && <TooltipContent />}
        </AnimatePresence>
      </FloatingPortal>
    </>
  );
};

export default EnhancedHelpTooltip;