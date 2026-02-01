'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Globe, Building2, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockSiteData: Record<string, any> = {
  '1': {
    id: '1',
    name: 'High Ground Jiu Jitsu',
    url: 'https://highgroundjiujitsu.com',
    status: 'active',
    lastSyncAt: '2026-01-31T10:30:00Z',
    businessCount: 1,
    licenseCount: 2,
  },
  '2': {
    id: '2',
    name: 'Dallas Roofing Pros',
    url: 'https://dallasroofingpros.com',
    status: 'active',
    lastSyncAt: '2026-01-31T09:15:00Z',
    businessCount: 3,
    licenseCount: 1,
  },
  '3': {
    id: '3',
    name: 'Plano HVAC Services',
    url: 'https://planohvac.com',
    status: 'inactive',
    lastSyncAt: '2026-01-28T14:00:00Z',
    businessCount: 2,
    licenseCount: 0,
  },
};

export default function SiteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const site = mockSiteData[id];

  if (!site) {
    return (
      <div className="space-y-6">
        <Link href="/sites" className="flex items-center gap-2 text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Sites
        </Link>
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold">Site not found</h2>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Link href="/sites" className="flex items-center gap-2 text-gray-500 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" />
        Back to Sites
      </Link>

      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Globe className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{site.name}</h1>
            {getStatusBadge(site.status)}
          </div>
          <p className="text-gray-500">{site.url}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Businesses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{site.businessCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Licenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{site.licenseCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Last Sync</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{new Date(site.lastSyncAt).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}