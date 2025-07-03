import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';

import { AIToolsProvider } from './components/AIToolsProvider';
import { TenantProvider } from './components/TenantProvider';
import { RoleProvider } from './components/RoleBasedAccess';
import { EnhancedHelpProvider } from './contexts/EnhancedHelpContext';
import { queryClient } from './lib/queryClient';
import { ClerkProvider } from '@clerk/clerk-react';
import { ProtectedRoute, SuperAdminRoute, ResellerRoute, UserRoute } from './components/auth/ProtectedRoute';

// Landing Pages
import LandingPage from './pages/Landing/LandingPage';

// Auth Pages (preserved for future Clerk integration)
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';

// Main pages
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import ContactDetail from './pages/ContactDetail';
import Pipeline from './pages/Pipeline';
import Tasks from './pages/Tasks';
import TaskCalendarView from './pages/TaskCalendarView';
import Appointments from './pages/Appointments';
import PhoneSystem from './pages/PhoneSystem';
import TextMessages from './pages/TextMessages';
import VideoEmail from './pages/VideoEmail';
import Invoicing from './pages/Invoicing';
import Settings from './pages/Settings';
import AITools from './pages/AITools';
import SalesTools from './pages/SalesTools';
import LeadAutomation from './pages/LeadAutomation';
import CircleProspecting from './pages/CircleProspecting';
import FormsAndSurveys from './pages/FormsAndSurveys';
import FormPublic from './pages/FormPublic';
import FAQ from './pages/FAQ';

// Business Analysis
import BusinessAnalyzer from './pages/BusinessAnalysis/BusinessAnalyzer';

// Content Library
import ContentLibrary from './pages/ContentLibrary/ContentLibrary';

// Voice Profiles
import VoiceProfiles from './pages/VoiceProfiles/VoiceProfiles';

// New Feature Pages
import CommunicationHub from './pages/CommunicationHub';
import DocumentCenter from './pages/DocumentCenter';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import LeadCapture from './pages/LeadCapture';

// Feature Pages
import AiToolsFeaturePage from './pages/Landing/FeaturePage/AiToolsFeaturePage';
import ContactsFeaturePage from './pages/Landing/FeaturePage/ContactsFeaturePage';
import PipelineFeaturePage from './pages/Landing/FeaturePage/PipelineFeaturePage';
import AiAssistantFeaturePage from './pages/Landing/FeaturePage/AiAssistantFeaturePage';
import VisionAnalyzerFeaturePage from './pages/Landing/FeaturePage/VisionAnalyzerFeaturePage';
import ImageGeneratorFeaturePage from './pages/Landing/FeaturePage/ImageGeneratorFeaturePage';
import SemanticSearchFeaturePage from './pages/Landing/FeaturePage/SemanticSearchFeaturePage';
import FunctionAssistantFeaturePage from './pages/Landing/FeaturePage/FunctionAssistantFeaturePage';
import CommunicationsFeaturePage from './pages/Landing/FeaturePage/CommunicationsFeaturePage';
import GoalCardDemo from './pages/GoalCardDemo';
import AIGoalsPage from './pages/AIGoals/AIGoalsPageEnhanced';
import PartnerOnboardingPage from './pages/PartnerOnboardingPage';
import PartnerDashboard from './pages/PartnerDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import UserManagement from './pages/UserManagement';
import WhiteLabelCustomization from './pages/WhiteLabelCustomization';
import PartnerManagementPage from './pages/PartnerManagementPage';
import RevenueSharingPage from './pages/RevenueSharingPage';
import FeaturePackageManagementPage from './pages/FeaturePackageManagementPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Layout Components
import Navbar from './components/Navbar';

// Layout wrapper for authenticated pages
const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};

