import React, { createContext, useContext, useState } from 'react';

interface AIToolsContextType {
  openTool: (toolName: string) => void;
  closeTool: () => void;
  currentTool: string | null;
}

const AIToolsContext = createContext<AIToolsContextType | undefined>(undefined);

export const useAITools = () => {
  const context = useContext(AIToolsContext);
  if (!context) {
    throw new Error('useAITools must be used within an AIToolsProvider');
  }
  return context;
};

export const AIToolsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTool, setCurrentTool] = useState<string | null>(null);

  const openTool = (toolName: string) => {
    setCurrentTool(toolName);
  };

  const closeTool = () => {
    setCurrentTool(null);
  };

  return (
    <AIToolsContext.Provider value={{ openTool, closeTool, currentTool }}>
      {children}
    </AIToolsContext.Provider>
  );
};