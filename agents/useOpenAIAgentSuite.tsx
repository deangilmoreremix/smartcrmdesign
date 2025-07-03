// OpenAI Agent Suite with Composio Integration
// Handles interactions with Composio API for external tool authentication and execution

import { useState, useCallback } from 'react';
import realApiService from '../services/realApiService';
import { composioToolsData } from '../data/composioToolsData';

export interface ComposioConnection {
  id: string;
  appName: string;
  entityId: string;
  status: 'connected' | 'disconnected' | 'pending';
  connectedAt?: Date;
  authType: 'oauth' | 'api_key' | 'basic';
}

export interface AgentExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
  executionTime: number;
}

export function useOpenAIAgentSuite() {
  const [connections, setConnections] = useState<ComposioConnection[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  // Authenticate with external applications via Composio
  const authenticateApp = useCallback(async (appName: string, entityId: string) => {
    try {
      const tool = composioToolsData.find(t => t.id === appName);
      if (!tool) {
        throw new Error(`Tool ${appName} not found in available tools`);
      }

      // Check if already connected
      const existingConnection = connections.find(c => c.appName === appName && c.entityId === entityId);
      if (existingConnection && existingConnection.status === 'connected') {
        return { success: true, message: 'Already connected' };
      }

      // In a real implementation, this would redirect to OAuth flow or collect API keys
      // For now, we'll simulate the connection process
      const newConnection: ComposioConnection = {
        id: `${appName}_${entityId}_${Date.now()}`,
        appName,
        entityId,
        status: 'connected',
        connectedAt: new Date(),
        authType: tool.authType
      };

      setConnections(prev => [...prev.filter(c => !(c.appName === appName && c.entityId === entityId)), newConnection]);
      
      return { success: true, message: `Successfully connected to ${tool.name}` };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Authentication failed' 
      };
    }
  }, [connections]);

  // Execute actions through Composio-integrated tools
  const executeComposioAction = useCallback(async (
    appName: string, 
    action: string, 
    params: any,
    entityId: string = 'default'
  ): Promise<AgentExecutionResult> => {
    const startTime = Date.now();
    setIsExecuting(true);

    try {
      // Check if app is connected
      const connection = connections.find(c => c.appName === appName && c.entityId === entityId);
      if (!connection || connection.status !== 'connected') {
        // Try to auto-connect if not connected
        const authResult = await authenticateApp(appName, entityId);
        if (!authResult.success) {
          throw new Error(`${appName} not connected. Please authenticate first.`);
        }
      }

      // Execute action through real API service
      const result = await realApiService.executeComposioAction(action, entityId, {
        appName,
        ...params
      });

      return {
        success: result.success,
        data: result.data,
        error: result.error,
        executionTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Execution failed',
        executionTime: Date.now() - startTime
      };
    } finally {
      setIsExecuting(false);
    }
  }, [connections, authenticateApp]);

  // Pre-built action functions for common integrations
  const sendGmailEmail = useCallback(async (params: {
    to: string;
    subject: string;
    body: string;
    entityId?: string;
  }) => {
    return executeComposioAction('gmail', 'send_email', {
      to: params.to,
      subject: params.subject,
      body: params.body,
      html: true
    }, params.entityId || 'default');
  }, [executeComposioAction]);

  const createGoogleCalendarEvent = useCallback(async (params: {
    title: string;
    startTime: string;
    endTime: string;
    description?: string;
    attendees?: string[];
    entityId?: string;
  }) => {
    return executeComposioAction('google_calendar', 'create_event', {
      summary: params.title,
      start: { dateTime: params.startTime },
      end: { dateTime: params.endTime },
      description: params.description,
      attendees: params.attendees?.map(email => ({ email }))
    }, params.entityId || 'default');
  }, [executeComposioAction]);

  const sendLinkedInMessage = useCallback(async (params: {
    recipientId: string;
    message: string;
    entityId?: string;
  }) => {
    return executeComposioAction('linkedin', 'send_message', {
      recipientUrn: params.recipientId,
      messageText: params.message
    }, params.entityId || 'default');
  }, [executeComposioAction]);

  const postToSlack = useCallback(async (params: {
    channel: string;
    message: string;
    entityId?: string;
  }) => {
    return executeComposioAction('slack', 'post_message', {
      channel: params.channel,
      text: params.message
    }, params.entityId || 'default');
  }, [executeComposioAction]);

  const createHubSpotContact = useCallback(async (params: {
    email: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    phone?: string;
    entityId?: string;
  }) => {
    return executeComposioAction('hubspot', 'create_contact', {
      properties: {
        email: params.email,
        firstname: params.firstName,
        lastname: params.lastName,
        company: params.company,
        phone: params.phone
      }
    }, params.entityId || 'default');
  }, [executeComposioAction]);

  const getConnectedTools = useCallback(async (entityId: string = 'default') => {
    try {
      const result = await realApiService.getIntegratedTools(entityId);
      if (result.success) {
        // Update local connections state with real data
        const realConnections: ComposioConnection[] = result.data.map((conn: any) => ({
          id: conn.id,
          appName: conn.appName,
          entityId: conn.entityId,
          status: conn.status,
          connectedAt: conn.createdAt ? new Date(conn.createdAt) : undefined,
          authType: conn.authConfig?.authMode || 'oauth'
        }));
        setConnections(realConnections);
        return realConnections;
      } else {
        console.warn('Failed to fetch connected tools:', result.error);
        return connections; // Return cached connections
      }
    } catch (error) {
      console.error('Error fetching connected tools:', error);
      return connections; // Return cached connections
    }
  }, [connections]);

  // Disconnect from an app
  const disconnectApp = useCallback(async (appName: string, entityId: string) => {
    try {
      setConnections(prev => prev.filter(c => !(c.appName === appName && c.entityId === entityId)));
      return { success: true, message: `Disconnected from ${appName}` };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Disconnection failed' 
      };
    }
  }, []);

  return {
    // State
    connections,
    isExecuting,
    
    // Authentication
    authenticateApp,
    disconnectApp,
    getConnectedTools,
    
    // Generic execution
    executeComposioAction,
    
    // Pre-built actions
    sendGmailEmail,
    createGoogleCalendarEvent,
    sendLinkedInMessage,
    postToSlack,
    createHubSpotContact
  };
}