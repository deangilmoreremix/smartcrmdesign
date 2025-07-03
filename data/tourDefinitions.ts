import { TourStep } from '../components/ui/ComprehensiveTour';

// Header tour steps
export const headerTourSteps: TourStep[] = [
  {
    selector: '[data-tour="logo"]',
    content: `
      <div>
        <h3 class="text-lg font-semibold mb-2">Welcome to Smart CRM! 🎉</h3>
        <p class="text-sm text-gray-600 mb-3">
          Your intelligent CRM platform powered by cutting-edge AI technology. This logo always brings you back to the dashboard.
        </p>
        <ul class="text-xs space-y-1">
          <li>• AI-powered contact management</li>
          <li>• Intelligent deal pipeline tracking</li>
          <li>• Advanced business analytics</li>
        </ul>
      </div>
    `,
    position: 'bottom',
  },
  {
    selector: '[data-tour="navigation"]',
    content: `
      <div>
        <h3 class="text-lg font-semibold mb-2">Navigation Hub</h3>
        <p class="text-sm text-gray-600 mb-3">
          Access all your CRM tools through this main navigation menu.
        </p>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div><strong>Dashboard:</strong> Overview & insights</div>
          <div><strong>Contacts:</strong> Manage relationships</div>
          <div><strong>Deals:</strong> Track opportunities</div>
          <div><strong>AI Goals:</strong> Automation center</div>
        </div>
      </div>
    `,
    position: 'bottom',
  },
  {
    selector: '[data-tour="ai-tools"]',
    content: `
      <div>
        <h3 class="text-lg font-semibold mb-2">29+ AI-Powered Tools 🤖</h3>
        <p class="text-sm text-gray-600 mb-3">
          Discover intelligent assistants that automate your workflow and provide business insights.
        </p>
        <div class="space-y-2 text-xs">
          <div><strong>Core AI:</strong> Smart search, email composer, business analyzer</div>
          <div><strong>Communication:</strong> Email analysis, meeting summaries</div>
          <div><strong>Advanced:</strong> Document analysis, voice insights, lead scoring</div>
        </div>
        <p class="text-xs text-blue-600 mt-2">💡 Try clicking on any tool to see it in action!</p>
      </div>
    `,
    position: 'bottom',
    highlightedSelectors: ['[data-tour="ai-tools"] .dropdown-content'],
  },
  {
    selector: '[data-tour="quick-actions"]',
    content: `
      <div>
        <h3 class="text-lg font-semibold mb-2">Quick Actions ⚡</h3>
        <p class="text-sm text-gray-600 mb-3">
          Fast shortcuts to your most common tasks - create deals, contacts, schedule meetings, and send emails instantly.
        </p>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div>📝 <strong>New Deal:</strong> Quick opportunity entry</div>
          <div>👤 <strong>New Contact:</strong> Add prospects fast</div>
          <div>📅 <strong>Schedule:</strong> Book meetings</div>
          <div>✉️ <strong>Send Email:</strong> AI-powered composition</div>
        </div>
      </div>
    `,
    position: 'bottom',
  },
  {
    selector: '[data-tour="user-profile"]',
    content: `
      <div>
        <h3 class="text-lg font-semibold mb-2">Your Command Center</h3>
        <p class="text-sm text-gray-600 mb-3">
          Manage your account, preferences, and access advanced settings.
        </p>
        <ul class="text-xs space-y-1">
          <li>• Account settings & profile</li>
          <li>• Notification preferences</li>
          <li>• API key management</li>
          <li>• White-label customization</li>
          <li>• Help & support access</li>
        </ul>
      </div>
    `,
    position: 'bottom',
  },
];

