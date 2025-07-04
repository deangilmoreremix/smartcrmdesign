import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface GlassCardProps {
  className?: string;
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({ className = '', children }) => {
  const { isDark } = useTheme();

  return (
    <div className={`${
      isDark 
        ? 'bg-white/5 backdrop-blur-xl border border-white/10' 
        : 'bg-white/95 backdrop-blur-xl border border-gray-200'
    } rounded-2xl ${className}`}>
      {children}
    </div>
  );
};