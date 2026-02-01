'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Building2, MapPin, Phone, Trash2 } from 'lucide-react';
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

interface Business {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  phone: string | null;
  website: string | null;
  category: string | null;
  siteId: string;
  siteName: string;
  createdAt: string;
}

interface Site {
  id: string;
  name: string;
}

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState<Business | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newBusiness, setNewBusiness] = useState({
    siteId: '',
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    category: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bizData, sitesData] = await Promise.all([
        api.get<Business[]>('/businesses'),
        api.get<Site[]>('/sites'),
      ]);
      setBusinesses(bizData);
      setSites(sitesData);
    } catch (error) {
      toast.error('Failed to load businesses');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBusinesses = businesses.filter(
    (biz) =>
      biz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      biz.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      biz.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddBusiness = async () => {
    if (!newBusiness.siteId || !newBusiness.name) {
      toast.error('Please select a site and enter a business name');
      return;
    }

    setIsSubmitting(true);
    try {
      const business = await api.post<Business>('/businesses', newBusiness);
      setBusinesses([business, ...businesses]);
      setIsAddDialogOpen(false);
      setNewBusiness({
        siteId: '',
        name: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        category: '',
      });
      toast.success('Business added successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add business');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBusiness = async () => {
    if (!businessToDelete) return;

    try {
      await api.delete(`/businesses/${businessToDelete.id}`);
      setBusinesses(businesses.filter((b) => b.id !== businessToDelete.id));
      setIsDeleteDialogOpen(false);
      setBusinessToDelete(null);
      toast.success('Business deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete business');
    }
  };

  const openDeleteDialog = (business: Business) => {
    setBusinessToDelete(business);
    setIsDeleteDialogOpen(true);
  };

  const formatAddress = (biz: Business) => {
    const parts = [biz.address, biz.city, biz.state, biz.zip].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'No address';
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
          <h1 className="text-2xl font-bold text-gray-900">Businesses</h1>
          <p className="text-gray-500">Manage your tracked businesses</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} disabled={sites.length === 0}>
          <Plus className="h-4 w-4 mr-2" />
          Add Business
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search businesses..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {sites.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No sites yet</h3>
            <p className="text-gray-500 text-center mt-1">
              Add a site first before adding businesses
            </p>
          </CardContent>
        </Card>
      ) : filteredBusinesses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No businesses found</h3>
            <p className="text-gray-500 text-center mt-1">
              {searchQuery ? 'Try adjusting your search query' : 'Add your first business to get started'}
            </p>
            {!searchQuery && (
              <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Business
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBusinesses.map((biz) => (
            <Card key={biz.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Building2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{biz.name}</CardTitle>
                      {biz.category && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {biz.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => openDeleteDialog(biz)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {formatAddress(biz)}
                </div>
                {biz.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {biz.phone}
                  </div>
                )}
                <div className="pt-2 mt-2 border-t text-xs text-gray-500">
                  From: {biz.siteName}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Business Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Business</DialogTitle>
            <DialogDescription>
              Add a new business to track
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="site">Site</Label>
              <Select
                value={newBusiness.siteId}
                onValueChange={(value) => setNewBusiness({ ...newBusiness, siteId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a site" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Business Name</Label>
              <Input
                id="name"
                value={newBusiness.name}
                onChange={(e) => setNewBusiness({ ...newBusiness, name: e.target.value })}
                placeholder="My Business"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={newBusiness.category}
                onChange={(e) => setNewBusiness({ ...newBusiness, category: e.target.value })}
                placeholder="e.g., Restaurant, HVAC, Roofing"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={newBusiness.address}
                onChange={(e) => setNewBusiness({ ...newBusiness, address: e.target.value })}
                placeholder="123 Main St"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={newBusiness.city}
                  onChange={(e) => setNewBusiness({ ...newBusiness, city: e.target.value })}
                  placeholder="Dallas"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={newBusiness.state}
                  onChange={(e) => setNewBusiness({ ...newBusiness, state: e.target.value })}
                  placeholder="TX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP</Label>
                <Input
                  id="zip"
                  value={newBusiness.zip}
                  onChange={(e) => setNewBusiness({ ...newBusiness, zip: e.target.value })}
                  placeholder="75001"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newBusiness.phone}
                onChange={(e) => setNewBusiness({ ...newBusiness, phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBusiness} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Business'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Business</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{businessToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBusiness}
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