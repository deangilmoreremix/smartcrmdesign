import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  BarChart3, 
  Plus,
  Search,
  Filter,
  Download,
  Bell,
  Calendar,
  Mail
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import type { Partner, FeaturePackage } from '@shared/schema';

interface PartnerMetrics {
  totalCustomers: number;
  monthlyRevenue: number;
  commissionEarned: number;
  growthRate: number;
  activeSubscriptions: number;
  churnRate: number;
}

interface CustomerAnalytics {
  id: string;
  name: string;
  email: string;
  package: string;
  status: 'active' | 'suspended' | 'cancelled';
  monthlyValue: number;
  joinDate: string;
  lastActive: string;
  usageScore: number;
}

export default function PartnerManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch all partners
  const { data: partnersData, isLoading: partnersLoading } = useQuery<Partner[]>({
    queryKey: ['partners'],
    queryFn: async () => {
      const response = await fetch('/api/partners');
      return response.json();
    },
  });

  // Fetch feature packages
  const { data: featurePackages, isLoading: packagesLoading } = useQuery<FeaturePackage[]>({
    queryKey: ['feature-packages'],
    queryFn: async () => {
      const response = await fetch('/api/feature-packages');
      return response.json();
    },
  });

  // Mock metrics for display (will be replaced with real data when partner-specific APIs are ready)
  const metrics: PartnerMetrics = {
    totalCustomers: partnersData?.length || 0,
    monthlyRevenue: 25000,
    commissionEarned: 3750,
    growthRate: 12.5,
    activeSubscriptions: partnersData?.filter((p: Partner) => p.status === 'active').length || 0,
    churnRate: 2.1
  };

  // Mock customer data
  const customers: CustomerAnalytics[] = [
    {
      id: '1',
      name: 'Acme Corp',
      email: 'admin@acme.com',
      package: 'Enterprise',
      status: 'active',
      monthlyValue: 299,
      joinDate: '2024-01-15',
      lastActive: '2024-06-28',
      usageScore: 95
    }
  ];

  // Filter customers based on search and filters
  const filteredCustomers = customers?.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPackage = selectedPackage === 'all' || customer.package === selectedPackage;
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesPackage && matchesStatus;
  }) || [];

  const handleInviteCustomer = () => {
    // Open customer invitation modal
    console.log('Opening customer invitation modal');
  };

  const handleExportData = () => {
    // Export customer data to CSV
    console.log('Exporting customer data');
  };

  if (partnersLoading || packagesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Partner Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your reseller partnerships and customer relationships</p>
        </div>
        <Button onClick={handleInviteCustomer} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Invite Customer
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              +{metrics.growthRate}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{metrics.growthRate}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.commissionEarned.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{metrics.growthRate}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.activeSubscriptions} active subscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15%</div>
            <p className="text-xs text-muted-foreground">
              Of customer revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.churnRate}%</div>
            <p className="text-xs text-muted-foreground">
              -{Math.abs(metrics.churnRate - 3.2).toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Management Section */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Analytics & Management</CardTitle>
          <CardDescription>
            Monitor and manage your customer relationships and subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <select
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Packages</option>
              {featurePackages?.map((pkg: FeaturePackage) => (
                <option key={pkg.id} value={pkg.name}>{pkg.name}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button variant="outline" onClick={handleExportData} className="ml-auto">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Customer Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Customer</th>
                  <th className="text-left p-4">Package</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Monthly Value</th>
                  <th className="text-left p-4">Join Date</th>
                  <th className="text-left p-4">Usage Score</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-gray-500">
                      No customers found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{customer.package}</Badge>
                      </td>
                      <td className="p-4">
                        <Badge 
                          variant={customer.status === 'active' ? 'default' : 
                                  customer.status === 'suspended' ? 'secondary' : 'destructive'}
                        >
                          {customer.status}
                        </Badge>
                      </td>
                      <td className="p-4 font-medium">${customer.monthlyValue}</td>
                      <td className="p-4 text-sm text-gray-600">{customer.joinDate}</td>
                      <td className="p-4">
                        <Badge variant={customer.usageScore >= 80 ? 'default' : 'secondary'}>
                          {customer.usageScore}%
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Mail className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Calendar className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}