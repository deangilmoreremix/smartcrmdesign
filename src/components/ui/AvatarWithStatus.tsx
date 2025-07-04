import React from 'react';

interface AvatarWithStatusProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fallback?: string;
  status?: 'active' | 'inactive' | 'pending' | 'success';
  className?: string;
}

export const AvatarWithStatus: React.FC<AvatarWithStatusProps> = ({ 
  src, 
  alt = '', 
  size = 'md', 
  fallback, 
  status, 
  className = '' 
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-20 h-20 text-xl'
  };

  const statusClasses = {
    active: 'bg-green-400',
    inactive: 'bg-gray-400',
    pending: 'bg-yellow-400',
    success: 'bg-blue-400'
  };

  const statusSizes = {
    xs: 'w-2 h-2',
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-4 h-4'
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center`}>
        {src ? (
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              if (target.nextSibling) {
                (target.nextSibling as HTMLElement).style.display = 'flex';
              }
            }}
          />
        ) : null}
        <div 
          className={`w-full h-full flex items-center justify-center text-white font-medium ${src ? 'hidden' : 'flex'}`}
          style={{ display: src ? 'none' : 'flex' }}
        >
          {fallback || alt.charAt(0).toUpperCase() || '?'}
        </div>
      </div>
      {status && (
        <div className={`absolute -bottom-0.5 -right-0.5 ${statusSizes[size]} ${statusClasses[status] || 'bg-gray-400'} rounded-full border-2 border-white dark:border-gray-900`}></div>
      )}
    </div>
  );
};