function App() {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error('Missing Publishable Key');
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider 
        publishableKey={publishableKey}
      >
        <TenantProvider>
          <RoleProvider>
            <EnhancedHelpProvider>
              <AIToolsProvider>
                <Router>
            <Routes>
              {/* Auth routes (available for future Clerk integration) */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/form/:formId" element={<FormPublic />} />
              <Route path="/faq" element={<FAQ />} />

              {/* Protected routes with role-based access */}
              <Route path="/dashboard" element={
                <UserRoute>
                  <AuthenticatedLayout>
                    <Dashboard />
                  </AuthenticatedLayout>
                </UserRoute>
              } />

              <Route path="/contacts" element={
                <UserRoute>
                  <AuthenticatedLayout>
                    <Contacts />
                  </AuthenticatedLayout>
                </UserRoute>
              } />

              <Route path="/contacts/:id" element={
                <UserRoute>
                  <AuthenticatedLayout>
                    <ContactDetail />
                  </AuthenticatedLayout>
                </UserRoute>
              } />

              <Route path="/pipeline" element={
                <UserRoute>
                  <AuthenticatedLayout>
                    <Pipeline />
                  </AuthenticatedLayout>
                </UserRoute>
              } />

              <Route path="/tasks" element={
                <UserRoute>
                  <AuthenticatedLayout>
                    <Tasks />
                  </AuthenticatedLayout>
                </UserRoute>
              } />

              <Route path="/tasks/calendar" element={
                <ProtectedRoute>
                  <TaskCalendarView />
                </ProtectedRoute>
              } />

              <Route path="/calendar" element={
                <ProtectedRoute>
                  <TaskCalendarView />
                </ProtectedRoute>
              } />

              <Route path="/appointments" element={
                <ProtectedRoute>
                  <Appointments />
                </ProtectedRoute>
              } />

              <Route path="/phone" element={
                <ProtectedRoute>
                  <PhoneSystem />
                </ProtectedRoute>
              } />

              <Route path="/text-messages" element={
                <ProtectedRoute>
                  <TextMessages />
                </ProtectedRoute>
              } />

              <Route path="/video-email" element={
                <ProtectedRoute>
                  <VideoEmail />
                </ProtectedRoute>
              } />

              <Route path="/invoicing" element={
                <ProtectedRoute>
                  <Invoicing />
                </ProtectedRoute>
              } />

              <Route path="/ai-tools" element={
                <ProtectedRoute>
                  <AITools />
                </ProtectedRoute>
              } />

              <Route path="/sales-tools" element={
                <ProtectedRoute>
                  <SalesTools />
                </ProtectedRoute>
              } />

              <Route path="/lead-automation" element={
                <ProtectedRoute>
                  <LeadAutomation />
                </ProtectedRoute>
              } />

              <Route path="/circle-prospecting" element={
                <ProtectedRoute>
                  <CircleProspecting />
                </ProtectedRoute>
              } />

              <Route path="/forms-surveys" element={
                <ProtectedRoute>
                  <FormsAndSurveys />
                </ProtectedRoute>
              } />

              <Route path="/business-analysis" element={
                <ProtectedRoute>
                  <BusinessAnalyzer />
                </ProtectedRoute>
              } />

              <Route path="/content-library" element={
                <ProtectedRoute>
                  <ContentLibrary />
                </ProtectedRoute>
              } />

              <Route path="/voice-profiles" element={
                <ProtectedRoute>
                  <VoiceProfiles />
                </ProtectedRoute>
              } />

              <Route path="/communication-hub" element={
                <ProtectedRoute>
                  <CommunicationHub />
                </ProtectedRoute>
              } />

              <Route path="/document-center" element={
                <ProtectedRoute>
                  <DocumentCenter />
                </ProtectedRoute>
              } />

              <Route path="/analytics-dashboard" element={
                <ProtectedRoute>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              } />

              <Route path="/lead-capture" element={
                <ProtectedRoute>
                  <LeadCapture />
                </ProtectedRoute>
              } />

              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />

              {/* Feature Pages */}
              <Route path="/features/ai-tools" element={<AiToolsFeaturePage />} />
              <Route path="/features/contacts" element={<ContactsFeaturePage />} />
              <Route path="/features/pipeline" element={<PipelineFeaturePage />} />
              <Route path="/features/ai-assistant" element={<AiAssistantFeaturePage />} />
              <Route path="/features/vision-analyzer" element={<VisionAnalyzerFeaturePage />} />
              <Route path="/features/image-generator" element={<ImageGeneratorFeaturePage />} />
              <Route path="/features/semantic-search" element={<SemanticSearchFeaturePage />} />
              <Route path="/features/function-assistant" element={<FunctionAssistantFeaturePage />} />
              <Route path="/features/communications" element={<CommunicationsFeaturePage />} />
              <Route path="/demo/goal-cards" element={<GoalCardDemo />} />
              <Route path="/ai-goals" element={<AIGoalsPage />} />
              <Route path="/partner/onboard" element={<PartnerOnboardingPage />} />
              <Route path="/partner/dashboard" element={
                <ResellerRoute>
                  <AuthenticatedLayout>
                    <PartnerDashboard />
                  </AuthenticatedLayout>
                </ResellerRoute>
              } />
              <Route path="/admin/dashboard" element={
                <SuperAdminRoute>
                  <AuthenticatedLayout>
                    <SuperAdminDashboard />
                  </AuthenticatedLayout>
                </SuperAdminRoute>
              } />
              <Route path="/admin/users" element={
                <SuperAdminRoute>
                  <AuthenticatedLayout>
                    <UserManagement />
                  </AuthenticatedLayout>
                </SuperAdminRoute>
              } />
              <Route path="/admin/white-label" element={
                <SuperAdminRoute>
                  <AuthenticatedLayout>
                    <WhiteLabelCustomization />
                  </AuthenticatedLayout>
                </SuperAdminRoute>
              } />
              <Route path="/admin/partner-management" element={
                <SuperAdminRoute>
                  <AuthenticatedLayout>
                    <PartnerManagementPage />
                  </AuthenticatedLayout>
                </SuperAdminRoute>
              } />
              <Route path="/admin/revenue-sharing" element={
                <SuperAdminRoute>
                  <AuthenticatedLayout>
                    <RevenueSharingPage />
                  </AuthenticatedLayout>
                </SuperAdminRoute>
              } />
              <Route path="/admin/feature-packages" element={
                <SuperAdminRoute>
                  <AuthenticatedLayout>
                    <FeaturePackageManagementPage />
                  </AuthenticatedLayout>
                </SuperAdminRoute>
              } />

              {/* Unauthorized route */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
            </Routes>
                </Router>
              </AIToolsProvider>
            </EnhancedHelpProvider>
          </RoleProvider>
        </TenantProvider>
      </ClerkProvider>
    </QueryClientProvider>
  );
}

export default App;