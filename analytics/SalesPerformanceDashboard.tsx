import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, Target, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useContactStore } from '@/store/contactStore';
import { useDealStore } from '@/store/dealStore';

interface KPIMetric {
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface SalesData {
  month: string;
  revenue: number;
  deals: number;
  conversion: number;
}

interface PipelineStage {
  name: string;
  value: number;
  deals: number;
  color: string;
}

const SalesPerformanceDashboard: React.FC = () => {
  const { contacts } = useContactStore();
  const { deals } = useDealStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  // Calculate KPI metrics from real data
  const calculateKPIs = (): KPIMetric[] => {
    const totalRevenue = deals
      .filter(deal => deal.stage === 'closed-won')
      .reduce((sum, deal) => sum + deal.value, 0);

    const totalDeals = deals.length;
    const wonDeals = deals.filter(deal => deal.stage === 'closed-won').length;
    const conversionRate = totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0;
    const totalContacts = contacts.length;

    return [
      {
        title: 'Total Revenue',
        value: `$${totalRevenue.toLocaleString()}`,
        change: 12.5,
        changeType: 'increase',
        icon: DollarSign,
        description: 'Revenue from closed deals'
      },
      {
        title: 'Active Deals',
        value: totalDeals.toString(),
        change: 8.2,
        changeType: 'increase',
        icon: Target,
        description: 'Total deals in pipeline'
      },
      {
        title: 'Conversion Rate',
        value: `${conversionRate.toFixed(1)}%`,
        change: -2.1,
        changeType: 'decrease',
        icon: TrendingUp,
        description: 'Deals won vs total deals'
      },
      {
        title: 'Total Contacts',
        value: totalContacts.toString(),
        change: 15.3,
        changeType: 'increase',
        icon: Users,
        description: 'Active contacts in CRM'
      }
    ];
  };

  // Generate sales trend data
  const generateSalesTrend = (): SalesData[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => {
      const baseRevenue = 50000 + (index * 15000);
      const baseDeals = 25 + (index * 5);
      const revenue = baseRevenue + (Math.random() - 0.5) * 20000;
      const dealsCount = baseDeals + Math.floor((Math.random() - 0.5) * 10);
      
      return {
        month,
        revenue: Math.max(revenue, 30000),
        deals: Math.max(dealsCount, 15),
        conversion: 15 + Math.random() * 10
      };
    });
  };

  // Calculate pipeline stages from real deals
  const calculatePipelineStages = (): PipelineStage[] => {
    const stageColors = {
      'initial': '#f3f4f6',
      'qualification': '#dbeafe',
      'proposal': '#fbbf24',
      'negotiation': '#f59e0b',
      'closed-won': '#10b981',
      'closed-lost': '#ef4444'
    };

    const stageNames = {
      'initial': 'Initial Contact',
      'qualification': 'Qualification', 
      'proposal': 'Proposal',
      'negotiation': 'Negotiation',
      'closed-won': 'Closed Won',
      'closed-lost': 'Closed Lost'
    };

    const stageCounts = deals.reduce((acc, deal) => {
      acc[deal.stage] = (acc[deal.stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(stageCounts).map(([stage, count]) => ({
      name: stageNames[stage as keyof typeof stageNames] || stage,
      value: count,
      deals: count,
      color: stageColors[stage as keyof typeof stageColors] || '#gray'
    }));
  };

  const [kpis] = useState<KPIMetric[]>(calculateKPIs());
  const [salesTrend] = useState<SalesData[]>(generateSalesTrend());
  const [pipelineStages] = useState<PipelineStage[]>(calculatePipelineStages());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Sales Performance Dashboard</h2>
        <div className="flex gap-2">
          {(['week', 'month', 'quarter'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {kpi.changeType === 'increase' ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={kpi.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}>
                  {Math.abs(kpi.change)}%
                </span>
                <span className="ml-1">vs last {selectedPeriod}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'revenue' ? `$${value.toLocaleString()}` : value,
                    name === 'revenue' ? 'Revenue' : 'Deals'
                  ]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Revenue"
                />
                <Line 
                  type="monotone" 
                  dataKey="deals" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Deals"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Conversion Rate']} />
                <Bar dataKey="conversion" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline and Leaderboard */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pipeline Distribution */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pipeline Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pipelineStages}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pipelineStages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle>Deal Stages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipelineStages.map((stage, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="text-sm font-medium">{stage.name}</span>
                  </div>
                  <Badge variant="secondary">{stage.deals}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deals.slice(0, 5).map((deal, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium">{deal.title}</p>
                  <p className="text-sm text-gray-500">Stage: {deal.stage}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${deal.value.toLocaleString()}</p>
                  <Badge 
                    variant={deal.stage === 'closed-won' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {deal.stage}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesPerformanceDashboard;