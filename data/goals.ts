import { Goal } from '../types/goals';

export const GOALS: Goal[] = [
  // Sales Goals (14)
  {
    id: 'lead-scoring',
    title: 'Automated Lead Scoring System',
    description: 'Implement an AI-powered lead scoring system that automatically evaluates and prioritizes incoming leads based on behavioral data, company profile, and engagement metrics.',
    businessImpact: 'Increase sales team efficiency by 40% and improve conversion rates by focusing on high-quality leads first.',
    priority: 'High',
    complexity: 'Advanced',
    category: 'Sales',
    agentsRequired: ['Lead Analyzer', 'Data Processor', 'CRM Integrator', 'Score Calculator'],
    toolsNeeded: ['CRM API', 'ML Pipeline', 'Webhook System', 'Analytics Dashboard'],
    estimatedSetupTime: '2-3 hours',
    roi: '250-400% within 6 months',
    realWorldExample: 'A SaaS company implemented this system and saw their sales team close 35% more deals by focusing only on leads scored above 75/100, while reducing time spent on unqualified prospects by 60%.',
    prerequisite: ['CRM system with API access', 'Lead tracking data (minimum 3 months)', 'Sales team buy-in and training'],
    successMetrics: ['Lead-to-opportunity conversion rate increase by 25%', 'Sales cycle reduction by 15%', 'Sales team productivity increase by 40%', 'Cost per acquisition reduction by 20%']
  },
  {
    id: 'proposal-generator',
    title: 'AI Proposal Generation',
    description: 'Generate customized sales proposals using AI that adapts content, pricing, and terms based on prospect profile and conversation history.',
    businessImpact: 'Reduce proposal creation time by 75% and increase win rates by 30% through personalized, data-driven proposals.',
    priority: 'High',
    complexity: 'Intermediate',
    category: 'Sales',
    agentsRequired: ['Content Generator', 'Pricing Optimizer', 'Document Formatter'],
    toolsNeeded: ['Document Templates', 'Pricing Engine', 'CRM Integration'],
    estimatedSetupTime: '1-2 hours',
    roi: '200-350% within 4 months',
    realWorldExample: 'A consulting firm increased their proposal acceptance rate from 25% to 40% by using AI to customize proposals based on client industry, size, and previous interactions.',
    prerequisite: ['Proposal templates', 'Pricing guidelines', 'Customer data access'],
    successMetrics: ['Proposal creation time reduction by 75%', 'Win rate increase by 30%', 'Proposal quality score improvement by 45%']
  },
  {
    id: 'pipeline-optimization',
    title: 'Sales Pipeline Optimization',
    description: 'Optimize sales pipeline stages and activities using AI analysis of historical data and performance patterns.',
    businessImpact: 'Increase overall pipeline velocity by 35% and improve forecasting accuracy by 50%.',
    priority: 'Medium',
    complexity: 'Advanced',
    category: 'Sales',
    agentsRequired: ['Pipeline Analyzer', 'Performance Tracker', 'Forecasting Engine'],
    toolsNeeded: ['CRM Analytics', 'Historical Data', 'Performance Metrics'],
    estimatedSetupTime: '3-4 hours',
    roi: '180-280% within 6 months',
    realWorldExample: 'A technology company reduced their average sales cycle from 90 to 60 days by identifying and eliminating bottlenecks in their pipeline stages.',
    prerequisite: ['6+ months of sales data', 'Defined pipeline stages', 'Sales team metrics'],
    successMetrics: ['Sales velocity increase by 35%', 'Forecast accuracy improvement by 50%', 'Stage conversion rate optimization']
  },

  // Marketing Goals (12)
  {
    id: 'email-campaigns',
    title: 'Smart Email Campaign Generator',
    description: 'Create personalized email campaigns using AI that adapts content, timing, and frequency based on recipient behavior and preferences.',
    businessImpact: 'Boost email engagement rates by 60% and reduce unsubscribe rates by 30% through hyper-personalization.',
    priority: 'Medium',
    complexity: 'Intermediate',
    category: 'Marketing',
    agentsRequired: ['Content Creator', 'Personalization Engine', 'Timing Optimizer'],
    toolsNeeded: ['Email Platform API', 'Customer Data Platform', 'A/B Testing Framework'],
    estimatedSetupTime: '1-2 hours',
    roi: '180-300% within 4 months',
    realWorldExample: 'An e-commerce brand increased their email revenue by 85% by using AI to personalize subject lines, product recommendations, and send times for each customer segment.',
    prerequisite: ['Email marketing platform', 'Customer behavioral data', 'Brand voice guidelines'],
    successMetrics: ['Open rate increase by 45%', 'Click-through rate increase by 60%', 'Revenue per email increase by 75%', 'Unsubscribe rate decrease by 30%']
  },
  {
    id: 'content-calendar',
    title: 'Automated Content Calendar',
    description: 'Generate and schedule content across multiple channels using AI that considers audience preferences, trending topics, and optimal posting times.',
    businessImpact: 'Increase content engagement by 50% and reduce content creation time by 60% through automated planning and optimization.',
    priority: 'Medium',
    complexity: 'Intermediate',
    category: 'Marketing',
    agentsRequired: ['Content Planner', 'Trend Analyzer', 'Scheduling Optimizer'],
    toolsNeeded: ['Social Media APIs', 'Content Management System', 'Analytics Platform'],
    estimatedSetupTime: '2-3 hours',
    roi: '150-250% within 5 months',
    realWorldExample: 'A marketing agency increased their client engagement rates by 65% by using AI to optimize content timing and topics based on audience behavior patterns.',
    prerequisite: ['Social media accounts', 'Content guidelines', 'Audience analytics'],
    successMetrics: ['Engagement rate increase by 50%', 'Content creation time reduction by 60%', 'Posting consistency improvement by 80%']
  },

  // Relationship Goals (8)
  {
    id: 'customer-health',
    title: 'Customer Health Monitoring',
    description: 'Monitor customer engagement and satisfaction in real-time to predict churn risk and trigger proactive retention campaigns.',
    businessImpact: 'Reduce customer churn by 45% and increase customer lifetime value by identifying at-risk customers early.',
    priority: 'High',
    complexity: 'Simple',
    category: 'Relationship',
    agentsRequired: ['Health Monitor', 'Risk Assessor', 'Retention Specialist'],
    toolsNeeded: ['Customer Data Platform', 'Analytics Engine', 'Communication Tools'],
    estimatedSetupTime: '30-60 minutes',
    roi: '300-500% within 3 months',
    realWorldExample: 'A SaaS company reduced churn from 8% to 4.5% monthly by implementing proactive outreach to customers showing declining engagement patterns.',
    prerequisite: ['Customer usage data', 'Communication channels', 'Support team process'],
    successMetrics: ['Churn rate reduction by 45%', 'Customer lifetime value increase by 35%', 'Early warning accuracy by 85%']
  },
  {
    id: 'onboarding-automation',
    title: 'Automated Customer Onboarding',
    description: 'Create personalized onboarding sequences that adapt based on customer profile, goals, and progress through the process.',
    businessImpact: 'Increase onboarding completion rates by 70% and reduce time-to-value by 50% through personalized guidance.',
    priority: 'High',
    complexity: 'Intermediate',
    category: 'Relationship',
    agentsRequired: ['Onboarding Guide', 'Progress Tracker', 'Experience Optimizer'],
    toolsNeeded: ['Workflow Automation', 'Progress Analytics', 'Communication Platform'],
    estimatedSetupTime: '2-3 hours',
    roi: '200-400% within 3 months',
    realWorldExample: 'A fintech startup increased their user activation rate from 40% to 68% by implementing AI-driven personalized onboarding flows.',
    prerequisite: ['Onboarding process mapping', 'User segmentation data', 'Success metrics definition'],
    successMetrics: ['Completion rate increase by 70%', 'Time-to-value reduction by 50%', 'User satisfaction score improvement by 40%']
  },

  // Automation Goals (8)
  {
    id: 'invoice-processing',
    title: 'Automated Invoice Processing',
    description: 'Automate invoice creation, approval workflows, and payment tracking using AI to extract data and validate information.',
    businessImpact: 'Reduce invoice processing time by 80% and improve accuracy by 95% while eliminating manual data entry errors.',
    priority: 'Medium',
    complexity: 'Simple',
    category: 'Automation',
    agentsRequired: ['Data Extractor', 'Validation Engine', 'Workflow Manager'],
    toolsNeeded: ['OCR Technology', 'Accounting System', 'Approval Workflows'],
    estimatedSetupTime: '1-2 hours',
    roi: '150-300% within 6 months',
    realWorldExample: 'An accounting firm reduced invoice processing from 30 minutes to 3 minutes per invoice while achieving 99.5% accuracy in data extraction.',
    prerequisite: ['Accounting system access', 'Approval process definition', 'Invoice templates'],
    successMetrics: ['Processing time reduction by 80%', 'Accuracy improvement to 95%', 'Manual errors elimination by 90%']
  },

  // Analytics Goals (6)
  {
    id: 'business-intelligence',
    title: 'AI Business Intelligence Dashboard',
    description: 'Create intelligent dashboards that automatically identify trends, anomalies, and business insights from multiple data sources.',
    businessImpact: 'Improve decision-making speed by 60% and identify revenue opportunities 3x faster through automated insights.',
    priority: 'High',
    complexity: 'Advanced',
    category: 'Analytics',
    agentsRequired: ['Data Analyst', 'Pattern Detector', 'Insight Generator'],
    toolsNeeded: ['Data Warehouse', 'Visualization Tools', 'Machine Learning Pipeline'],
    estimatedSetupTime: '4-6 hours',
    roi: '250-450% within 8 months',
    realWorldExample: 'A retail chain discovered $2M in lost revenue opportunities by using AI to identify patterns in customer behavior and inventory data.',
    prerequisite: ['Data warehouse setup', 'Business metrics definition', 'Stakeholder requirements'],
    successMetrics: ['Decision speed increase by 60%', 'Insight discovery rate increase by 300%', 'Revenue opportunity identification improvement']
  },

  // Content Goals (6)
  {
    id: 'blog-generation',
    title: 'Automated Blog Content Generation',
    description: 'Generate high-quality blog content using AI that maintains brand voice, targets specific keywords, and optimizes for SEO.',
    businessImpact: 'Increase content production by 500% and improve organic search rankings by 40% through consistent, optimized content.',
    priority: 'Medium',
    complexity: 'Intermediate',
    category: 'Content',
    agentsRequired: ['Content Writer', 'SEO Optimizer', 'Brand Voice Maintainer'],
    toolsNeeded: ['Content Management System', 'SEO Tools', 'Brand Guidelines'],
    estimatedSetupTime: '2-3 hours',
    roi: '180-320% within 6 months',
    realWorldExample: 'A B2B software company increased organic traffic by 150% by publishing AI-generated blog posts that consistently ranked in top 10 search results.',
    prerequisite: ['Content strategy', 'SEO keyword research', 'Brand voice guidelines'],
    successMetrics: ['Content production increase by 500%', 'Organic traffic growth by 40%', 'Search ranking improvement']
  },

  // Admin Goals (4)
  {
    id: 'hr-processing',
    title: 'HR Document Processing',
    description: 'Automate HR processes including resume screening, employee onboarding documentation, and performance review analysis.',
    businessImpact: 'Reduce HR administrative work by 70% and improve hiring decision accuracy by 45% through automated screening.',
    priority: 'Low',
    complexity: 'Simple',
    category: 'Admin',
    agentsRequired: ['Document Processor', 'Screening Engine', 'Compliance Checker'],
    toolsNeeded: ['HRIS System', 'Document Management', 'Compliance Database'],
    estimatedSetupTime: '1-2 hours',
    roi: '120-200% within 4 months',
    realWorldExample: 'An HR department reduced resume screening time from 2 hours to 15 minutes per position while improving candidate quality scores by 35%.',
    prerequisite: ['HR system access', 'Job description templates', 'Compliance requirements'],
    successMetrics: ['Administrative work reduction by 70%', 'Hiring accuracy improvement by 45%', 'Processing time reduction by 85%']
  },

  // AI-Native Goals (4)
  {
    id: 'document-intelligence',
    title: 'Document Intelligence System',
    description: 'Extract, analyze, and process information from various document types using advanced AI to automate knowledge management.',
    businessImpact: 'Reduce document processing time by 90% and improve information accuracy by 85% through intelligent extraction.',
    priority: 'High',
    complexity: 'Advanced',
    category: 'AI-Native',
    agentsRequired: ['Document Analyzer', 'Information Extractor', 'Knowledge Organizer'],
    toolsNeeded: ['OCR Technology', 'NLP Engine', 'Knowledge Base'],
    estimatedSetupTime: '3-4 hours',
    roi: '200-400% within 6 months',
    realWorldExample: 'A legal firm reduced contract review time from 4 hours to 20 minutes while achieving 95% accuracy in key clause identification.',
    prerequisite: ['Document repository', 'Processing requirements', 'Output format specifications'],
    successMetrics: ['Processing time reduction by 90%', 'Accuracy improvement by 85%', 'Knowledge retrieval speed increase by 500%']
  }
];

export const GOAL_CATEGORIES = [
  'Sales',
  'Marketing', 
  'Relationship',
  'Automation',
  'Analytics',
  'Content',
  'Admin',
  'AI-Native'
];

export default GOALS;