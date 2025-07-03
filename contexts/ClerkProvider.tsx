
import React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  console.error('Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your environment variables.');
}

export function ClerkProviderWrapper({ children }: { children: React.ReactNode }) {
  // If no Clerk key is provided, render children without Clerk (fallback to existing auth)
  if (!clerkPubKey) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider 
      publishableKey={clerkPubKey}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#6366f1',
          colorBackground: '#1f2937',
          colorInputBackground: '#374151',
          colorInputText: '#f9fafb',
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
}
