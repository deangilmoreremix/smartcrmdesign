import { useState, useEffect } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'super_admin' | 'reseller' | 'user';
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Auto-login as super admin for immediate testing
    const superAdminUser: AuthUser = {
      id: 'super-admin-1',
      email: 'superadmin@smart-crm.com',
      firstName: 'Super',
      lastName: 'Admin',
      role: 'super_admin'
    };
    
    setUser(superAdminUser);
    setIsLoaded(true);
    console.log('✅ Auto-logged in as Super Admin for testing');
  }, []);

  const signOut = () => {
    setUser(null);
    console.log('✅ Signed out successfully');
  };

  return {
    user,
    isLoaded,
    signOut
  };
};