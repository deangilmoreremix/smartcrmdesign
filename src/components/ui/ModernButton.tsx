import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Loader2 } from 'lucide-react';

interface ModernButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  children,
  onClick,
  loading = false,
  disabled = false,
  className = '',
  variant = 'primary',
  size = 'md',
  type = 'button'
}) => {
  const { isDark } = useTheme();

  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return `${
          isDark
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
        }`;
      case 'secondary':
        return `${
          isDark
            ? 'bg-gray-700 hover:bg-gray-600 text-white'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
        }`;
      case 'outline':
        return `${
          isDark
            ? 'bg-transparent border border-gray-700 hover:bg-gray-700/10 text-white'
            : 'bg-transparent border border-gray-300 hover:bg-gray-100 text-gray-800'
        }`;
      case 'danger':
        return `${
          isDark
            ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20'
            : 'bg-red-100 hover:bg-red-200 text-red-600 border border-red-200'
        }`;
      default:
        return `${
          isDark
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
        }`;
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'px-3 py-1 text-sm';
      case 'md': return 'px-4 py-2';
      case 'lg': return 'px-6 py-3 text-lg';
      default: return 'px-4 py-2';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        rounded-lg transition-all duration-200 font-medium
        ${getVariantClass()} ${getSizeClass()} 
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'transform hover:-translate-y-1 hover:shadow-md'}
        ${className}
      `}
    >
      <div className="flex items-center justify-center">
        {loading && <Loader2 className="animate-spin mr-2" size={16} />}
        {children}
      </div>
    </button>
  );
};