'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe, Building2, KeyRound, Coins } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth.store';
import { api } from '@/lib/api-client';

interface Stats {
  sites: number;
  businesses: number;
  licenses: number;
  credits: number;
}

export default function DashboardPage() {
  const { user, organization } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.get<Stats>('/stats');
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      name: 'Total Sites',
      value: stats?.sites ?? 0,
      icon: Globe,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/sites',
    },
    {
      name: 'Businesses',
      value: stats?.businesses ?? 0,
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/businesses',
    },
    {
      name: 'Active Licenses',
      value: stats?.licenses ?? 0,
      icon: KeyRound,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '/licenses',
    },
    {
      name: 'Credits Remaining',
      value: stats?.credits?.toLocaleString() ?? 0,
      icon: Coins,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      href: '/credits',
    },
  ];

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
        {statCards.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.name}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <p className="text-2xl font-bold">{stat.value}</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/sites">
              <button className="w-full flex items-center gap-3 p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Add Site</p>
                  <p className="text-sm text-gray-500">Connect a new WordPress site</p>
                </div>
              </button>
            </Link>
            <Link href="/licenses">
              <button className="w-full flex items-center gap-3 p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <KeyRound className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Generate License</p>
                  <p className="text-sm text-gray-500">Create a new license key</p>
                </div>
              </button>
            </Link>
            <Link href="/credits">
              <button className="w-full flex items-center gap-3 p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Coins className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">Buy Credits</p>
                  <p className="text-sm text-gray-500">Top up your credit balance</p>
                </div>
              </button>
            </Link>
            <Link href="/businesses">
              <button className="w-full flex items-center gap-3 p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Building2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">View Businesses</p>
                  <p className="text-sm text-gray-500">See all tracked businesses</p>
                </div>
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}