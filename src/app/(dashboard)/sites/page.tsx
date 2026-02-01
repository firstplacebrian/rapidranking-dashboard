'use client';

import { useState } from 'react';
import { Plus, Search, Globe, MoreHorizontal, ExternalLink, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const mockSites = [
  {
    id: '1',
    name: 'High Ground Jiu Jitsu',
    url: 'https://highgroundjiujitsu.com',
    status: 'active',
    lastSyncAt: '2026-01-31T10:30:00Z',
    businessCount: 1,
  },
  {
    id: '2',
    name: 'Dallas Roofing Pros',
    url: 'https://dallasroofingpros.com',
    status: 'active',
    lastSyncAt: '2026-01-31T09:15:00Z',
    businessCount: 3,
  },
];

export default function SitesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSites = mockSites.filter(
    (site) =>
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sites</h1>
          <p className="text-gray-500">Manage your connected WordPress sites</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Site
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search sites..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSites.map((site) => (
          <Card key={site.id}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                {site.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{site.url}</p>
              <p className="text-sm mt-2">{site.businessCount} businesses</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}