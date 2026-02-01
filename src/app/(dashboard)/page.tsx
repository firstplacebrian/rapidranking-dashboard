'use client';

import { Globe, Building2, KeyRound, Coins } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth.store';

const stats = [
  {
    name: 'Total Sites',
    value: '12',
    icon: Globe,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    name: 'Businesses',
    value: '48',
    icon: Building2,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    name: 'Active Licenses',
    value: '8',
    icon: KeyRound,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    name: 'Credits Remaining',
    value: '2,450',
    icon: Coins,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
];

export default function DashboardPage() {
  const { user, organization } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0] || 'there'}!
        </h1>
        <p className="text-gray-500">
          Here's what's happening with {organization?.name || 'your organization'} today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.name}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="flex items-center gap-3 p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Add Site</p>
                <p className="text-sm text-gray-500">Connect a new WordPress site</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="p-2 bg-purple-100 rounded-lg">
                <KeyRound className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Generate License</p>
                <p className="text-sm text-gray-500">Create a new license key</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Coins className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium">Buy Credits</p>
                <p className="text-sm text-gray-500">Top up your credit balance</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">View Businesses</p>
                <p className="text-sm text-gray-500">See all tracked businesses</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity to show.</p>
            <p className="text-sm">Activity from your sites will appear here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}