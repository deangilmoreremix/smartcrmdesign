import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface HelpTooltipProps {
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  children?: React.ReactNode;
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({ content, placement = 'top', children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children || <HelpCircle size={16} className="text-gray-400 hover:text-gray-600" />}
      </div>
      
      {isVisible && (
        <div className={`absolute z-10 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap ${positionClasses[placement]}`}>
          {content}
          <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
            placement === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
            placement === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' :
            placement === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' :
            'right-full top-1/2 -translate-y-1/2 -mr-1'
          }`}></div>
        </div>
      )}
    </div>
  );
};

export default HelpTooltip;