import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Download,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Wallet
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import type { RevenueSharing, PartnerBilling } from '@shared/schema';

interface RevenueSummary {
  totalRevenue: number;
  totalCommission: number;
  pendingPayouts: number;
  paidPayouts: number;
  commissionRate: number;
  growthRate: number;
}

interface MonthlyData {
  month: string;
  revenue: number;
  commission: number;
  customers: number;
}

interface PayoutStatus {
  pending: number;
  paid: number;
  disputed: number;
}

export default function RevenueSharingDashboard() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('last-6-months');

  // Fetch partner data
  const { data: partnerData } = useQuery({
    queryKey: ['partner', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/partners/user/${user?.id}`);
      return response.json();
    },
    enabled: !!user?.id,
  });

  // Fetch revenue summary
  const { data: revenueSummary, isLoading: summaryLoading } = useQuery<RevenueSummary>({
    queryKey: ['revenue-summary', partnerData?.id, selectedPeriod],
    queryFn: async () => {
      const response = await fetch(`/api/partners/${partnerData.id}/revenue-summary?period=${selectedPeriod}`);
      return response.json();
    },
    enabled: !!partnerData?.id,
  });

  // Fetch monthly revenue data
  const { data: monthlyData, isLoading: monthlyLoading } = useQuery<MonthlyData[]>({
    queryKey: ['monthly-revenue', partnerData?.id, selectedPeriod],
    queryFn: async () => {
      const response = await fetch(`/api/partners/${partnerData.id}/monthly-revenue?period=${selectedPeriod}`);
      return response.json();
    },
    enabled: !!partnerData?.id,
  });

  // Fetch revenue sharing records
  const { data: revenueRecords, isLoading: recordsLoading } = useQuery<RevenueSharing[]>({
    queryKey: ['revenue-records', partnerData?.id],
    queryFn: async () => {
      const response = await fetch(`/api/partners/${partnerData.id}/revenue-records`);
      return response.json();
    },
    enabled: !!partnerData?.id,
  });

  // Fetch billing history
  const { data: billingHistory, isLoading: billingLoading } = useQuery<PartnerBilling[]>({
    queryKey: ['billing-history', partnerData?.id],
    queryFn: async () => {
      const response = await fetch(`/api/partners/${partnerData.id}/billing-history`);
      return response.json();
    },
    enabled: !!partnerData?.id,
  });

  const handleDownloadReport = () => {
    // Download revenue report
    window.open(`/api/partners/${partnerData.id}/revenue-report?period=${selectedPeriod}`, '_blank');
  };

  const handleRequestPayout = () => {
    // Request manual payout
    console.log('Requesting manual payout');
  };

  // Calculate payout status
  const payoutStatus: PayoutStatus = revenueRecords?.reduce((acc, record) => {
    acc[record.status as keyof PayoutStatus] = (acc[record.status as keyof PayoutStatus] || 0) + parseFloat(record.partnerCommission);
    return acc;
  }, { pending: 0, paid: 0, disputed: 0 }) || { pending: 0, paid: 0, disputed: 0 };

  const statusColors = ['#f59e0b', '#10b981', '#ef4444'];
  const payoutData = [
    { name: 'Pending', value: payoutStatus.pending },
    { name: 'Paid', value: payoutStatus.paid },
    { name: 'Disputed', value: payoutStatus.disputed },
  ];

  if (summaryLoading || monthlyLoading || recordsLoading || billingLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Revenue Sharing</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your earnings and commission payouts
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border rounded-full"
          >
            <option value="last-3-months">Last 3 Months</option>
            <option value="last-6-months">Last 6 Months</option>
            <option value="last-12-months">Last 12 Months</option>
            <option value="ytd">Year to Date</option>
          </select>
          <Button onClick={handleDownloadReport} variant="outline" className="rounded-full">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={handleRequestPayout} className="rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
            <Wallet className="h-4 w-4 mr-2" />
            Request Payout
          </Button>
        </div>
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueSummary?.totalRevenue?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{revenueSummary?.growthRate || 0}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueSummary?.totalCommission?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              {revenueSummary?.commissionRate || 20}% commission rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueSummary?.pendingPayouts?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              Next payout in 5 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Out</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueSummary?.paidPayouts?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total paid to date
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue and commission over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="Revenue"
                />
                <Line 
                  type="monotone" 
                  dataKey="commission" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Commission"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payout Status */}
        <Card>
          <CardHeader>
            <CardTitle>Payout Status</CardTitle>
            <CardDescription>Distribution of commission payouts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={payoutData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {payoutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest revenue sharing and billing records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium">Period</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Customer Revenue</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Commission</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Platform Fee</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Paid Date</th>
                </tr>
              </thead>
              <tbody>
                {revenueRecords?.slice(0, 10).map((record) => (
                  <tr key={record.id} className="border-b">
                    <td className="p-4 font-medium">{record.billingPeriod}</td>
                    <td className="p-4">${parseFloat(record.customerRevenue).toLocaleString()}</td>
                    <td className="p-4 font-medium text-green-600">
                      ${parseFloat(record.partnerCommission).toLocaleString()}
                    </td>
                    <td className="p-4">${parseFloat(record.platformFee).toLocaleString()}</td>
                    <td className="p-4">
                      <Badge 
                        variant={record.status === 'paid' ? 'default' : 
                                record.status === 'pending' ? 'secondary' : 'destructive'}
                      >
                        {record.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {record.paidAt ? new Date(record.paidAt).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(!revenueRecords || revenueRecords.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              No revenue records found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Monthly billing statements and invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium">Period</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Total Revenue</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Commission</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Customers</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory?.slice(0, 10).map((bill) => (
                  <tr key={bill.id} className="border-b">
                    <td className="p-4 font-medium">{bill.billingPeriod}</td>
                    <td className="p-4">${parseFloat(bill.totalRevenue).toLocaleString()}</td>
                    <td className="p-4 font-medium text-green-600">
                      ${parseFloat(bill.totalCommission).toLocaleString()}
                    </td>
                    <td className="p-4">{bill.totalCustomers}</td>
                    <td className="p-4">
                      <Badge 
                        variant={bill.status === 'paid' ? 'default' : 
                                bill.status === 'sent' ? 'secondary' : 'outline'}
                      >
                        {bill.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {bill.invoiceUrl ? (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={bill.invoiceUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(!billingHistory || billingHistory.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              No billing history found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}