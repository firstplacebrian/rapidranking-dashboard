'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, KeyRound, Copy, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';

interface License {
  id: string;
  key: string;
  plugin: string;
  status: string;
  activatedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  siteId: string | null;
  siteName: string | null;
}

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
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [licenseToDelete, setLicenseToDelete] = useState<License | null>(null);
  const [newPlugin, setNewPlugin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    try {
      const data = await api.get<License[]>('/licenses');
      setLicenses(data);
    } catch (error) {
      toast.error('Failed to load licenses');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLicenses = licenses.filter(
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

  const handleAddLicense = async () => {
    if (!newPlugin) {
      toast.error('Please select a plugin');
      return;
    }

    setIsSubmitting(true);
    try {
      const license = await api.post<License>('/licenses', { plugin: newPlugin });
      setLicenses([license, ...licenses]);
      setIsAddDialogOpen(false);
      setNewPlugin('');
      toast.success('License generated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate license');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLicense = async () => {
    if (!licenseToDelete) return;

    try {
      await api.delete(`/licenses/${licenseToDelete.id}`);
      setLicenses(licenses.filter((l) => l.id !== licenseToDelete.id));
      setIsDeleteDialogOpen(false);
      setLicenseToDelete(null);
      toast.success('License deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete license');
    }
  };

  const openDeleteDialog = (license: License) => {
    setLicenseToDelete(license);
    setIsDeleteDialogOpen(true);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Licenses</h1>
          <p className="text-gray-500">Manage your plugin license keys</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
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

      {filteredLicenses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <KeyRound className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No licenses found</h3>
            <p className="text-gray-500 text-center mt-1">
              {searchQuery ? 'Try adjusting your search query' : 'Generate your first license key'}
            </p>
            {!searchQuery && (
              <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Generate License
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
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
                  <div className="flex items-center gap-2">
                    {getStatusBadge(license.status)}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => openDeleteDialog(license)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
                    <p className="text-gray-500">Created</p>
                    <p className="font-medium">{formatDate(license.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add License Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate License</DialogTitle>
            <DialogDescription>
              Create a new license key for one of your plugins
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="plugin">Plugin</Label>
              <Select value={newPlugin} onValueChange={setNewPlugin}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plugin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rapidscan">RapidScan</SelectItem>
                  <SelectItem value="rapidbuild">RapidBuild</SelectItem>
                  <SelectItem value="rapidreport">RapidReport</SelectItem>
                  <SelectItem value="rapidgbp">RapidGBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLicense} disabled={isSubmitting}>
              {isSubmitting ? 'Generating...' : 'Generate License'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete License</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this license key? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLicense}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}