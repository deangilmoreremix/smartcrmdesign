// Composio Service - Mock implementation for client-side usage
// Note: Real Composio integration would happen on the server side

export interface ComposioConfig {
  apiKey?: string;
  baseUrl?: string;
}

export interface ComposioExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

class ComposioService {
  private config: ComposioConfig;
  private isConfigured: boolean = false;

  constructor(config: ComposioConfig = {}) {
    this.config = config;
    this.isConfigured = !!config.apiKey;
  }

  // Check if Composio is properly configured
  isReady(): boolean {
    return this.isConfigured;
  }

  // LinkedIn Integration (Real API)
  async sendLinkedInMessage(recipientId: string, message: string): Promise<ComposioExecutionResult> {
    try {
      const response = await fetch('/api/composio/linkedin/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipientId, message }),
      });

      if (!response.ok) {
        throw new Error(`LinkedIn API error: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data,
        message: result.message || 'LinkedIn message sent successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'LinkedIn message failed'
      };
    }
  }

  // WhatsApp Integration (Real API)
  async sendWhatsAppMessage(phoneNumber: string, message: string, templateName?: string): Promise<ComposioExecutionResult> {
    try {
      const response = await fetch('/api/composio/whatsapp/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, message, templateName }),
      });

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data,
        message: result.message || 'WhatsApp message sent successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'WhatsApp message failed'
      };
    }
  }

  // Email Integration (Real API)
  async sendEmail(to: string, subject: string, content: string, templateId?: string): Promise<ComposioExecutionResult> {
    try {
      const response = await fetch('/api/composio/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, content, templateId }),
      });

      if (!response.ok) {
        throw new Error(`Email API error: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data,
        message: result.message || 'Email sent successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Email sending failed'
      };
    }
  }

  // Calendar Integration (Real API)
  async createCalendarEvent(
    title: string, 
    description: string, 
    startTime: string, 
    endTime: string, 
    attendees?: string[], 
    meetingLink?: string
  ): Promise<ComposioExecutionResult> {
    try {
      const response = await fetch('/api/composio/calendar/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title, 
          description, 
          startTime, 
          endTime, 
          attendees, 
          meetingLink 
        }),
      });

      if (!response.ok) {
        throw new Error(`Calendar API error: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data,
        message: result.message || 'Calendar event created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Calendar event creation failed'
      };
    }
  }

  // Social Media Integration - X (Twitter) (Real API)
  async postToX(content: string, scheduledTime?: string): Promise<ComposioExecutionResult> {
    try {
      const response = await fetch('/api/composio/twitter/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, scheduledTime }),
      });

      if (!response.ok) {
        throw new Error(`Twitter API error: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data,
        message: result.message || 'X post published successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Twitter posting failed'
      };
    }
  }

  // Get available tools/apps (Real API)
  async getAvailableApps(): Promise<ComposioExecutionResult> {
    try {
      const response = await fetch('/api/composio/apps/available', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Composio API error: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data,
        message: result.message || 'Available apps retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve available apps'
      };
    }
  }

  // Get entity connections (Real API)
  async getConnections(): Promise<ComposioExecutionResult> {
    try {
      const response = await fetch('/api/composio/connections', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Composio API error: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data,
        message: result.message || 'Connections retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve connections'
      };
    }
  }

  // Execute generic action (Real API)
  async executeAction(appName: string, actionName: string, params: any): Promise<ComposioExecutionResult> {
    try {
      const response = await fetch('/api/composio/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appName, actionName, params }),
      });

      if (!response.ok) {
        throw new Error(`Composio API error: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data,
        message: result.message || 'Action executed successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Action execution failed'
      };
    }
  }
}

// Export singleton instance with environment configuration
export const composioService = new ComposioService({
  apiKey: import.meta.env.VITE_COMPOSIO_API_KEY || '',
  baseUrl: import.meta.env.VITE_COMPOSIO_BASE_URL || 'https://api.composio.dev'
});

// Export the class for custom instances
export { ComposioService };