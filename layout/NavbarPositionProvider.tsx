import React, { createContext, useContext, ReactNode } from 'react';
import { useNavbarPosition, NavbarPosition } from '../../hooks/useNavbarPosition';

interface NavbarPositionContextType {
  position: NavbarPosition;
  setPosition: (position: NavbarPosition) => void;
  isTop: boolean;
  isLeft: boolean;
  isRight: boolean;
}

const NavbarPositionContext = createContext<NavbarPositionContextType | undefined>(undefined);

interface NavbarPositionProviderProps {
  children: ReactNode;
}

export function NavbarPositionProvider({ children }: NavbarPositionProviderProps) {
  const navbarPosition = useNavbarPosition();

  return (
    <NavbarPositionContext.Provider value={navbarPosition}>
      {children}
    </NavbarPositionContext.Provider>
  );
}

export function useNavbarPositionContext() {
  const context = useContext(NavbarPositionContext);
  if (context === undefined) {
    throw new Error('useNavbarPositionContext must be used within a NavbarPositionProvider');
  }
  return context;
}