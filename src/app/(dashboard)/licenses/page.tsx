'use client';

import { useState } from 'react';
import { Plus, Search, KeyRound, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const mockLicenses = [
  {
    id: '1',
    key: 'RR-SCAN-A1B2C3D4E5F6',
    plugin: 'rapidscan',
    status: 'active',
    siteName: 'High Ground Jiu Jitsu',
    activatedAt: '2026-01-15T10:00:00Z',
    expiresAt: '2027-01-15T10:00:00Z',
  },
  {
    id: '2',
    key: 'RR-BUILD-G7H8I9J0K1L2',
    plugin: 'rapidbuild',
    status: 'active',
    siteName: 'Dallas Roofing Pros',
    activatedAt: '2026-01-20T14:30:00Z',
    expiresAt: '2027-01-20T14:30:00Z',
  },
  {
    id: '3',
    key: 'RR-REPORT-M3N4O5P6Q7R8',
    plugin: 'rapidreport',
    status: 'inactive',
    siteName: null,
    activatedAt: null,
    expiresAt: null,
  },
  {
    id: '4',
    key: 'RR-GBP-S9T0U1V2W3X4',
    plugin: 'rapidgbp',
    status: 'expired',
    siteName: 'Plano HVAC Services',
    activatedAt: '2025-01-10T09:00:00Z',
    expiresAt: '2026-01-10T09:00:00Z',
  },
];

const pluginNames: Record<string, string> = {
  rapidscan: 'RapidScan',
  rapidbuild: 'RapidBuild',
  rapidreport: 'RapidReport',
  rapidgbp: 'RapidGBP',
};

const pluginColors: Record<string, string> = {
  rapidscan: 'bg-blue-100 text-blue-700',
  rapidbuild: 'bg-purple-100 text-purple-700',
  rapidreport: 'bg-green-100 text-green-700',
  rapidgbp: 'bg-orange-100 text-orange-700',
};

export default function LicensesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLicenses = mockLicenses.filter(
    (license) =>
      license.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pluginNames[license.plugin].toLowerCase().includes(searchQuery.toLowerCase()) ||
      license.siteName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyToClipboard = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    toast.success('License key copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Inactive</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Expired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Licenses</h1>
          <p className="text-gray-500">Manage your plugin license keys</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Generate License
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search licenses..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredLicenses.map((license) => (
          <Card key={license.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <KeyRound className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      <Badge className={pluginColors[license.plugin]}>
                        {pluginNames[license.plugin]}
                      </Badge>
                    </CardTitle>
                  </div>
                </div>
                {getStatusBadge(license.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono truncate">
                  {license.key}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(license.id, license.key)}
                >
                  {copiedId === license.id ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Site</p>
                  <p className="font-medium">{license.siteName || 'Not activated'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Expires</p>
                  <p className="font-medium">{formatDate(license.expiresAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}