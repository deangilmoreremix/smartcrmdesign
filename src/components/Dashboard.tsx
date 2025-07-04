import React, { useState, useEffect } from 'react';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../store/contactStore';
import { useGemini } from '../services/geminiService';
import { useTaskStore } from '../store/taskStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { useAITools } from './AIToolsProvider';
import { useTheme } from '../contexts/ThemeContext';
import { useDashboardLayout } from '../contexts/DashboardLayoutContext';
import DraggableSection from './DraggableSection';
import DashboardLayoutControls from './DashboardLayoutControls';

// Import section components
import ExecutiveOverviewSection from './sections/ExecutiveOverviewSection';
import AISmartFeaturesHub from './sections/AISmartFeaturesHub';
import SalesPipelineDealAnalytics from './sections/SalesPipelineDealAnalytics';
import CustomerLeadManagement from './sections/CustomerLeadManagement';
import ActivitiesCommunications from './sections/ActivitiesCommunications';
import IntegrationsSystem from './sections/IntegrationsSystem';

// Keep legacy components for backward compatibility
import MetricsCards from './dashboard/MetricsCards';
import InteractionHistory from './dashboard/InteractionHistory';
import TasksAndFunnel from './dashboard/TasksAndFunnel';
import CustomerProfile from './dashboard/CustomerProfile';
import RecentActivity from './dashboard/RecentActivity';
import DashboardHeader from './dashboard/DashboardHeader';
import ChartsSection from './dashboard/ChartsSection';
import ConnectedApps from './dashboard/ConnectedApps';
import AIInsightsPanel from './dashboard/AIInsightsPanel';
import NewLeadsSection from './dashboard/NewLeadsSection';
import KPICards from './dashboard/KPICards';
import QuickActions from './dashboard/QuickActions';

const Dashboard: React.FC = () => {
  const { 
    deals, 
    fetchDeals, 
    isLoading,
    stageValues,
    totalPipelineValue 
  } = useDealStore();
  
  const { 
    contacts, 
    fetchContacts, 
    isLoading: contactsLoading 
  } = useContactStore();
  
  const { tasks, fetchTasks } = useTaskStore();
  const { fetchAppointments } = useAppointmentStore();
  const { openTool } = useAITools();
  const { isDark } = useTheme();
  const { sectionOrder } = useDashboardLayout();
  
  const gemini = useGemini();
  
  useEffect(() => {
    // Fetch all data when component mounts
    fetchDeals();
    fetchContacts();
    fetchTasks();
    fetchAppointments();
    
    // Set up timer to refresh data periodically
    const intervalId = setInterval(() => {
      fetchDeals();
      fetchContacts();
    }, 300000); // refresh every 5 minutes
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Render section content based on section ID
  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'executive-overview-section':
        return <ExecutiveOverviewSection />;

      case 'ai-smart-features-hub':
        return <AISmartFeaturesHub />;

      case 'sales-pipeline-deal-analytics':
        return <SalesPipelineDealAnalytics />;

      case 'customer-lead-management':
        return <CustomerLeadManagement />;

      case 'activities-communications':
        return <ActivitiesCommunications />;

      case 'integrations-system':
        return <IntegrationsSystem />;

      // Legacy sections (kept for backward compatibility)
      case 'metrics-cards-section':
        return <MetricsCards />;

      case 'kpi-cards-section':
        return <KPICards />;

      case 'quick-actions-section':
        return <QuickActions />;
        
      case 'ai-insights-section':
        return <AIInsightsPanel />;

      case 'interaction-history-section':
        return <InteractionHistory />;

      case 'customer-profile-section':
        return <CustomerProfile />;

      case 'recent-activity-section':
        return <RecentActivity />;

      case 'tasks-and-funnel-section':
        return <TasksAndFunnel />;

      case 'charts-section':
        return <ChartsSection />;

      case 'analytics-section':
        return <ChartsSection />;

      case 'apps-section':
        return <ConnectedApps />;

      default:
        return null;
    }
  };

  return (
    <main className="w-full h-full overflow-y-auto max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      {/* Dashboard Layout Controls */}
      <DashboardLayoutControls />

      {/* Draggable Sections */}
      <div className="space-y-8 pb-20">
        {sectionOrder.map((sectionId, index) => (
          <DraggableSection
            key={sectionId}
            sectionId={sectionId}
            index={index}
          >
            <div id={sectionId}>
              {renderSectionContent(sectionId)}
            </div>
          </DraggableSection>
        ))}
      </div>
    </main>
  );
};

export default Dashboard;