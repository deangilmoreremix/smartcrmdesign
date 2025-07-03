export interface AIGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  complexity: 'Simple' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  recommendedFor: ('contact' | 'deal' | 'company')[];
  toolMapping?: string; // Maps to existing AI tools
}

export const AI_GOALS: AIGoal[] = [
  // Sales Goals (15 goals)
  {
    id: 'leadScoring',
    title: 'Lead Scoring & Qualification',
    description: 'Automatically score and qualify leads based on engagement and fit',
    category: 'Sales',
    icon: 'BarChart3',
    complexity: 'Simple',
    estimatedTime: '2-3 minutes',
    recommendedFor: ['contact'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'emailPersonalization',
    title: 'Personalized Email Generation',
    description: 'Create highly personalized outreach emails based on prospect data',
    category: 'Sales',
    icon: 'Mail',
    complexity: 'Simple',
    estimatedTime: '1-2 minutes',
    recommendedFor: ['contact'],
    toolMapping: 'email-composer'
  },
  {
    id: 'pipelineOptimization',
    title: 'Sales Pipeline Optimization',
    description: 'Analyze and optimize your sales pipeline for maximum conversion',
    category: 'Sales',
    icon: 'TrendingUp',
    complexity: 'Advanced',
    estimatedTime: '10-15 minutes',
    recommendedFor: ['deal'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'dealRiskAssessment',
    title: 'Deal Risk Assessment',
    description: 'Evaluate risk factors and probability of deal closure',
    category: 'Sales',
    icon: 'AlertTriangle',
    complexity: 'Intermediate',
    estimatedTime: '5-7 minutes',
    recommendedFor: ['deal'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'competitorAnalysis',
    title: 'Competitive Intelligence',
    description: 'Research competitors and create competitive battle cards',
    category: 'Sales',
    icon: 'Shield',
    complexity: 'Advanced',
    estimatedTime: '15-20 minutes',
    recommendedFor: ['company'],
    toolMapping: 'smart-search'
  },
  {
    id: 'proposalGeneration',
    title: 'Proposal Generation',
    description: 'Create customized proposals based on client requirements',
    category: 'Sales',
    icon: 'FileText',
    complexity: 'Intermediate',
    estimatedTime: '8-12 minutes',
    recommendedFor: ['deal'],
    toolMapping: 'content-generator'
  },
  {
    id: 'salesForecast',
    title: 'Sales Forecasting',
    description: 'Predict future sales performance and revenue trends',
    category: 'Sales',
    icon: 'TrendingUp',
    complexity: 'Advanced',
    estimatedTime: '12-15 minutes',
    recommendedFor: ['deal'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'callPrep',
    title: 'Sales Call Preparation',
    description: 'Generate talking points and questions for sales calls',
    category: 'Sales',
    icon: 'Phone',
    complexity: 'Simple',
    estimatedTime: '3-5 minutes',
    recommendedFor: ['contact'],
    toolMapping: 'content-generator'
  },
  {
    id: 'objectionHandling',
    title: 'Objection Handling Scripts',
    description: 'Create responses to common sales objections',
    category: 'Sales',
    icon: 'MessageCircle',
    complexity: 'Intermediate',
    estimatedTime: '5-8 minutes',
    recommendedFor: ['contact'],
    toolMapping: 'content-generator'
  },
  {
    id: 'territoryPlanning',
    title: 'Territory Planning',
    description: 'Optimize sales territory assignments and coverage',
    category: 'Sales',
    icon: 'Map',
    complexity: 'Advanced',
    estimatedTime: '20-25 minutes',
    recommendedFor: ['company'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'quotaPlanning',
    title: 'Quota Planning & Allocation',
    description: 'Set realistic quotas based on historical performance',
    category: 'Sales',
    icon: 'Target',
    complexity: 'Advanced',
    estimatedTime: '15-20 minutes',
    recommendedFor: ['company'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'winLossAnalysis',
    title: 'Win/Loss Analysis',
    description: 'Analyze why deals are won or lost for improvement',
    category: 'Sales',
    icon: 'BarChart',
    complexity: 'Intermediate',
    estimatedTime: '8-10 minutes',
    recommendedFor: ['deal'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'crossSellUpsell',
    title: 'Cross-sell & Upsell Opportunities',
    description: 'Identify opportunities to expand existing accounts',
    category: 'Sales',
    icon: 'ArrowUpRight',
    complexity: 'Intermediate',
    estimatedTime: '6-8 minutes',
    recommendedFor: ['contact'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'salesCoaching',
    title: 'Sales Performance Coaching',
    description: 'Generate personalized coaching recommendations',
    category: 'Sales',
    icon: 'Users',
    complexity: 'Advanced',
    estimatedTime: '10-15 minutes',
    recommendedFor: ['company'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'accountPlanning',
    title: 'Strategic Account Planning',
    description: 'Develop comprehensive strategies for key accounts',
    category: 'Sales',
    icon: 'Building',
    complexity: 'Advanced',
    estimatedTime: '15-20 minutes',
    recommendedFor: ['company'],
    toolMapping: 'business-analyzer'
  },

  // Marketing Goals (12 goals)
  {
    id: 'campaignOptimization',
    title: 'Marketing Campaign Optimization',
    description: 'Optimize marketing campaigns for better ROI and engagement',
    category: 'Marketing',
    icon: 'Megaphone',
    complexity: 'Advanced',
    estimatedTime: '12-15 minutes',
    recommendedFor: ['company'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'contentCalendar',
    title: 'Content Calendar Creation',
    description: 'Generate strategic content calendars for social media',
    category: 'Marketing',
    icon: 'Calendar',
    complexity: 'Intermediate',
    estimatedTime: '8-10 minutes',
    recommendedFor: ['company'],
    toolMapping: 'content-generator'
  },
  {
    id: 'audienceSegmentation',
    title: 'Audience Segmentation',
    description: 'Segment audiences for targeted marketing campaigns',
    category: 'Marketing',
    icon: 'Users',
    complexity: 'Intermediate',
    estimatedTime: '6-8 minutes',
    recommendedFor: ['contact'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'adCopyGeneration',
    title: 'Ad Copy Generation',
    description: 'Create compelling ad copy for various platforms',
    category: 'Marketing',
    icon: 'Edit',
    complexity: 'Simple',
    estimatedTime: '3-5 minutes',
    recommendedFor: ['company'],
    toolMapping: 'content-generator'
  },
  {
    id: 'brandMessaging',
    title: 'Brand Messaging Strategy',
    description: 'Develop consistent brand messaging across channels',
    category: 'Marketing',
    icon: 'Mic',
    complexity: 'Advanced',
    estimatedTime: '15-20 minutes',
    recommendedFor: ['company'],
    toolMapping: 'content-generator'
  },
  {
    id: 'influencerMatching',
    title: 'Influencer Partnership Matching',
    description: 'Find and match relevant influencers for partnerships',
    category: 'Marketing',
    icon: 'Star',
    complexity: 'Intermediate',
    estimatedTime: '10-12 minutes',
    recommendedFor: ['company'],
    toolMapping: 'smart-search'
  },
  {
    id: 'emailSequences',
    title: 'Email Marketing Sequences',
    description: 'Create automated email nurture sequences',
    category: 'Marketing',
    icon: 'Mail',
    complexity: 'Intermediate',
    estimatedTime: '8-10 minutes',
    recommendedFor: ['contact'],
    toolMapping: 'email-composer'
  },
  {
    id: 'landingPageOptimization',
    title: 'Landing Page Optimization',
    description: 'Optimize landing pages for better conversion rates',
    category: 'Marketing',
    icon: 'MousePointer',
    complexity: 'Advanced',
    estimatedTime: '12-15 minutes',
    recommendedFor: ['company'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'socialMediaStrategy',
    title: 'Social Media Strategy',
    description: 'Develop comprehensive social media strategies',
    category: 'Marketing',
    icon: 'Share2',
    complexity: 'Advanced',
    estimatedTime: '15-18 minutes',
    recommendedFor: ['company'],
    toolMapping: 'content-generator'
  },
  {
    id: 'marketResearch',
    title: 'Market Research Analysis',
    description: 'Conduct comprehensive market research and analysis',
    category: 'Marketing',
    icon: 'Search',
    complexity: 'Advanced',
    estimatedTime: '18-25 minutes',
    recommendedFor: ['company'],
    toolMapping: 'smart-search'
  },
  {
    id: 'customerJourneyMapping',
    title: 'Customer Journey Mapping',
    description: 'Map and optimize customer touchpoints and experiences',
    category: 'Marketing',
    icon: 'Route',
    complexity: 'Advanced',
    estimatedTime: '15-20 minutes',
    recommendedFor: ['contact'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'retargetingStrategy',
    title: 'Retargeting Campaign Strategy',
    description: 'Create strategies to re-engage lost prospects',
    category: 'Marketing',
    icon: 'RotateCcw',
    complexity: 'Intermediate',
    estimatedTime: '8-10 minutes',
    recommendedFor: ['contact'],
    toolMapping: 'business-analyzer'
  },

  // Relationship Goals (8 goals)
  {
    id: 'customerHealthScore',
    title: 'Customer Health Monitoring',
    description: 'Monitor and score customer relationship health',
    category: 'Relationship',
    icon: 'Heart',
    complexity: 'Intermediate',
    estimatedTime: '5-7 minutes',
    recommendedFor: ['contact'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'onboardingAutomation',
    title: 'Customer Onboarding Automation',
    description: 'Create personalized onboarding experiences',
    category: 'Relationship',
    icon: 'UserPlus',
    complexity: 'Advanced',
    estimatedTime: '12-15 minutes',
    recommendedFor: ['contact'],
    toolMapping: 'email-composer'
  },
  {
    id: 'churnPrediction',
    title: 'Churn Risk Prediction',
    description: 'Predict which customers are at risk of churning',
    category: 'Relationship',
    icon: 'AlertCircle',
    complexity: 'Advanced',
    estimatedTime: '10-12 minutes',
    recommendedFor: ['contact'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'feedbackAnalysis',
    title: 'Customer Feedback Analysis',
    description: 'Analyze and categorize customer feedback for insights',
    category: 'Relationship',
    icon: 'MessageSquare',
    complexity: 'Intermediate',
    estimatedTime: '8-10 minutes',
    recommendedFor: ['contact'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'loyaltyProgram',
    title: 'Loyalty Program Design',
    description: 'Design customer loyalty and rewards programs',
    category: 'Relationship',
    icon: 'Gift',
    complexity: 'Advanced',
    estimatedTime: '15-20 minutes',
    recommendedFor: ['company'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'supportTicketRouting',
    title: 'Support Ticket Intelligent Routing',
    description: 'Automatically route support tickets to appropriate teams',
    category: 'Relationship',
    icon: 'HelpCircle',
    complexity: 'Advanced',
    estimatedTime: '10-15 minutes',
    recommendedFor: ['contact'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'npsOptimization',
    title: 'NPS Score Optimization',
    description: 'Analyze and improve Net Promoter Score strategies',
    category: 'Relationship',
    icon: 'ThumbsUp',
    complexity: 'Intermediate',
    estimatedTime: '8-10 minutes',
    recommendedFor: ['contact'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'renewalPrediction',
    title: 'Renewal Probability Scoring',
    description: 'Predict likelihood of contract renewals',
    category: 'Relationship',
    icon: 'RefreshCw',
    complexity: 'Advanced',
    estimatedTime: '10-12 minutes',
    recommendedFor: ['deal'],
    toolMapping: 'business-analyzer'
  },

  // Automation Goals (8 goals)
  {
    id: 'workflowDesigner',
    title: 'Business Workflow Designer',
    description: 'Design and optimize business process workflows',
    category: 'Automation',
    icon: 'Workflow',
    complexity: 'Advanced',
    estimatedTime: '15-20 minutes',
    recommendedFor: ['company'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'meetingScheduling',
    title: 'Smart Meeting Scheduling',
    description: 'Automate meeting scheduling and calendar management',
    category: 'Automation',
    icon: 'Calendar',
    complexity: 'Intermediate',
    estimatedTime: '6-8 minutes',
    recommendedFor: ['contact'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'invoiceProcessing',
    title: 'Automated Invoice Processing',
    description: 'Automate invoice generation and payment processing',
    category: 'Automation',
    icon: 'Receipt',
    complexity: 'Advanced',
    estimatedTime: '12-15 minutes',
    recommendedFor: ['deal'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'dataEntry',
    title: 'Automated Data Entry',
    description: 'Automate repetitive data entry tasks across systems',
    category: 'Automation',
    icon: 'Database',
    complexity: 'Intermediate',
    estimatedTime: '8-10 minutes',
    recommendedFor: ['contact'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'reportGeneration',
    title: 'Automated Report Generation',
    description: 'Generate regular business reports automatically',
    category: 'Automation',
    icon: 'FileOutput',
    complexity: 'Advanced',
    estimatedTime: '10-12 minutes',
    recommendedFor: ['company'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'taskAssignment',
    title: 'Intelligent Task Assignment',
    description: 'Automatically assign tasks based on workload and skills',
    category: 'Automation',
    icon: 'UserCheck',
    complexity: 'Advanced',
    estimatedTime: '10-15 minutes',
    recommendedFor: ['company'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'followUpReminders',
    title: 'Automated Follow-up System',
    description: 'Create intelligent follow-up reminder systems',
    category: 'Automation',
    icon: 'Bell',
    complexity: 'Intermediate',
    estimatedTime: '6-8 minutes',
    recommendedFor: ['contact'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'inventoryManagement',
    title: 'Smart Inventory Management',
    description: 'Automate inventory tracking and reorder points',
    category: 'Automation',
    icon: 'Package',
    complexity: 'Advanced',
    estimatedTime: '15-18 minutes',
    recommendedFor: ['company'],
    toolMapping: 'business-analyzer'
  },

  // Analytics Goals (8 goals)
  {
    id: 'businessIntelligence',
    title: 'Business Intelligence Dashboard',
    description: 'Create comprehensive BI dashboards with key metrics',
    category: 'Analytics',
    icon: 'BarChart3',
    complexity: 'Advanced',
    estimatedTime: '15-20 minutes',
    recommendedFor: ['company'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'performanceMetrics',
    title: 'Performance Metrics Analysis',
    description: 'Analyze team and individual performance metrics',
    category: 'Analytics',
    icon: 'Activity',
    complexity: 'Intermediate',
    estimatedTime: '8-10 minutes',
    recommendedFor: ['company'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'customerLifetimeValue',
    title: 'Customer Lifetime Value Prediction',
    description: 'Calculate and predict customer lifetime value',
    category: 'Analytics',
    icon: 'DollarSign',
    complexity: 'Advanced',
    estimatedTime: '12-15 minutes',
    recommendedFor: ['contact'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'trendsAnalysis',
    title: 'Market Trends Analysis',
    description: 'Identify and analyze market trends and opportunities',
    category: 'Analytics',
    icon: 'TrendingUp',
    complexity: 'Advanced',
    estimatedTime: '15-18 minutes',
    recommendedFor: ['company'],
    toolMapping: 'smart-search'
  },
  {
    id: 'cohortAnalysis',
    title: 'Customer Cohort Analysis',
    description: 'Analyze customer behavior across different cohorts',
    category: 'Analytics',
    icon: 'Users',
    complexity: 'Advanced',
    estimatedTime: '12-15 minutes',
    recommendedFor: ['contact'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'conversionOptimization',
    title: 'Conversion Rate Optimization',
    description: 'Optimize conversion rates across all touchpoints',
    category: 'Analytics',
    icon: 'Target',
    complexity: 'Advanced',
    estimatedTime: '15-18 minutes',
    recommendedFor: ['company'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'competitiveAnalytics',
    title: 'Competitive Analytics Dashboard',
    description: 'Track and analyze competitor performance metrics',
    category: 'Analytics',
    icon: 'Eye',
    complexity: 'Advanced',
    estimatedTime: '18-22 minutes',
    recommendedFor: ['company'],
    toolMapping: 'smart-search'
  },
  {
    id: 'roiCalculation',
    title: 'ROI & Attribution Analysis',
    description: 'Calculate ROI and attribute revenue to marketing efforts',
    category: 'Analytics',
    icon: 'Calculator',
    complexity: 'Advanced',
    estimatedTime: '12-15 minutes',
    recommendedFor: ['company'],
    toolMapping: 'business-analyzer'
  },

  // Content Goals (6 goals)
  {
    id: 'blogGeneration',
    title: 'Blog Content Generation',
    description: 'Generate SEO-optimized blog posts and articles',
    category: 'Content',
    icon: 'FileText',
    complexity: 'Intermediate',
    estimatedTime: '10-15 minutes',
    recommendedFor: ['company'],
    toolMapping: 'content-generator'
  },
  {
    id: 'videoScripts',
    title: 'Video Script Creation',
    description: 'Create engaging scripts for marketing videos',
    category: 'Content',
    icon: 'Video',
    complexity: 'Intermediate',
    estimatedTime: '8-12 minutes',
    recommendedFor: ['company'],
    toolMapping: 'content-generator'
  },
  {
    id: 'socialPosts',
    title: 'Social Media Post Generation',
    description: 'Generate engaging social media content across platforms',
    category: 'Content',
    icon: 'Share2',
    complexity: 'Simple',
    estimatedTime: '3-5 minutes',
    recommendedFor: ['company'],
    toolMapping: 'content-generator'
  },
  {
    id: 'newsletterCreation',
    title: 'Newsletter Content Creation',
    description: 'Create compelling newsletter content and layouts',
    category: 'Content',
    icon: 'Mail',
    complexity: 'Intermediate',
    estimatedTime: '8-10 minutes',
    recommendedFor: ['company'],
    toolMapping: 'content-generator'
  },
  {
    id: 'seoOptimization',
    title: 'SEO Content Optimization',
    description: 'Optimize content for search engine rankings',
    category: 'Content',
    icon: 'Search',
    complexity: 'Advanced',
    estimatedTime: '12-15 minutes',
    recommendedFor: ['company'],
    toolMapping: 'content-generator'
  },
  {
    id: 'caseStudyGeneration',
    title: 'Case Study Creation',
    description: 'Generate compelling customer case studies',
    category: 'Content',
    icon: 'BookOpen',
    complexity: 'Advanced',
    estimatedTime: '15-20 minutes',
    recommendedFor: ['deal'],
    toolMapping: 'content-generator'
  },

  // AI-Native Goals (5 goals)
  {
    id: 'documentIntelligence',
    title: 'Document Intelligence Processing',
    description: 'Extract insights and data from business documents',
    category: 'AI-Native',
    icon: 'FileSearch',
    complexity: 'Advanced',
    estimatedTime: '8-12 minutes',
    recommendedFor: ['company'],
    toolMapping: 'document-analyzer'
  },
  {
    id: 'predictiveMaintenance',
    title: 'Predictive Maintenance System',
    description: 'Predict equipment failures and maintenance needs',
    category: 'AI-Native',
    icon: 'Wrench',
    complexity: 'Advanced',
    estimatedTime: '20-25 minutes',
    recommendedFor: ['company'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'fraudDetection',
    title: 'Fraud Detection & Prevention',
    description: 'Detect and prevent fraudulent activities and transactions',
    category: 'AI-Native',
    icon: 'Shield',
    complexity: 'Advanced',
    estimatedTime: '15-20 minutes',
    recommendedFor: ['company'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'imageRecognition',
    title: 'Image Recognition & Tagging',
    description: 'Automatically tag and categorize images and visual content',
    category: 'AI-Native',
    icon: 'Image',
    complexity: 'Advanced',
    estimatedTime: '10-15 minutes',
    recommendedFor: ['company'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'naturalLanguageProcessing',
    title: 'Natural Language Processing',
    description: 'Process and analyze unstructured text data for insights',
    category: 'AI-Native',
    icon: 'MessageCircle',
    complexity: 'Advanced',
    estimatedTime: '12-18 minutes',
    recommendedFor: ['contact'],
    toolMapping: 'business-analyzer'
  }
];

export const AI_GOAL_CATEGORIES = [
  'Sales',
  'Marketing', 
  'Relationship',
  'Automation',
  'Analytics',
  'Content',
  'AI-Native'
];

export const getGoalById = (id: string): AIGoal | undefined => {
  return AI_GOALS.find(goal => goal.id === id);
};

export const getGoalsByCategory = (category: string): AIGoal[] => {
  return AI_GOALS.filter(goal => goal.category === category);
};

export const getRecommendedGoals = (entityType: 'contact' | 'deal' | 'company'): AIGoal[] => {
  return AI_GOALS.filter(goal => goal.recommendedFor.includes(entityType));
};

export const getGoalsByComplexity = (complexity: 'Simple' | 'Intermediate' | 'Advanced'): AIGoal[] => {
  return AI_GOALS.filter(goal => goal.complexity === complexity);
};