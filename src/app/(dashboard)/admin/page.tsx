'use client';

import { useState } from 'react';
import { Search, Users, Building2, Globe, Coins, TrendingUp, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const platformStats = [
  { name: 'Total Organizations', value: '156', icon: Building2, change: '+12 this month' },
  { name: 'Total Users', value: '423', icon: Users, change: '+28 this month' },
  { name: 'Active Sites', value: '892', icon: Globe, change: '+45 this month' },
  { name: 'Credits Used', value: '1.2M', icon: Coins, change: '+180K this month' },
];

const mockOrganizations = [
  {
    id: '1',
    name: 'High Ground Jiu Jitsu',
    owner: 'Brian',
    email: 'brian@highgroundjiujitsu.com',
    tier: 'agency',
    sites: 4,
    credits: 8500,
    createdAt: '2025-06-15',
  },
  {
    id: '2',
    name: 'Dallas SEO Agency',
    owner: 'Mike Johnson',
    email: 'mike@dallasseo.com',
    tier: 'growth',
    sites: 12,
    credits: 1200,
    createdAt: '2025-08-22',
  },
  {
    id: '3',
    name: 'Plano Marketing Co',
    owner: 'Sarah Smith',
    email: 'sarah@planomarketing.com',
    tier: 'starter',
    sites: 3,
    credits: 340,
    createdAt: '2025-11-10',
  },
  {
    id: '4',
    name: 'Fort Worth Digital',
    owner: 'James Wilson',
    email: 'james@fwdigital.com',
    tier: 'free',
    sites: 1,
    credits: 50,
    createdAt: '2026-01-05',
  },
];

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrgs = mockOrganizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTierBadge = (tier: string) => {
    const colors: Record<string, string> = {
      free: 'bg-gray-100 text-gray-700',
      starter: 'bg-blue-100 text-blue-700',
      growth: 'bg-green-100 text-green-700',
      agency: 'bg-purple-100 text-purple-700',
      enterprise: 'bg-orange-100 text-orange-700',
    };
    return (
      <Badge className={`${colors[tier]} hover:${colors[tier]}`}>
        {tier.charAt(0).toUpperCase() + tier.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-purple-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Platform-wide management and statistics</p>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {platformStats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Organizations List */}
      <Card>
        <CardHeader>
          <CardTitle>All Organizations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search organizations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-gray-500">Organization</th>
                  <th className="pb-3 font-medium text-gray-500">Owner</th>
                  <th className="pb-3 font-medium text-gray-500">Tier</th>
                  <th className="pb-3 font-medium text-gray-500">Sites</th>
                  <th className="pb-3 font-medium text-gray-500">Credits</th>
                  <th className="pb-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrgs.map((org) => (
                  <tr key={org.id} className="border-b last:border-0">
                    <td className="py-3">
                      <p className="font-medium">{org.name}</p>
                      <p className="text-sm text-gray-500">{org.email}</p>
                    </td>
                    <td className="py-3">{org.owner}</td>
                    <td className="py-3">{getTierBadge(org.tier)}</td>
                    <td className="py-3">{org.sites}</td>
                    <td className="py-3">{org.credits.toLocaleString()}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Impersonate</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}