'use client';

import { useState } from 'react';
import { Search, Building2, MapPin, Phone, Globe, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockBusinesses = [
  {
    id: '1',
    name: 'High Ground Jiu Jitsu',
    address: '123 Main St, Garland, TX 75040',
    phone: '(972) 555-0123',
    website: 'https://highgroundjiujitsu.com',
    category: 'Martial Arts School',
    rating: 4.9,
    reviewCount: 127,
    siteName: 'High Ground Jiu Jitsu',
  },
  {
    id: '2',
    name: 'Dallas Roofing Experts',
    address: '456 Oak Ave, Dallas, TX 75201',
    phone: '(214) 555-0456',
    website: 'https://dallasroofingpros.com',
    category: 'Roofing Contractor',
    rating: 4.7,
    reviewCount: 89,
    siteName: 'Dallas Roofing Pros',
  },
  {
    id: '3',
    name: 'Plano AC & Heating',
    address: '789 Elm Blvd, Plano, TX 75024',
    phone: '(469) 555-0789',
    website: 'https://planohvac.com',
    category: 'HVAC Contractor',
    rating: 4.8,
    reviewCount: 56,
    siteName: 'Plano HVAC Services',
  },
];

export default function BusinessesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBusinesses = mockBusinesses.filter(
    (biz) =>
      biz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      biz.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      biz.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Businesses</h1>
        <p className="text-gray-500">View all businesses synced from your sites</p>
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
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {biz.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400" />
                {biz.address}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-gray-400" />
                {biz.phone}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{biz.rating}</span>
                <span className="text-gray-500">({biz.reviewCount} reviews)</span>
              </div>
              <div className="pt-2 mt-2 border-t text-xs text-gray-500">
                From: {biz.siteName}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}