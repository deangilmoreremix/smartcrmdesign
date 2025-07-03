import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  Package, 
  Users, 
  Settings, 
  Plus,
  Edit,
  Trash2,
  Copy,
  DollarSign,
  Check,
  X,
  Zap,
  Shield,
  Crown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import type { FeaturePackage, InsertFeaturePackage } from '@shared/schema';

interface PackageFormData {
  name: string;
  description: string;
  tier: 'basic' | 'professional' | 'enterprise';
  price: string;
  billingCycle: 'monthly' | 'yearly';
  features: Record<string, boolean>;
  limits: Record<string, number>;
}

const defaultFeatures = {
  'contacts_basic': false,
  'contacts_advanced': false,
  'deals_basic': false,
  'deals_advanced': false,
  'ai_goals_basic': false,
  'ai_goals_custom': false,
  'ai_analysis': false,
  'email_integration': false,
  'calendar_integration': false,
  'advanced_analytics': false,
  'custom_branding': false,
  'subdomain': false,
  'custom_domain': false,
  'white_label_reselling': false,
};

const defaultLimits = {
  users: 10,
  contacts: 1000,
  deals: 500,
  storage_gb: 5,
  ai_requests: 100,
  api_calls: 1000,
};

export default function FeaturePackageManager() {
  const { user } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<FeaturePackage | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<PackageFormData>({
    name: '',
    description: '',
    tier: 'basic',
    price: '',
    billingCycle: 'monthly',
    features: { ...defaultFeatures },
    limits: { ...defaultLimits },
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch feature packages
  const { data: packages, isLoading } = useQuery<FeaturePackage[]>({
    queryKey: ['feature-packages'],
    queryFn: async () => {
      const response = await fetch('/api/feature-packages');
      return response.json();
    },
  });

  // Create package mutation
  const createPackageMutation = useMutation({
    mutationFn: async (data: InsertFeaturePackage) => {
      const response = await fetch('/api/feature-packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-packages'] });
      toast({ title: 'Package created successfully' });
      resetForm();
    },
  });

  // Update package mutation
  const updatePackageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertFeaturePackage> }) => {
      const response = await fetch(`/api/feature-packages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-packages'] });
      toast({ title: 'Package updated successfully' });
      setIsEditMode(false);
      setSelectedPackage(null);
    },
  });

  // Delete package mutation
  const deletePackageMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/feature-packages/${id}`, {
        method: 'DELETE',
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-packages'] });
      toast({ title: 'Package deleted successfully' });
      setSelectedPackage(null);
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      tier: 'basic',
      price: '',
      billingCycle: 'monthly',
      features: { ...defaultFeatures },
      limits: { ...defaultLimits },
    });
    setIsEditMode(false);
    setSelectedPackage(null);
  };

  const handleEditPackage = (pkg: FeaturePackage) => {
    setSelectedPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description || '',
      tier: pkg.tier as 'basic' | 'professional' | 'enterprise',
      price: pkg.price,
      billingCycle: pkg.billingCycle as 'monthly' | 'yearly',
      features: { ...defaultFeatures, ...(pkg.features as Record<string, boolean>) },
      limits: { ...defaultLimits, ...(pkg.limits as Record<string, number>) },
    });
    setIsEditMode(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const packageData: InsertFeaturePackage = {
      name: formData.name,
      description: formData.description,
      tier: formData.tier,
      price: formData.price,
      billingCycle: formData.billingCycle,
      features: formData.features,
      limits: formData.limits,
      isActive: true,
    };

    if (isEditMode && selectedPackage) {
      updatePackageMutation.mutate({ id: selectedPackage.id, data: packageData });
    } else {
      createPackageMutation.mutate(packageData);
    }
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature],
      },
    }));
  };

  const handleLimitChange = (limit: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      limits: {
        ...prev.limits,
        [limit]: value,
      },
    }));
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'basic': return <Zap className="h-4 w-4" />;
      case 'professional': return <Shield className="h-4 w-4" />;
      case 'enterprise': return <Crown className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'basic': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'professional': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'enterprise': return 'bg-gold-100 text-gold-800 dark:bg-gold-900 dark:text-gold-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (isLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Feature Packages</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create and manage tiered feature packages for your customers
          </p>
        </div>
        <Button onClick={() => setIsEditMode(true)} className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Package
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Package List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Existing Packages</h2>
          
          {packages?.map((pkg) => (
            <Card key={pkg.id} className={`transition-all duration-200 ${selectedPackage?.id === pkg.id ? 'ring-2 ring-purple-500' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={`${getTierColor(pkg.tier)} flex items-center gap-1`}>
                      {getTierIcon(pkg.tier)}
                      {pkg.tier}
                    </Badge>
                    <div>
                      <CardTitle className="text-lg">{pkg.name}</CardTitle>
                      <CardDescription>{pkg.description}</CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">${pkg.price}</div>
                    <div className="text-sm text-muted-foreground">/{pkg.billingCycle}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium mb-2">Features</h4>
                    <div className="text-sm text-muted-foreground">
                      {Object.entries(pkg.features as Record<string, boolean> || {})
                        .filter(([, enabled]) => enabled)
                        .slice(0, 3)
                        .map(([feature]) => (
                          <div key={feature} className="flex items-center gap-1">
                            <Check className="h-3 w-3 text-green-600" />
                            {feature.replace(/_/g, ' ')}
                          </div>
                        ))}
                      {Object.entries(pkg.features as Record<string, boolean> || {}).filter(([, enabled]) => enabled).length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{Object.entries(pkg.features as Record<string, boolean> || {}).filter(([, enabled]) => enabled).length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Limits</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {Object.entries(pkg.limits as Record<string, number> || {}).slice(0, 3).map(([limit, value]) => (
                        <div key={limit}>
                          {limit.replace(/_/g, ' ')}: {value}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditPackage(pkg)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(pkg.id)}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy ID
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => deletePackageMutation.mutate(pkg.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {(!packages || packages.length === 0) && (
            <Card>
              <CardContent className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No packages yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first feature package to get started
                </p>
                <Button onClick={() => setIsEditMode(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Package
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Package Form */}
        {isEditMode && (
          <Card>
            <CardHeader>
              <CardTitle>{selectedPackage ? 'Edit Package' : 'Create Package'}</CardTitle>
              <CardDescription>
                Define features, limits, and pricing for your package
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Package Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tier">Tier</Label>
                      <select
                        id="tier"
                        value={formData.tier}
                        onChange={(e) => setFormData(prev => ({ ...prev, tier: e.target.value as any }))}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="basic">Basic</option>
                        <option value="professional">Professional</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="billingCycle">Billing</Label>
                      <select
                        id="billingCycle"
                        value={formData.billingCycle}
                        onChange={(e) => setFormData(prev => ({ ...prev, billingCycle: e.target.value as any }))}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                {/* Features */}
                <div>
                  <Label>Features</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2 max-h-40 overflow-y-auto">
                    {Object.entries(formData.features).map(([feature, enabled]) => (
                      <label key={feature} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={() => handleFeatureToggle(feature)}
                          className="rounded"
                        />
                        <span className="text-sm">{feature.replace(/_/g, ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Limits */}
                <div>
                  <Label>Limits</Label>
                  <div className="space-y-2 mt-2">
                    {Object.entries(formData.limits).map(([limit, value]) => (
                      <div key={limit} className="flex items-center gap-2">
                        <Label className="text-sm flex-1">{limit.replace(/_/g, ' ')}</Label>
                        <Input
                          type="number"
                          value={value}
                          onChange={(e) => handleLimitChange(limit, parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={createPackageMutation.isPending || updatePackageMutation.isPending}
                  >
                    {selectedPackage ? 'Update Package' : 'Create Package'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}