// Dashboard tour steps
export const dashboardTourSteps: TourStep[] = [
  {
    selector: '[data-tour="welcome-header"]',
    content: `
      <div>
        <h3 class="text-lg font-semibold mb-2">Your Business Command Center 📊</h3>
        <p class="text-sm text-gray-600 mb-3">
          Get a complete overview of your business performance at a glance. This dashboard updates in real-time with your latest data.
        </p>
        <p class="text-xs text-green-600">✨ All data here is live from your actual CRM records!</p>
      </div>
    `,
    position: 'bottom',
  },
  {
    selector: '[data-tour="stats-cards"]',
    content: `
      <div>
        <h3 class="text-lg font-semibold mb-2">Key Performance Metrics 📈</h3>
        <p class="text-sm text-gray-600 mb-3">
          Monitor your most important business indicators with real-time statistics.
        </p>
        <div class="space-y-2 text-xs">
          <div><strong>Total Contacts:</strong> Your growing network</div>
          <div><strong>Active Deals:</strong> Opportunities in progress</div>
          <div><strong>Monthly Revenue:</strong> Financial performance</div>
          <div><strong>Conversion Rate:</strong> Sales effectiveness</div>
        </div>
        <p class="text-xs text-blue-600 mt-2">📊 Click any card for detailed analytics!</p>
      </div>
    `,
    position: 'bottom',
  },
  {
    selector: '[data-tour="quick-actions-dashboard"]',
    content: `
      <div>
        <h3 class="text-lg font-semibold mb-2">Instant Action Center ⚡</h3>
        <p class="text-sm text-gray-600 mb-3">
          Create new records instantly without leaving your dashboard. Each button includes helpful tooltips!
        </p>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div>🤝 <strong>New Deal:</strong> Track opportunities</div>
          <div>👥 <strong>New Contact:</strong> Build relationships</div>
          <div>📅 <strong>Schedule:</strong> AI meeting agenda</div>
          <div>📧 <strong>Send Email:</strong> Personalized outreach</div>
        </div>
        <p class="text-xs text-purple-600 mt-2">💡 Hover over any button for contextual help!</p>
      </div>
    `,
    position: 'top',
  },
  {
    selector: '[data-tour="ai-insights"]',
    content: `
      <div>
        <h3 class="text-lg font-semibold mb-2">AI-Powered Business Insights 🧠</h3>
        <p class="text-sm text-gray-600 mb-3">
          Get intelligent recommendations based on your actual business data and trends.
        </p>
        <ul class="text-xs space-y-1">
          <li>• Predictive deal analysis</li>
          <li>• Revenue forecasting</li>
          <li>• Customer behavior insights</li>
          <li>• Optimization recommendations</li>
        </ul>
        <p class="text-xs text-orange-600 mt-2">🔮 Click "Generate Insight" to see AI magic in action!</p>
      </div>
    `,
    position: 'top',
  },
  {
    selector: '[data-tour="pipeline-overview"]',
    content: `
      <div>
        <h3 class="text-lg font-semibold mb-2">Sales Pipeline Visualization 🎯</h3>
        <p class="text-sm text-gray-600 mb-3">
          Monitor your sales progression through each stage with interactive charts and analytics.
        </p>
        <div class="space-y-2 text-xs">
          <div><strong>Pipeline Stages:</strong> Lead → Qualified → Proposal → Closed</div>
          <div><strong>Deal Distribution:</strong> Visual breakdown by value</div>
          <div><strong>Conversion Rates:</strong> Stage-by-stage success metrics</div>
        </div>
        <p class="text-xs text-green-600 mt-2">📈 Interactive charts show real-time pipeline health!</p>
      </div>
    `,
    position: 'top',
  },
  {
    selector: '[data-tour="recent-activity"]',
    content: `
      <div>
        <h3 class="text-lg font-semibold mb-2">Activity Timeline 📋</h3>
        <p class="text-sm text-gray-600 mb-3">
          Stay updated with the latest changes across all your contacts, deals, and tasks.
        </p>
        <ul class="text-xs space-y-1">
          <li>• Real-time activity feed</li>
          <li>• Contact interactions</li>
          <li>• Deal progressions</li>
          <li>• Task completions</li>
        </ul>
        <p class="text-xs text-indigo-600 mt-2">🔔 Never miss important updates with this live feed!</p>
      </div>
    `,
    position: 'left',
  },
];

