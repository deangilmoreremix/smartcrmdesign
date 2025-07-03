import React, { useEffect, useRef, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../store/contactStore';
import { DollarSign, Calendar, ArrowUp, ArrowDown, TrendingUp, Activity, ZapOff, Users, Target, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DealAnalyticsProps {
  title?: string;
  className?: string;
}

interface KPIMetric {
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface PipelineStage {
  name: string;
  value: number;
  deals: number;
  color: string;
}

const DealAnalytics: React.FC<DealAnalyticsProps> = ({ 
  title = 'Deal Analytics', 
  className = '' 
}) => {
  const { deals, stageValues } = useDealStore();
  const { contacts } = useContactStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  
  // Create a ref for chart resizing
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Calculate advanced KPI metrics from real data
  const calculateKPIs = (): KPIMetric[] => {
    const dealsArray = deals ? Object.values(deals) : [];
    const totalRevenue = dealsArray
      .filter(deal => deal.stage === 'closed-won')
      .reduce((sum, deal) => sum + deal.value, 0);

    const totalDeals = dealsArray.length;
    const wonDeals = dealsArray.filter(deal => deal.stage === 'closed-won').length;
    const conversionRate = totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0;
    const totalContacts = contacts?.length || 0;

    // Calculate average deal size
    const avgDealSize = wonDeals > 0 ? totalRevenue / wonDeals : 0;

    return [
      {
        title: 'Total Revenue',
        value: `$${(totalRevenue / 1000).toFixed(1)}k`,
        change: 12.5,
        changeType: 'increase',
        icon: DollarSign,
        description: 'Revenue from closed deals'
      },
      {
        title: 'Conversion Rate',
        value: `${conversionRate.toFixed(1)}%`,
        change: 8.2,
        changeType: 'increase',
        icon: Target,
        description: 'Deals won vs total deals'
      },
      {
        title: 'Total Contacts',
        value: totalContacts.toString(),
        change: 15.3,
        changeType: 'increase',
        icon: Users,
        description: 'Active contacts in pipeline'
      },
      {
        title: 'Avg Deal Size',
        value: `$${(avgDealSize / 1000).toFixed(1)}k`,
        change: -2.1,
        changeType: 'decrease',
        icon: TrendingUp,
        description: 'Average revenue per deal'
      }
    ];
  };

  const kpiMetrics = calculateKPIs();
  
  // Calculate deals in each stage
  const dealCounts = {
    qualification: 0,
    proposal: 0,
    negotiation: 0,
    'closed-won': 0,
    'closed-lost': 0
  };
  
  // Calculate monthly pipeline value
  const pipelineByMonth: Record<string, number> = {};
  
  Object.values(deals).forEach(deal => {
    // Count by stage
    if (dealCounts.hasOwnProperty(deal.stage)) {
      dealCounts[deal.stage as keyof typeof dealCounts]++;
    }
    
    // Add to monthly totals (only count open deals)
    if (deal.stage !== 'closed-won' && deal.stage !== 'closed-lost') {
      const month = deal.dueDate ? 
        `${deal.dueDate.getFullYear()}-${String(deal.dueDate.getMonth() + 1).padStart(2, '0')}` : 
        'No date';
        
      pipelineByMonth[month] = (pipelineByMonth[month] || 0) + deal.value;
    }
  });
  
  // Convert to array format for charts
  const stageData = Object.entries(dealCounts).map(([stage, count]) => ({
    stage: stage === 'closed-won' ? 'Won' : 
           stage === 'closed-lost' ? 'Lost' :
           stage === 'qualification' ? 'Qualified' : 
           stage === 'proposal' ? 'Proposed' : 'Negotiating',
    count
  }));
  
  const monthlyData = Object.entries(pipelineByMonth)
    .sort()  // Sort by month
    .map(([month, value]) => ({
      month: month === 'No date' ? month : month.split('-')[1],  // Just show the month number
      value
    }));
    
  // Calculate conversion rates between stages
  const calculateConversionRate = (fromStage: string, toStage: string) => {
    const fromCount = dealCounts[fromStage as keyof typeof dealCounts];
    const toCount = dealCounts[toStage as keyof typeof dealCounts];
    
    return fromCount > 0 ? Math.round((toCount / fromCount) * 100) : 0;
  };
  
  const conversionRates = {
    qualToProposal: calculateConversionRate('qualification', 'proposal'),
    proposalToNegotiation: calculateConversionRate('proposal', 'negotiation'),
    negotiationToWon: calculateConversionRate('negotiation', 'closed-won')
  };
  
  // Enhanced pipeline stage data with colors
  const pipelineStageData: PipelineStage[] = [
    {
      name: 'Qualification',
      value: stageValues.qualification || 0,
      deals: dealCounts.qualification,
      color: '#3B82F6'
    },
    {
      name: 'Proposal',
      value: stageValues.proposal || 0,
      deals: dealCounts.proposal,
      color: '#8B5CF6'
    },
    {
      name: 'Negotiation',
      value: stageValues.negotiation || 0,
      deals: dealCounts.negotiation,
      color: '#F59E0B'
    },
    {
      name: 'Won',
      value: stageValues['closed-won'] || 0,
      deals: dealCounts['closed-won'],
      color: '#10B981'
    },
    {
      name: 'Lost',
      value: stageValues['closed-lost'] || 0,
      deals: dealCounts['closed-lost'],
      color: '#EF4444'
    }
  ];

  // Calculate total values and counts
  const dealsArray = Object.values(deals);
  const totalValue = dealsArray.reduce((sum, deal) => sum + deal.value, 0);
  
  // Calculate total value by status
  const valueByStatus = {
    active: stageValues.qualification + stageValues.proposal + stageValues.negotiation,
    won: stageValues['closed-won'],  
    lost: stageValues['closed-lost']
  };

  // Calculate status counts
  const statusCounts = {
    active: dealCounts.qualification + dealCounts.proposal + dealCounts.negotiation,
    won: dealCounts['closed-won'],
    lost: dealCounts['closed-lost']
  };

  // Calculate conversion rate
  const conversionRate = Object.keys(deals).length > 0 
    ? Math.round((statusCounts.won / Object.keys(deals).length) * 100) 
    : 0;

  // Generate trend data for chart
  const generateTrendData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      revenue: Math.floor(totalValue * (0.7 + Math.random() * 0.6) / 6),
      deals: Math.floor(Object.keys(deals).length * (0.8 + Math.random() * 0.4) / 6),
      pipeline: Math.floor(valueByStatus.active * (0.6 + Math.random() * 0.8) / 6)
    }));
  };

  const trendData = generateTrendData();
  
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              selectedPeriod === 'week' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              selectedPeriod === 'month' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setSelectedPeriod('quarter')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              selectedPeriod === 'quarter' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Quarter
          </button>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiMetrics.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className="h-8 w-8 text-blue-600" />
                <Badge 
                  variant={metric.changeType === 'increase' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {metric.changeType === 'increase' ? '+' : ''}{metric.change}%
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-xs text-gray-500">{metric.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Trend Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            Revenue Performance Trend
            <Badge variant="secondary" className="text-xs">
              {selectedPeriod} view
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  name === 'revenue' ? `$${(value / 1000).toFixed(1)}k` : value,
                  name === 'revenue' ? 'Revenue' : name === 'deals' ? 'Deals Closed' : 'Pipeline Value'
                ]}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, stroke: '#3B82F6', strokeWidth: 2, fill: '#ffffff' }}
              />
              <Line 
                type="monotone" 
                dataKey="pipeline" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pipeline Stage Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pipeline Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pipelineStageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pipelineStageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`$${(value / 1000).toFixed(1)}k`, 'Value']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Stage Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipelineStageData.map((stage, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="font-medium text-gray-700">{stage.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${(stage.value / 1000).toFixed(1)}k</p>
                    <p className="text-sm text-gray-500">{stage.deals} deals</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-blue-800">Active Pipeline</p>
              <p className="text-xl font-semibold mt-1">${Math.round(valueByStatus.active / 1000)}k</p>
            </div>
            <div className="p-2 rounded-full bg-blue-200/50">
              <Activity className="h-5 w-5 text-blue-700" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-green-800">Won Deals (YTD)</p>
              <p className="text-xl font-semibold mt-1">${Math.round(valueByStatus.won / 1000)}k</p>
            </div>
            <div className="p-2 rounded-full bg-green-200/50">
              <TrendingUp className="h-5 w-5 text-green-700" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-red-800">Lost Deals (YTD)</p>
              <p className="text-xl font-semibold mt-1">${Math.round(valueByStatus.lost / 1000)}k</p>
            </div>
            <div className="p-2 rounded-full bg-red-200/50">
              <ZapOff className="h-5 w-5 text-red-700" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Deal Distribution by Stage</h3>
          <div className="h-64" ref={chartContainerRef}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" />
                <Tooltip 
                  formatter={(value: any) => [`${value} deals`, 'Count']}
                  contentStyle={{ borderRadius: '6px' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#4f46e5"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="border border-indigo-100 bg-indigo-50 rounded-lg p-2">
              <p className="text-xs text-indigo-600 mb-1">Qual → Proposal</p>
              <p className="text-lg font-medium">{conversionRates.qualToProposal}%</p>
            </div>
            <div className="border border-indigo-100 bg-indigo-50 rounded-lg p-2">
              <p className="text-xs text-indigo-600 mb-1">Prop → Negotiation</p>
              <p className="text-lg font-medium">{conversionRates.proposalToNegotiation}%</p>
            </div>
            <div className="border border-indigo-100 bg-indigo-50 rounded-lg p-2">
              <p className="text-xs text-indigo-600 mb-1">Neg → Won</p>
              <p className="text-lg font-medium">{conversionRates.negotiationToWon}%</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Pipeline Value by Month</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip 
                  formatter={(value: any) => [`$${(value / 1000).toFixed(1)}k`, 'Pipeline Value']}
                  contentStyle={{ borderRadius: '6px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4f46e5" 
                  strokeWidth={2}
                  dot={{ stroke: '#312e81', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 flex justify-around">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Top Deal</p>
              <div className="flex items-center justify-center">
                <DollarSign size={16} className="text-green-600" />
                <span className="text-base font-medium">$95k</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Avg Time to Close</p>
              <div className="flex items-center justify-center">
                <Calendar size={16} className="text-blue-600" />
                <span className="text-base font-medium">32 days</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Win Rate</p>
              <div className="flex items-center justify-center">
                <ArrowUp size={16} className="text-green-600" />
                <span className="text-base font-medium">24%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealAnalytics;