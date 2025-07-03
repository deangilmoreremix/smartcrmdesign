import React from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children?: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, position = 'top', children }) => {
  return (
    <div className="relative inline-flex items-center group">
      {children || <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />}
      
      <div className={`
        absolute z-50 px-2 py-1 text-xs bg-gray-900 text-white rounded shadow-lg
        opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
        whitespace-nowrap
        ${position === 'top' ? 'bottom-full left-1/2 transform -translate-x-1/2 mb-1' : ''}
        ${position === 'bottom' ? 'top-full left-1/2 transform -translate-x-1/2 mt-1' : ''}
        ${position === 'left' ? 'right-full top-1/2 transform -translate-y-1/2 mr-1' : ''}
        ${position === 'right' ? 'left-full top-1/2 transform -translate-y-1/2 ml-1' : ''}
      `}>
        {content}
        
        {/* Arrow */}
        <div className={`
          absolute w-0 h-0 border-2 border-transparent
          ${position === 'top' ? 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-900' : ''}
          ${position === 'bottom' ? 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900' : ''}
          ${position === 'left' ? 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-900' : ''}
          ${position === 'right' ? 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-900' : ''}
        `} />
      </div>
    </div>
  );
};

export default Tooltip;