// Feature discovery tour (advanced features)
export const featureDiscoverySteps: TourStep[] = [
  {
    selector: '[data-tour="ai-goals-link"]',
    content: `
      <div>
        <h3 class="text-lg font-semibold mb-2">AI Goals: The Automation Hub 🎯</h3>
        <p class="text-sm text-gray-600 mb-3">
          Discover 21 pre-built business automation goals across 8 categories. Each goal uses multiple AI agents working together.
        </p>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div>📊 <strong>Sales:</strong> Lead scoring, pipeline optimization</div>
          <div>📢 <strong>Marketing:</strong> Campaign automation</div>
          <div>🤝 <strong>Relationship:</strong> Customer health monitoring</div>
          <div>⚙️ <strong>Operations:</strong> Workflow automation</div>
        </div>
        <p class="text-xs text-purple-600 mt-2">🚀 Each goal can save hours of manual work!</p>
      </div>
    `,
    position: 'right',
  },
  {
    selector: '[data-tour="smart-search"]',
    content: `
      <div>
        <h3 class="text-lg font-semibold mb-2">Semantic Smart Search 🔍</h3>
        <p class="text-sm text-gray-600 mb-3">
          Search using natural language across all your CRM data. Ask questions like "Show me high-value prospects from last month."
        </p>
        <div class="space-y-2 text-xs">
          <div><strong>Natural Language:</strong> "Find contacts in tech industry"</div>
          <div><strong>Context Aware:</strong> Understands relationships and patterns</div>
          <div><strong>Multi-Entity:</strong> Searches contacts, deals, and tasks</div>
        </div>
      </div>
    `,
    position: 'bottom',
  },
  {
    selector: '[data-tour="voice-analysis"]',
    content: `
      <div>
        <h3 class="text-lg font-semibold mb-2">Real-Time Voice Analysis 🎙️</h3>
        <p class="text-sm text-gray-600 mb-3">
          Get live insights during calls with sentiment analysis, key topic detection, and conversation guidance.
        </p>
        <ul class="text-xs space-y-1">
          <li>• Real-time sentiment tracking</li>
          <li>• Key topic identification</li>
          <li>• Objection handling suggestions</li>
          <li>• Call quality scoring</li>
        </ul>
      </div>
    `,
    position: 'top',
  },
];

// Role-based tour configurations
export const roleTours = {
  'sales': [...headerTourSteps, ...dashboardTourSteps],
  'marketing': [
    ...headerTourSteps.slice(0, 3),
    {
      selector: '[data-tour="ai-tools"]',
      content: `
        <div>
          <h3 class="text-lg font-semibold mb-2">Marketing AI Tools 📢</h3>
          <p class="text-sm text-gray-600 mb-3">
            Focus on tools that boost your marketing effectiveness.
          </p>
          <ul class="text-xs space-y-1">
            <li>• Content Generator for campaigns</li>
            <li>• Email Composer for outreach</li>
            <li>• Lead Scoring for qualification</li>
            <li>• Campaign Analytics</li>
          </ul>
        </div>
      `,
      position: 'bottom',
    },
    ...dashboardTourSteps.slice(2),
  ],
  'admin': [...headerTourSteps, ...featureDiscoverySteps],
  'new_user': [
    {
      selector: '[data-tour="welcome"]',
      content: `
        <div>
          <h3 class="text-lg font-semibold mb-2">Welcome to Smart CRM! 🎉</h3>
          <p class="text-sm text-gray-600 mb-3">
            Let's take a quick tour to get you started with the most powerful features.
          </p>
          <p class="text-xs text-blue-600">This tour will take about 2 minutes and can be paused anytime.</p>
        </div>
      `,
      position: 'center',
    },
    ...headerTourSteps,
    ...dashboardTourSteps,
  ],
};

// Tour metadata for analytics and management
export const tourMetadata = {
  header: {
    id: 'header-tour',
    name: 'Header Navigation Tour',
    description: 'Learn about the main navigation and tools',
    estimatedDuration: 90, // seconds
    category: 'navigation',
    priority: 'high',
    steps: headerTourSteps,
  },
  dashboard: {
    id: 'dashboard-tour',
    name: 'Dashboard Overview Tour',
    description: 'Understand your business metrics and quick actions',
    estimatedDuration: 120,
    category: 'overview',
    priority: 'high',
    steps: dashboardTourSteps,
  },
  features: {
    id: 'feature-discovery',
    name: 'Advanced Features Tour',
    description: 'Discover powerful AI tools and automation',
    estimatedDuration: 180,
    category: 'advanced',
    priority: 'medium',
    steps: featureDiscoverySteps,
  },
};

export default {
  headerTourSteps,
  dashboardTourSteps,
  featureDiscoverySteps,
  roleTours,
  tourMetadata,
};