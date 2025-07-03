import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTenant } from './TenantProvider';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'super_admin' | 'partner_admin' | 'customer_admin' | 'end_user';
  tenantId: string;
  permissions: string[];
  lastActive: string;
  status: 'active' | 'inactive' | 'suspended';
}

interface RoleContextType {
  user: User | null;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  canAccess: (resource: string) => boolean;
  isSuperAdmin: () => boolean;
  isPartnerAdmin: () => boolean;
  isCustomerAdmin: () => boolean;
  isEndUser: () => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

interface RoleProviderProps {
  children: React.ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { tenant } = useTenant();

  useEffect(() => {
    fetchUserRole();
  }, [tenant]);

  const fetchUserRole = async () => {
    try {
      setIsLoading(true);
      
      // Get current user with role information
      const response = await fetch('/api/auth/user-role', {
        headers: tenant ? { 'X-Tenant-ID': tenant.id } : {},
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      } else {
        // Silently handle non-200 responses during development
        console.debug('User role not available:', response.status);
      }
    } catch (error) {
      // Only log significant errors, not network failures during development
      console.debug('User role fetch skipped:', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission) || user.role === 'super_admin';
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  const canAccess = (resource: string): boolean => {
    if (!user) return false;
    
    // Super admin can access everything
    if (user.role === 'super_admin') return true;
    
    // Define resource access rules
    const accessRules: Record<string, string[]> = {
      'super_admin_dashboard': ['super_admin'],
      'partner_dashboard': ['super_admin', 'partner_admin'],
      'customer_management': ['super_admin', 'partner_admin'],
      'tenant_management': ['super_admin'],
      'user_management': ['super_admin', 'partner_admin', 'customer_admin'],
      'billing_management': ['super_admin', 'partner_admin'],
      'analytics': ['super_admin', 'partner_admin', 'customer_admin'],
      'ai_tools': ['super_admin', 'partner_admin', 'customer_admin', 'end_user'],
      'crm_features': ['super_admin', 'partner_admin', 'customer_admin', 'end_user'],
      'custom_branding': ['super_admin', 'partner_admin'],
      'feature_flags': ['super_admin'],
      'audit_logs': ['super_admin', 'partner_admin', 'customer_admin'],
    };

    const allowedRoles = accessRules[resource];
    return allowedRoles ? allowedRoles.includes(user.role) : false;
  };

  const isSuperAdmin = (): boolean => hasRole('super_admin');
  const isPartnerAdmin = (): boolean => hasRole('partner_admin');
  const isCustomerAdmin = (): boolean => hasRole('customer_admin');
  const isEndUser = (): boolean => hasRole('end_user');

  return (
    <RoleContext.Provider
      value={{
        user,
        isLoading,
        hasPermission,
        hasRole,
        canAccess,
        isSuperAdmin,
        isPartnerAdmin,
        isCustomerAdmin,
        isEndUser,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

// HOC for protecting routes based on roles
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
  resource?: string;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
  resource,
  fallback = <div className="p-8 text-center text-red-600">Access Denied</div>
}) => {
  const { user, isLoading, hasRole, hasPermission, canAccess } = useRole();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return fallback;
  }

  // Check role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    return fallback;
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback;
  }

  // Check resource-based access
  if (resource && !canAccess(resource)) {
    return fallback;
  }

  return <>{children}</>;
};

// Component for conditional rendering based on permissions
interface ConditionalRenderProps {
  children: React.ReactNode;
  role?: string;
  permission?: string;
  resource?: string;
  inverse?: boolean;
}

export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  children,
  role,
  permission,
  resource,
  inverse = false
}) => {
  const { hasRole, hasPermission, canAccess } = useRole();

  let hasAccess = true;

  if (role) {
    hasAccess = hasAccess && hasRole(role);
  }

  if (permission) {
    hasAccess = hasAccess && hasPermission(permission);
  }

  if (resource) {
    hasAccess = hasAccess && canAccess(resource);
  }

  // Apply inverse logic if needed
  if (inverse) {
    hasAccess = !hasAccess;
  }

  return hasAccess ? <>{children}</> : null;
};

// Role badge component
interface RoleBadgeProps {
  role: string;
  className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className = '' }) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'partner_admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'customer_admin':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'end_user':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'partner_admin':
        return 'Partner Admin';
      case 'customer_admin':
        return 'Customer Admin';
      case 'end_user':
        return 'End User';
      default:
        return role;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(role)} ${className}`}
    >
      {getRoleLabel(role)}
    </span>
  );
};

// Permission checker hook
export const usePermissions = () => {
  const { user, hasPermission, hasRole, canAccess } = useRole();
  
  return {
    user,
    can: hasPermission,
    is: hasRole,
    canAccess,
    permissions: user?.permissions || [],
    role: user?.role || null,
  };
};

export default RoleProvider;