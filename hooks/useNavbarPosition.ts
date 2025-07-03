import { useState, useEffect } from 'react';

export type NavbarPosition = 'top' | 'left' | 'right';

const NAVBAR_POSITION_KEY = 'smart-crm-navbar-position';

export const useNavbarPosition = () => {
  const [position, setPosition] = useState<NavbarPosition>(() => {
    const stored = localStorage.getItem(NAVBAR_POSITION_KEY);
    return (stored as NavbarPosition) || 'top';
  });

  const updatePosition = (newPosition: NavbarPosition) => {
    setPosition(newPosition);
    localStorage.setItem(NAVBAR_POSITION_KEY, newPosition);
  };

  useEffect(() => {
    // Apply CSS class to body for global layout adjustments
    document.body.classList.remove('navbar-top', 'navbar-left', 'navbar-right');
    document.body.classList.add(`navbar-${position}`);
  }, [position]);

  return {
    position,
    setPosition: updatePosition,
    isTop: position === 'top',
    isLeft: position === 'left',
    isRight: position === 'right',
  };
};